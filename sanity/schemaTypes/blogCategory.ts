import { defineType, defineField } from "sanity";
import { BookIcon } from "@sanity/icons";

export default defineType({
  name: "blogCategory",
  title: "Blog Category",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description:
        "e.g., Sleep & Routines, Safety & Development, Parenting Tips",
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
      name: "color",
      title: "Badge Color",
      type: "string",
      options: {
        list: [
          { title: "Blue", value: "blue" },
          { title: "Green", value: "green" },
          { title: "Purple", value: "purple" },
          { title: "Pink", value: "pink" },
          { title: "Orange", value: "orange" },
          { title: "Cyan", value: "cyan" },
        ],
      },
      initialValue: "blue",
      description: "Color for category badge on blog posts",
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
      color: "color",
    },
    prepare({ title, color }) {
      return {
        title: title,
        subtitle: `📝 Blog Category (${color || "default"})`,
      };
    },
  },
});
