import { defineField, defineType } from "sanity";

export default defineType({
  name: "amazonProductData",
  title: "Amazon Product Data",
  type: "object",
  fields: [
    defineField({
      name: "asin",
      title: "ASIN",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "title",
      title: "Amazon Title",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "detailPageUrl",
      title: "Amazon Detail Page URL",
      type: "url",
      readOnly: true,
    }),
    defineField({
      name: "imageUrl",
      title: "Amazon Image URL",
      type: "url",
      readOnly: true,
    }),
    defineField({
      name: "price",
      title: "Amazon Price",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "rating",
      title: "Amazon Rating",
      type: "number",
      readOnly: true,
    }),
    defineField({
      name: "syncStatus",
      title: "Sync Status",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Synced", value: "synced" },
          { title: "Error", value: "error" },
        ],
      },
    }),
    defineField({
      name: "lastSyncedAt",
      title: "Last Synced At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "lastError",
      title: "Last Sync Error",
      type: "text",
      rows: 3,
      readOnly: true,
    }),
    defineField({
      name: "source",
      title: "Import Source",
      type: "string",
      readOnly: true,
    }),
  ],
});
