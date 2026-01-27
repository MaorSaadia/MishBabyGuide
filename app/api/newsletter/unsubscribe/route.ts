// app/api/newsletter/unsubscribe/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity.write.client";
import crypto from "crypto";

// Helper function to verify token
function verifyUnsubscribeToken(token: string, email: string): boolean {
  try {
    // Decode the token
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [tokenEmail, timestamp, hash] = decoded.split(":");

    // Check if email matches
    if (tokenEmail !== email) {
      return false;
    }

    // Check if token is not too old (optional: 30 days expiry)
    const tokenDate = parseInt(timestamp);
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (now - tokenDate > thirtyDays) {
      return false;
    }

    // Verify hash
    const secret = process.env.UNSUBSCRIBE_SECRET || "your-secret-key";
    const expectedHash = crypto
      .createHmac("sha256", secret)
      .update(`${tokenEmail}:${timestamp}`)
      .digest("hex");

    return hash === expectedHash;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}

// Helper function to extract email from token
function getEmailFromToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [email] = decoded.split(":");
    return email;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Unsubscribe token is required" },
        { status: 400 },
      );
    }

    // Extract email from token
    const email = getEmailFromToken(token);
    if (!email) {
      return NextResponse.json(
        { error: "Invalid unsubscribe token format" },
        { status: 400 },
      );
    }

    // Verify token
    if (!verifyUnsubscribeToken(token, email)) {
      return NextResponse.json(
        { error: "Invalid or expired unsubscribe token" },
        { status: 400 },
      );
    }

    // Find subscriber
    const subscriber = await writeClient.fetch(
      `*[_type == "newsletterSubscriber" && email == $email][0]`,
      { email: email.toLowerCase() },
    );

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }

    // Check if already unsubscribed
    if (subscriber.status === "unsubscribed") {
      return NextResponse.json({
        success: true,
        message: "Already unsubscribed",
        alreadyUnsubscribed: true,
      });
    }

    // Update subscriber status
    await writeClient
      .patch(subscriber._id)
      .set({
        status: "unsubscribed",
        unsubscribedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
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

// Optional: GET endpoint to pre-fill unsubscribe page
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Extract email from token
    const email = getEmailFromToken(token);
    if (!email) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 },
      );
    }

    // Verify token
    if (!verifyUnsubscribeToken(token, email)) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      email,
      valid: true,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 },
    );
  }
}
