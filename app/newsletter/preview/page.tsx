import { getNewsletterContent } from "@/lib/newsletter";
import { render } from "@react-email/components";
import WeeklyNewsletter from "@/emails/WeeklyNewsletter";
import NewsletterPreviewClient from "./NewsletterPreviewClient";

export default async function NewsletterPreviewPage() {
  const content = await getNewsletterContent();

  // Render the email as HTML
  const emailHtml = await render(
    WeeklyNewsletter({
      ...content,
      blogPost: content.blogPost || {
        title: "",
        excerpt: "",
        image: "",
        url: "",
      },
    }),
  );

  return <NewsletterPreviewClient content={content} emailHtml={emailHtml} />;
}
