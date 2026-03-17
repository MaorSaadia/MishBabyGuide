import { SparklesIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import {
  buildEditorialWarning,
  isAmazonImportedDocument,
} from "@/sanity/lib/amazon-editorial";

export default defineType({
  name: "productRecommendation",
  title: "Product Recommendation",
  type: "document",
  icon: SparklesIcon,
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "amazonSync", title: "Amazon Sync" },
    { name: "publishing", title: "Publishing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Product Name",
      type: "string",
      group: "editorial",
      description:
        "Editor-facing product name. Amazon source data stays visible in the Amazon Sync section.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      options: {
        source: "title",
        maxLength: 96,
      },
      description: "Required before publishing.",
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((value, context) =>
          isAmazonImportedDocument(context.document) && !value?.current
            ? buildEditorialWarning("Slug")
            : true,
        ).warning(),
      ],
    }),
    defineField({
      name: "amazonLink",
      title: "Amazon Affiliate Link",
      type: "url",
      group: "amazonSync",
      description:
        "Machine-managed for Amazon imports. Manual products can still define this link directly.",
      readOnly: ({ document }) => isAmazonImportedDocument(document),
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "mainImage",
      title: "Main Product Image",
      type: "image",
      group: "editorial",
      options: {
        hotspot: true,
      },
      description: "Required before publishing imported products.",
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((value, context) =>
          isAmazonImportedDocument(context.document) && !value
            ? buildEditorialWarning("Main image")
            : true,
        ).warning(),
      ],
    }),
    defineField({
      name: "category",
      title: "Product Category",
      type: "reference",
      group: "editorial",
      to: [{ type: "productCategory" }],
      description: "Required before publishing.",
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((value, context) =>
          isAmazonImportedDocument(context.document) && !value
            ? buildEditorialWarning("Category")
            : true,
        ).warning(),
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Short Summary",
      type: "text",
      group: "editorial",
      rows: 3,
      description: "Brief summary for cards and previews. Required before publishing.",
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((value, context) =>
          isAmazonImportedDocument(context.document) && !value?.trim()
            ? buildEditorialWarning("Short summary")
            : true,
        ).warning(),
      ],
    }),
    defineField({
      name: "description",
      title: "Product Description",
      type: "array",
      group: "editorial",
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
      description: "Rich text description. Required before publishing imported products.",
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((value, context) =>
          isAmazonImportedDocument(context.document) &&
          (!Array.isArray(value) || value.length === 0)
            ? buildEditorialWarning("Description")
            : true,
        ).warning(),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      group: "publishing",
      description: "Show this product on homepage",
      initialValue: false,
    }),
    defineField({
      name: "amazon",
      title: "Amazon Sync Data",
      type: "amazonProductData",
      group: "amazonSync",
      description: "Read-only Amazon metadata synced by the import pipeline.",
      readOnly: true,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "publishing",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      group: "seo",
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
      asin: "amazon.asin",
      syncStatus: "amazon.syncStatus",
    },
    prepare({ title, media, category, asin, syncStatus }) {
      const sourceLabel = asin ? "Amazon import" : "Manual";
      const syncLabel = asin && syncStatus ? ` | ${syncStatus}` : "";

      return {
        title,
        subtitle: `${category || "Uncategorized"} | ${sourceLabel}${syncLabel}`,
        media,
      };
    },
  },
});
