// schemas/productRecommendation.ts
import { defineType, defineField } from "sanity";
import { SparklesIcon } from "@sanity/icons";

export default defineType({
  name: "productRecommendation",
  title: "Product Recommendation",
  type: "document",
  icon: SparklesIcon,
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
    // defineField({
    //   name: "additionalImages",
    //   title: "Additional Images",
    //   type: "array",
    //   of: [
    //     {
    //       type: "image",
    //       options: { hotspot: true },
    //     },
    //   ],
    //   description: "📸 2-4 extra product images",
    //   validation: (Rule) => Rule.max(4),
    // }),
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
      name: "description",
      title: "Product Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3", value: "h3" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
      description: "📝 Rich text description with emojis, bullets, formatting",
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
        subtitle: `${category} • ⚡ Quick Pick`,
        media: media,
      };
    },
  },
});
