import { NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend";
import WeeklyNewsletter from "@/emails/WeeklyNewsletter";
import { getNewsletterContent } from "@/lib/newsletter";

export async function POST(request: Request) {
  try {
    // Verify admin access (add your own auth check here)
    const authHeader = request.headers.get("authorization");
    const secret = process.env.NEWSLETTER_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get subscriber emails from request or database
    const { emails } = await request.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "No email addresses provided" },
        { status: 400 },
      );
    }

    // Get newsletter content
    const content = await getNewsletterContent();

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    const results = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);

      const promises = batch.map((email) =>
        resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `Your Weekly Baby Product Picks - ${content.date}`,
          react: WeeklyNewsletter({
            ...content,
            blogPost: content.blogPost || {
              title: "",
              excerpt: "",
              image: "",
              url: "",
            },
          }),
        }),
      );

      const batchResults = await Promise.allSettled(promises);
      results.push(...batchResults);
    }

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      sent: successful,
      failed: failed,
      total: emails.length,
    });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 },
    );
  }
}
