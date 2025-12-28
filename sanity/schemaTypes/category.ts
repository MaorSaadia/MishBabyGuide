import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export default defineType({
  name: "category",
  title: "Category",
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
      title: "Category Icon URL",
      type: "url",
      description: "Optional icon/emoji for the category",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
