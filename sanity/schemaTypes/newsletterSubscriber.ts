/* eslint-disable @typescript-eslint/no-explicit-any */
// sanity/schemas/newsletterSubscriber.ts
import { defineType, defineField } from "sanity";
import { Mail } from "lucide-react";

export default defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscribers",
  type: "document",
  icon: Mail,
  fields: [
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .email()
          .custom((email) => {
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              return "Please enter a valid email address";
            }
            return true;
          }),
    }),
    defineField({
      name: "status",
      title: "Subscription Status",
      type: "string",
      options: {
        list: [
          { title: "Subscribed", value: "subscribed" },
          { title: "Unsubscribed", value: "unsubscribed" },
          { title: "Bounced", value: "bounced" },
        ],
        layout: "radio",
      },
      initialValue: "subscribed",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "unsubscribedAt",
      title: "Unsubscribed At",
      type: "datetime",
    }),
    defineField({
      name: "source",
      title: "Subscription Source",
      type: "string",
      description: "Where did the subscriber sign up from?",
      options: {
        list: [
          { title: "Products Page", value: "products_page" },
          { title: "Reviews Page", value: "reviews_page" },
          { title: "Blog Page", value: "blog_page" },
          { title: "Homepage", value: "homepage" },
          { title: "Footer", value: "footer" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "emailsSent",
      title: "Emails Sent",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description: "Total number of newsletters sent to this subscriber",
    }),
    defineField({
      name: "lastEmailSentAt",
      title: "Last Email Sent At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      description: "Internal notes about this subscriber",
    }),
  ],
  preview: {
    select: {
      email: "email",
      status: "status",
      subscribedAt: "subscribedAt",
      source: "source",
    },
    prepare(selection: any) {
      const { email, status, subscribedAt, source } = selection;
      const statusEmojiMap: Record<
        "subscribed" | "unsubscribed" | "bounced",
        string
      > = {
        subscribed: "✅",
        unsubscribed: "❌",
        bounced: "⚠️",
      };
      const statusEmoji =
        statusEmojiMap[status as "subscribed" | "unsubscribed" | "bounced"] ||
        "❓";

      return {
        title: email,
        subtitle: `${statusEmoji} ${status} ${source ? `• from ${source}` : ""} ${subscribedAt ? `• ${new Date(subscribedAt).toLocaleDateString()}` : ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Most Recent First",
      name: "subscribedAtDesc",
      by: [{ field: "subscribedAt", direction: "desc" }],
    },
    {
      title: "Email A-Z",
      name: "emailAsc",
      by: [{ field: "email", direction: "asc" }],
    },
  ],
});

// Add this to your sanity/schema.ts or sanity.config.ts
// import newsletterSubscriber from './schemas/newsletterSubscriber';
