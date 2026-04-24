export type DeliveryStatus = "not_sent" | "pending" | "sent" | "failed";

export interface NewsletterDeliveryRecord {
  id: string;
  week_key: string;
  recipient_email: string;
  recipient_user_id: string | null;
  send_status: Exclude<DeliveryStatus, "not_sent">;
  resend_email_id: string | null;
  sent_at: string | null;
  opened_at: string | null;
  open_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterRecipient {
  userId: string;
  email: string;
  createdAt: string;
  weekSendStatus: DeliveryStatus;
  weekOpened: boolean;
  weekSentAt: string | null;
  weekOpenedAt: string | null;
  weekOpenCount: number;
  lastSentAt: string | null;
  lastOpenedAt: string | null;
  deliveryId: string | null;
}

export interface NewsletterRecipientSummary {
  weekKey: string;
  totalRecipients: number;
  sentThisWeek: number;
  openedThisWeek: number;
  failedThisWeek: number;
  pendingThisWeek: number;
  unsentThisWeek: number;
  allSentThisWeek: boolean;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getCurrentWeekKey(date = new Date()) {
  const current = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = current.getUTCDay();
  const daysFromMonday = (day + 6) % 7;
  current.setUTCDate(current.getUTCDate() - daysFromMonday);

  return current.toISOString().slice(0, 10);
}

export function formatWeekLabel(weekKey: string) {
  return new Date(`${weekKey}T00:00:00.000Z`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
