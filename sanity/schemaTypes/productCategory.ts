import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export default defineType({
  name: "productCategory",
  title: "Product Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g., Baby Clothing, Feeding & Mealtime",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "icon",
      title: "Category Icon (Emoji)",
      type: "string",
      description: "Optional emoji icon for the category (e.g., 👕, 🍼, 🛁)",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      icon: "icon",
    },
    prepare({ title, icon }) {
      return {
        title: title,
        subtitle: icon ? `${icon} Product Category` : "Product Category",
      };
    },
  },
});
