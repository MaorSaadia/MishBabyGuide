import { defineType, defineField } from "sanity";

export default defineType({
  name: "newsletter",
  title: "Newsletter",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Newsletter Title",
      type: "string",
      description: "Internal title (not shown to subscribers)",
    }),
    defineField({
      name: "scheduledDate",
      title: "Scheduled Send Date",
      type: "datetime",
      description: "When should this newsletter be sent?",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Sent", value: "sent" },
        ],
      },
      initialValue: "draft",
    }),
    defineField({
      name: "products",
      title: "Featured Products (10)",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "productReview" }, { type: "productRecommendation" }],
        },
      ],
      validation: (Rule) => Rule.max(10),
      description: "Select up to 10 products to feature",
    }),
    defineField({
      name: "reviews",
      title: "Featured Reviews (2)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productReview" }] }],
      validation: (Rule) => Rule.max(2),
      description: "Select up to 2 reviews to feature",
    }),
    defineField({
      name: "blogPost",
      title: "Featured Blog Post",
      type: "reference",
      to: [{ type: "post" }],
      description: "Select one blog post to feature",
    }),
    defineField({
      name: "customSubject",
      title: "Custom Email Subject (Optional)",
      type: "string",
      description: "Leave empty to use default",
    }),
    defineField({
      name: "sentCount",
      title: "Emails Sent",
      type: "number",
      readOnly: true,
      description: "Number of emails successfully sent",
    }),
    defineField({
      name: "sentAt",
      title: "Sent At",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      date: "scheduledDate",
      sentCount: "sentCount",
    },
    prepare({ title, status, date, sentCount }) {
      return {
        title: title || "Untitled Newsletter",
        subtitle: `${status} ${date ? `- ${new Date(date).toLocaleDateString()}` : ""} ${sentCount ? `(Sent to ${sentCount})` : ""}`,
      };
    },
  },
});
