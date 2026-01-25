import { NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend";
import WelcomeEmail from "@/emails/WelcomeEmail";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // TODO: Save to your database (Sanity, Supabase, etc.)
    // For now, we'll just send the welcome email

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to MishBabyGuide Newsletter! 👶",
      react: WelcomeEmail({ name: name || "there" }),
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed!",
      data,
    });
  } catch (error) {
    console.error("Error in subscribe route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
