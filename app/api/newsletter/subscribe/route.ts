// app/api/newsletter/subscribe/route.ts
import { NextResponse } from "next/server";
import { client } from "@/lib/sanity.client";

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

    // Check if email already exists
    const existingSubscriber = await client.fetch(
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
        await client
          .patch(existingSubscriber._id)
          .set({
            status: "subscribed",
            subscribedAt: new Date().toISOString(),
          })
          .commit();

        return NextResponse.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
        });
      }
    }

    // Create new subscriber
    const subscriber = await client.create({
      _type: "newsletterSubscriber",
      email: email.toLowerCase(),
      status: "subscribed",
      subscribedAt: new Date().toISOString(),
      source: "products_page", // Track where they subscribed from
    });

    // TODO: Send welcome email using Resend
    // TODO: Add to your email marketing service if using one

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
