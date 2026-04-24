import { NextResponse } from "next/server";

import WeeklyNewsletter from "@/emails/WeeklyNewsletter";
import {
  buildTrackingPixelUrl,
  getAuthenticatedAdminUser,
  getNewsletterRecipientsOverview,
} from "@/lib/newsletter-admin";
import { getNewsletterContent } from "@/lib/newsletter";
import { getCurrentWeekKey } from "@/lib/newsletter-shared";
import { FROM_EMAIL, resend } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";

type PendingDeliveryRow = {
  id: string;
  recipient_email: string;
  recipient_user_id: string;
};

export async function POST() {
  try {
    const adminUser = await getAuthenticatedAdminUser();

    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weekKey = getCurrentWeekKey();
    const { recipients, summary } = await getNewsletterRecipientsOverview(weekKey);
    const pendingRecipients = recipients.filter(
      (recipient) => recipient.weekSendStatus !== "sent",
    );

    if (pendingRecipients.length === 0) {
      return NextResponse.json({
        success: true,
        weekKey,
        attempted: 0,
        sent: 0,
        failed: 0,
        skipped: summary.sentThisWeek,
        totalRecipients: summary.totalRecipients,
        message: "Everyone on the list has already been sent this week.",
      });
    }

    const adminClient = createAdminClient();
    const upsertRows = pendingRecipients.map((recipient) => ({
      id: recipient.deliveryId ?? crypto.randomUUID(),
      week_key: weekKey,
      recipient_email: recipient.email,
      recipient_user_id: recipient.userId,
      send_status: "pending" as const,
      resend_email_id: null,
      sent_at: null,
      opened_at: null,
      open_count: 0,
    }));

    const { data: pendingRows, error: insertError } = await adminClient
      .from("newsletter_deliveries")
      .upsert(upsertRows, {
        onConflict: "week_key,recipient_email",
      })
      .select("id, recipient_email, recipient_user_id");

    if (insertError) {
      throw new Error(insertError.message);
    }

    const deliveriesByEmail = new Map<string, PendingDeliveryRow>();
    for (const row of (pendingRows ?? []) as PendingDeliveryRow[]) {
      deliveriesByEmail.set(row.recipient_email, row);
    }

    const content = await getNewsletterContent();
    const batchSize = 50;
    let sent = 0;
    let failed = 0;

    for (let index = 0; index < pendingRecipients.length; index += batchSize) {
      const batch = pendingRecipients.slice(index, index + batchSize);
      const results = await Promise.all(
        batch.map(async (recipient) => {
          const delivery = deliveriesByEmail.get(recipient.email);

          if (!delivery) {
            return {
              status: "failed" as const,
              recipient,
              error: "Missing delivery tracking row",
            };
          }

          const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: recipient.email,
            subject: `Your Weekly Baby Product Picks - ${content.date}`,
            react: WeeklyNewsletter({
              ...content,
              trackingPixelUrl: buildTrackingPixelUrl(delivery.id),
              weekKey,
            }),
          });

          if (error) {
            return {
              status: "failed" as const,
              recipient,
              deliveryId: delivery.id,
              error: error.message,
            };
          }

          return {
            status: "sent" as const,
            recipient,
            deliveryId: delivery.id,
            resendEmailId: data?.id ?? null,
          };
        }),
      );

      sent += results.filter((result) => result.status === "sent").length;
      failed += results.filter((result) => result.status === "failed").length;

      await Promise.all(
        results.map(async (result) => {
          if (!("deliveryId" in result) || !result.deliveryId) {
            return;
          }

          if (result.status === "sent") {
            await adminClient
              .from("newsletter_deliveries")
              .update({
                send_status: "sent",
                resend_email_id: result.resendEmailId,
                sent_at: new Date().toISOString(),
              })
              .eq("id", result.deliveryId);
            return;
          }

          await adminClient
            .from("newsletter_deliveries")
            .update({
              send_status: "failed",
            })
            .eq("id", result.deliveryId);
        }),
      );
    }

    return NextResponse.json({
      success: true,
      weekKey,
      attempted: pendingRecipients.length,
      sent,
      failed,
      skipped: summary.sentThisWeek,
      totalRecipients: summary.totalRecipients,
      message: `Sent ${sent} emails for the ${weekKey} newsletter.`,
    });
  } catch (error) {
    console.error("Manual newsletter send error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send weekly newsletter",
      },
      { status: 500 },
    );
  }
}
