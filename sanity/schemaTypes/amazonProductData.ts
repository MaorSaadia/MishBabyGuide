import { defineField, defineType } from "sanity";

export default defineType({
  name: "amazonProductData",
  title: "Amazon Product Data",
  type: "object",
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: "asin",
      title: "ASIN",
      type: "string",
      readOnly: true,
      description: "Amazon Standard Identification Number for this synced product.",
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
      description: "Shows whether the last Amazon sync is pending, synced, or failed.",
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
      description: "Timestamp of the most recent successful Amazon sync attempt.",
    }),
    defineField({
      name: "lastError",
      title: "Last Sync Error",
      type: "text",
      rows: 3,
      readOnly: true,
      description: "Most recent sync failure message, if one occurred.",
    }),
    defineField({
      name: "source",
      title: "Import Source",
      type: "string",
      readOnly: true,
      description: "Indicates whether this document came from Amazon data or was authored manually.",
    }),
    defineField({
      name: "importedImageAssetId",
      title: "Imported Image Asset ID",
      type: "string",
      readOnly: true,
      description: "Tracks the Sanity image asset that was auto-imported from Amazon.",
    }),
    defineField({
      name: "imageSyncStatus",
      title: "Image Sync Status",
      type: "string",
      readOnly: true,
      description: "Shows whether the Amazon image was imported, skipped, or failed.",
      options: {
        list: [
          { title: "Synced", value: "synced" },
          { title: "Skipped", value: "skipped" },
          { title: "Error", value: "error" },
        ],
      },
    }),
    defineField({
      name: "lastImageSyncError",
      title: "Last Image Sync Error",
      type: "text",
      rows: 3,
      readOnly: true,
      description: "Most recent image import failure message, if one occurred.",
    }),
  ],
});
