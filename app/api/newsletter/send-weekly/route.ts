// app/api/newsletter/send-weekly/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity.write.client";
import { resend, FROM_EMAIL } from "@/lib/resend";
import WeeklyNewsletter from "@/emails/WeeklyNewsletter";
import { getNewsletterContent } from "@/lib/newsletter";
import { generateUnsubscribeUrl } from "@/lib/unsubscribe";

type Subscriber = { _id: string; email: string };

export async function GET(request: Request) {
  try {
    // Vercel cron jobs call your function with a special user agent
    const ua = request.headers.get("user-agent") || "";
    if (!ua.includes("vercel-cron")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscribers = await writeClient.fetch<Subscriber[]>(
      `*[_type == "newsletterSubscriber" && status == "subscribed"]{_id, email}`,
    );

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, failed: 0 });
    }

    const content = await getNewsletterContent();

    const batchSize = 50;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const results = await Promise.allSettled(
        batch.map(({ email }) => {
          const unsubscribeUrl = generateUnsubscribeUrl(email);
          return resend.emails.send({
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
              unsubscribeUrl,
            }),
            headers: {
              "List-Unsubscribe": `<${unsubscribeUrl}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          });
        }),
      );

      sent += results.filter((r) => r.status === "fulfilled").length;
      failed += results.filter((r) => r.status === "rejected").length;
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: subscribers.length,
    });
  } catch (error) {
    console.error("Weekly newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to send weekly newsletter" },
      { status: 500 },
    );
  }
}
