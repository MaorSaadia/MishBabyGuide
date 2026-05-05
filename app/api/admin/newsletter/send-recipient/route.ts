import { NextResponse } from "next/server";

import WeeklyNewsletter from "@/emails/WeeklyNewsletter";
import {
  buildTrackingPixelUrl,
  getAuthenticatedAdminUser,
  getNewsletterRecipientsOverview,
} from "@/lib/newsletter-admin";
import { getNewsletterContent } from "@/lib/newsletter";
import { getCurrentWeekKey, isValidEmail } from "@/lib/newsletter-shared";
import { FROM_EMAIL, resend } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";

type DeliveryRow = {
  id: string;
  recipient_email: string;
  recipient_user_id: string | null;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const adminUser = await getAuthenticatedAdminUser();

    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const email =
      typeof body.email === "string" ? normalizeEmail(body.email) : "";
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";

    if (!email || !isValidEmail(email) || !userId) {
      return NextResponse.json(
        { error: "A valid recipient email and user ID are required" },
        { status: 400 },
      );
    }

    const weekKey = getCurrentWeekKey();
    const { recipients } = await getNewsletterRecipientsOverview(weekKey);
    const recipient = recipients.find(
      (item) => item.email === email && item.userId === userId,
    );

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient was not found in Supabase Auth users" },
        { status: 404 },
      );
    }

    if (recipient.weekSendStatus === "sent") {
      return NextResponse.json({
        success: true,
        skipped: true,
        email,
        status: "sent",
        message: `${email} was already sent this week.`,
      });
    }

    const adminClient = createAdminClient();
    const deliveryId = recipient.deliveryId ?? crypto.randomUUID();
    const { data: deliveryRows, error: upsertError } = await adminClient
      .from("newsletter_deliveries")
      .upsert(
        {
          id: deliveryId,
          week_key: weekKey,
          recipient_email: recipient.email,
          recipient_user_id: recipient.userId,
          send_status: "pending",
          resend_email_id: null,
          sent_at: null,
          opened_at: null,
          open_count: 0,
        },
        {
          onConflict: "week_key,recipient_email",
        },
      )
      .select("id, recipient_email, recipient_user_id");

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    const delivery = ((deliveryRows ?? []) as DeliveryRow[])[0];

    if (!delivery?.id) {
      throw new Error("Missing delivery tracking row");
    }

    const content = await getNewsletterContent();
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
      await adminClient
        .from("newsletter_deliveries")
        .update({
          send_status: "failed",
        })
        .eq("id", delivery.id);

      return NextResponse.json(
        { error: error.message || `Failed to send newsletter to ${email}` },
        { status: 500 },
      );
    }

    const sentAt = new Date().toISOString();
    const { error: updateError } = await adminClient
      .from("newsletter_deliveries")
      .update({
        send_status: "sent",
        resend_email_id: data?.id ?? null,
        sent_at: sentAt,
      })
      .eq("id", delivery.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({
      success: true,
      email,
      status: "sent",
      sentAt,
      deliveryId: delivery.id,
      emailId: data?.id ?? null,
      message: `Newsletter sent to ${email}.`,
    });
  } catch (error) {
    console.error("Single recipient newsletter send error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to send newsletter",
      },
      { status: 500 },
    );
  }
}
