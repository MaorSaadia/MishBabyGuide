import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getCurrentWeekKey,
  isValidEmail,
  type NewsletterDeliveryRecord,
  type NewsletterRecipient,
  type NewsletterRecipientSummary,
} from "@/lib/newsletter-shared";

type AuthUserRecord = {
  id: string;
  email: string;
  createdAt: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getNewsletterAdminEmails() {
  return (process.env.NEWSLETTER_ADMIN_EMAILS || "")
    .split(",")
    .map((value) => normalizeEmail(value))
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return getNewsletterAdminEmails().includes(normalizeEmail(email));
}

export async function getAuthenticatedAdminUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email || !isAdminEmail(user.email)) {
    return null;
  }

  return user;
}

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.mishbabyguide.com"
  );
}

export async function listAllAuthUsers() {
  const adminClient = createAdminClient();
  const recipients = new Map<string, AuthUserRecord>();
  const perPage = 200;
  let page = 1;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error(error.message);
    }

    const users = data.users ?? [];

    for (const user of users) {
      if (!user.email) {
        continue;
      }

      const normalizedEmail = normalizeEmail(user.email);

      if (!isValidEmail(normalizedEmail) || recipients.has(normalizedEmail)) {
        continue;
      }

      recipients.set(normalizedEmail, {
        id: user.id,
        email: normalizedEmail,
        createdAt: user.created_at ?? new Date().toISOString(),
      });
    }

    if (users.length < perPage) {
      break;
    }

    page += 1;
  }

  return Array.from(recipients.values()).sort((left, right) =>
    left.createdAt < right.createdAt ? 1 : -1,
  );
}

export async function getNewsletterRecipientsOverview(
  weekKey = getCurrentWeekKey(),
) {
  const adminClient = createAdminClient();
  const authUsers = await listAllAuthUsers();

  const { data: weekDeliveries, error: weekError } = await adminClient
    .from("newsletter_deliveries")
    .select("*")
    .eq("week_key", weekKey);

  if (weekError) {
    throw new Error(weekError.message);
  }

  const { data: allDeliveries, error: allError } = await adminClient
    .from("newsletter_deliveries")
    .select("recipient_email, sent_at, opened_at")
    .order("created_at", { ascending: false })
    .limit(10000);

  if (allError) {
    throw new Error(allError.message);
  }

  const weekByEmail = new Map<string, NewsletterDeliveryRecord>();
  for (const delivery of (weekDeliveries ?? []) as NewsletterDeliveryRecord[]) {
    weekByEmail.set(normalizeEmail(delivery.recipient_email), delivery);
  }

  const historyByEmail = new Map<
    string,
    { lastSentAt: string | null; lastOpenedAt: string | null }
  >();

  for (const delivery of allDeliveries ?? []) {
    const email = normalizeEmail(delivery.recipient_email);
    const existing = historyByEmail.get(email);

    historyByEmail.set(email, {
      lastSentAt: existing?.lastSentAt ?? delivery.sent_at,
      lastOpenedAt: existing?.lastOpenedAt ?? delivery.opened_at,
    });
  }

  const recipients: NewsletterRecipient[] = authUsers.map((user) => {
    const weekDelivery = weekByEmail.get(user.email);
    const history = historyByEmail.get(user.email);

    return {
      userId: user.id,
      email: user.email,
      createdAt: user.createdAt,
      weekSendStatus: weekDelivery?.send_status ?? "not_sent",
      weekOpened: Boolean(weekDelivery?.opened_at),
      weekSentAt: weekDelivery?.sent_at ?? null,
      weekOpenedAt: weekDelivery?.opened_at ?? null,
      weekOpenCount: weekDelivery?.open_count ?? 0,
      lastSentAt: history?.lastSentAt ?? null,
      lastOpenedAt: history?.lastOpenedAt ?? null,
      deliveryId: weekDelivery?.id ?? null,
    };
  });

  const summary: NewsletterRecipientSummary = {
    weekKey,
    totalRecipients: recipients.length,
    sentThisWeek: recipients.filter(
      (recipient) => recipient.weekSendStatus === "sent",
    ).length,
    openedThisWeek: recipients.filter((recipient) => recipient.weekOpened)
      .length,
    failedThisWeek: recipients.filter(
      (recipient) => recipient.weekSendStatus === "failed",
    ).length,
    pendingThisWeek: recipients.filter(
      (recipient) => recipient.weekSendStatus === "pending",
    ).length,
    unsentThisWeek: recipients.filter(
      (recipient) => recipient.weekSendStatus === "not_sent",
    ).length,
    allSentThisWeek:
      recipients.length > 0 &&
      recipients.every((recipient) => recipient.weekSendStatus === "sent"),
  };

  return { recipients, summary };
}

export function buildTrackingPixelUrl(deliveryId: string) {
  return `${getSiteUrl()}/api/newsletter/open?delivery=${encodeURIComponent(deliveryId)}`;
}
