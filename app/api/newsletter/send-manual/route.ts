/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { client } from "@/lib/sanity.client";
import { getProductCardImage, getBlogCardImage } from "@/lib/sanity.image";
import WeeklyNewsletter from "@/emails/WeeklyNewsletter";

export async function POST(request: Request) {
  try {
    const { newsletterId, emails } = await request.json();

    if (!newsletterId || !emails) {
      return NextResponse.json(
        { error: "Newsletter ID and emails required" },
        { status: 400 },
      );
    }

    // Fetch newsletter from Sanity
    const newsletter = await client.fetch(
      `*[_type == "newsletter" && _id == $id][0]{
        title,
        customSubject,
        products[]-> {
          _id,
          title,
          excerpt,
          slug,
          mainImage {
            asset -> { url }
          },
          publishedAt
        },
        reviews[]-> {
          _id,
          title,
          excerpt,
          slug,
          mainImage {
            asset -> { url }
          },
          publishedAt
        },
        blogPost-> {
          _id,
          title,
          excerpt,
          slug,
          mainImage {
            asset -> { url }
          },
          publishedAt
        }
      }`,
      { id: newsletterId },
    );

    if (!newsletter) {
      return NextResponse.json(
        { error: "Newsletter not found" },
        { status: 404 },
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.mishbabyguide.com";

    // Format content for email template
    const content = {
      products: newsletter.products.slice(0, 10).map((p: any) => ({
        title: p.title,
        excerpt: p.excerpt,
        image: p.mainImage
          ? getProductCardImage(p.mainImage)
          : `${baseUrl}/placeholder.jpg`,
        url: `${baseUrl}/products/${p.slug.current}`,
      })),
      reviews: newsletter.reviews.slice(0, 2).map((r: any) => ({
        title: r.title,
        excerpt: r.excerpt,
        image: r.mainImage
          ? getProductCardImage(r.mainImage)
          : `${baseUrl}/placeholder.jpg`,
        url: `${baseUrl}/reviews/${r.slug.current}`,
      })),
      blogPost: newsletter.blogPost
        ? {
            title: newsletter.blogPost.title,
            excerpt: newsletter.blogPost.excerpt,
            image: newsletter.blogPost.mainImage
              ? getBlogCardImage(newsletter.blogPost.mainImage)
              : `${baseUrl}/placeholder.jpg`,
            url: `${baseUrl}/blog/${newsletter.blogPost.slug.current}`,
          }
        : null,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    // Send emails in batches
    const batchSize = 50;
    const results = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);

      const promises = batch.map((email: string) =>
        resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject:
            newsletter.customSubject ||
            `Your Weekly Baby Product Picks - ${content.date}`,
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

    // Update newsletter status in Sanity
    await client
      .patch(newsletterId)
      .set({
        status: "sent",
        sentAt: new Date().toISOString(),
        sentCount: successful,
      })
      .commit();

    return NextResponse.json({
      success: true,
      sent: successful,
      failed: results.length - successful,
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
