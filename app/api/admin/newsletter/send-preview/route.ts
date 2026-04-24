import { NextResponse } from "next/server";

import WeeklyNewsletter from "@/emails/WeeklyNewsletter";
import { getAuthenticatedAdminUser } from "@/lib/newsletter-admin";
import { getNewsletterContent } from "@/lib/newsletter";
import { isValidEmail } from "@/lib/newsletter-shared";
import { FROM_EMAIL, resend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const adminUser = await getAuthenticatedAdminUser();

    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 },
      );
    }

    const content = await getNewsletterContent();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `[PREVIEW] Your Weekly Baby Product Picks - ${content.date}`,
      react: WeeklyNewsletter(content),
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to send preview email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      email,
      emailId: data?.id ?? null,
      message: `Preview email sent to ${email}.`,
    });
  } catch (error) {
    console.error("Newsletter preview send error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send preview email",
      },
      { status: 500 },
    );
  }
}
