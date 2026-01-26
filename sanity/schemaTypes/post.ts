import { defineType, defineField } from "sanity";
import { PackageIcon } from "@sanity/icons";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
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
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "categories",
      title: "Blog Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "blogCategory" } }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
        },
        // NEW: Inline Product Recommendation
        {
          type: "object",
          name: "productRecommendation",
          title: "Product Recommendation",
          icon: PackageIcon,
          fields: [
            {
              name: "productName",
              title: "Product Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "productImage",
              title: "Product Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "amazonLink",
              title: "Amazon Affiliate Link",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ["http", "https"],
                }),
            },
            {
              name: "description",
              title: "Short Description",
              type: "text",
              rows: 3,
              description:
                "Brief description of why you recommend this product",
            },
            {
              name: "topPick",
              title: "Top Pick",
              type: "boolean",
              description: "Mark as 'Top Pick' badge",
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: "productName",
              media: "productImage",
              topPick: "topPick",
            },
            prepare({ title, media, topPick }) {
              return {
                title: title,
                subtitle: topPick ? "⭐ Top Pick" : "Product Recommendation",
                media: media,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta Title" },
        { name: "metaDescription", type: "text", title: "Meta Description" },
      ],
    }),
  ],
});
