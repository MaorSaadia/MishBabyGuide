// app/api/newsletter/subscribe/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity.write.client";
import { resend, FROM_EMAIL } from "@/lib/resend";
import WelcomeEmail from "@/emails/WelcomeEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

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

    // Check if email already exists
    const existingSubscriber = await writeClient.fetch(
      `*[_type == "newsletterSubscriber" && email == $email][0]`,
      { email: email.toLowerCase() },
    );

    if (existingSubscriber) {
      if (existingSubscriber.status === "subscribed") {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 409 },
        );
      }

      // Reactivate if previously unsubscribed
      if (existingSubscriber.status === "unsubscribed") {
        await writeClient
          .patch(existingSubscriber._id)
          .set({
            status: "subscribed",
            subscribedAt: new Date().toISOString(),
          })
          .commit();

        // Send welcome back email
        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: "Welcome Back to MishBabyGuide! 👶",
            react: WelcomeEmail({ name: "there" }), // You might want a different template for returning subscribers
          });
        } catch (emailError) {
          console.error("Failed to send welcome back email:", emailError);
        }

        return NextResponse.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
        });
      }
    }

    // Create new subscriber
    const subscriber = await writeClient.create({
      _type: "newsletterSubscriber",
      email: email.toLowerCase(),
      name: name || undefined, // Save name if provided
      status: "subscribed",
      subscribedAt: new Date().toISOString(),
      source: "products_page", // Track where they subscribed from
    });

    // Send welcome email
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to MishBabyGuide Newsletter! 👶",
        react: WelcomeEmail({ name: name || "there" }),
      });

      if (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail the subscription if email fails, just log it
      } else {
        console.log("Welcome email sent successfully:", emailData?.id);
      }
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Continue anyway - subscriber is created
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter!",
        subscriberId: subscriber._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
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
