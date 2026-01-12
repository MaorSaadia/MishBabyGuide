// schemas/productReview.ts
import { defineType, defineField } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export default defineType({
  name: "productReview",
  title: "Product Review",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amazonLink",
      title: "Amazon Affiliate Link",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "mainImage",
      title: "Main Product Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Image Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      description: "📸 Additional product images",
    }),
    defineField({
      name: "category",
      title: "Product Category",
      type: "reference",
      to: [{ type: "productCategory" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short Summary",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
      description: "Brief summary for cards and previews (1-2 sentences)",
    }),
    defineField({
      name: "pros",
      title: "Pros",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
      description: "✅ What's good about this product",
    }),
    defineField({
      name: "cons",
      title: "Cons",
      type: "array",
      of: [{ type: "string" }],
      description: "❌ What could be better",
    }),
    defineField({
      name: "review",
      title: "Full Review Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (Rule) => Rule.required(),
      description: "📝 Your detailed review with formatting",
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      description: "Show this product on homepage",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta Title" },
        {
          name: "metaDescription",
          type: "text",
          title: "Meta Description",
          rows: 3,
        },
        {
          name: "keywords",
          type: "array",
          of: [{ type: "string" }],
          title: "Keywords",
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      category: "category.title",
    },
    prepare({ title, media, category }) {
      return {
        title: title,
        subtitle: `${category} • 📝 Full Review`,
        media: media,
      };
    },
  },
});
