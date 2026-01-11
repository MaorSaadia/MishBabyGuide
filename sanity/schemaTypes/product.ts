// schemas/product.ts
import { defineType, defineField } from "sanity";
import { PackageIcon } from "@sanity/icons";

export default defineType({
  name: "product",
  title: "Product Review",
  type: "document",
  icon: PackageIcon,
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
      name: "hasFullReview",
      title: "Has Full Review Page",
      type: "boolean",
      initialValue: false,
      description:
        "✅ Toggle ON to create a dedicated review page. ❌ OFF for quick recommendations with Amazon link only.",
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
      name: "category",
      title: "Product Category",
      type: "reference",
      to: [{ type: "productCategory" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
      description: "Brief summary for cards and previews (always required)",
    }),

    // ========================================
    // FULL REVIEW FIELDS (only fill if hasFullReview = true)
    // ========================================
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
      description: "📸 Only needed for full reviews",
      hidden: ({ document }) => !document?.hasFullReview,
    }),
    defineField({
      name: "pros",
      title: "Pros",
      type: "array",
      of: [{ type: "string" }],
      description: "✅ Only needed for full reviews",
      hidden: ({ document }) => !document?.hasFullReview,
    }),
    defineField({
      name: "cons",
      title: "Cons",
      type: "array",
      of: [{ type: "string" }],
      description: "❌ Only needed for full reviews",
      hidden: ({ document }) => !document?.hasFullReview,
    }),
    defineField({
      name: "review",
      title: "Full Review",
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
      description: "📝 Only needed for full reviews",
      hidden: ({ document }) => !document?.hasFullReview,
    }),

    // ========================================
    // COMMON FIELDS
    // ========================================
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
      title: "SEO",
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
      description: "🔍 Only needed for full reviews",
      hidden: ({ document }) => !document?.hasFullReview,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      category: "category.title",
      rating: "rating",
      hasFullReview: "hasFullReview",
    },
    prepare({ title, media, category, rating, hasFullReview }) {
      return {
        title: title,
        subtitle: `${category} ${hasFullReview ? "📝 Full Review" : "⚡ Quick Rec"} ${rating ? `- ⭐ ${rating}/5` : ""}`,
        media: media,
      };
    },
  },
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Rating, High to Low",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
  ],
});
