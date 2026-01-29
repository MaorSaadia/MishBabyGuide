// app/api/newsletter/send-test/route.ts
import { NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend";
import WeeklyNewsletter from "@/emails/WeeklyNewsletter";
import { getNewsletterContent } from "@/lib/newsletter";
import { generateUnsubscribeUrl } from "@/lib/unsubscribe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 },
      );
    }

    // Get newsletter content
    const content = await getNewsletterContent();

    // Check if Resend API key exists
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Resend API key not configured" },
        { status: 500 },
      );
    }

    // IMPORTANT: Generate unsubscribe URL for this email
    const unsubscribeUrl = generateUnsubscribeUrl(email);

    console.log("Sending test email with unsubscribe URL:", unsubscribeUrl); // Debug log

    // Send the email with unsubscribe URL
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `[TEST] Your Weekly Baby Product Picks - ${content.date}`,
      react: WeeklyNewsletter({
        ...content,
        blogPost: content.blogPost || {
          title: "",
          excerpt: "",
          image: "",
          url: "",
        },
        unsubscribeUrl, // MAKE SURE THIS IS PASSED
      }),
      headers: {
        // Add List-Unsubscribe header (best practice for email clients)
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Test email sent successfully",
        emailId: data?.id,
        unsubscribeUrl, // Return this for debugging
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
