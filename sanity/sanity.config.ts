import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { structure } from "./structure";

// Import schemas
import post from "./schemaTypes/post";
import category from "./schemaTypes/category";
import product from "./schemaTypes/product";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineConfig({
  name: "default",
  title: "MishBabyGuide",
  projectId: projectId || "8oeqwj7h",
  dataset: dataset || "production",
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: "2024-12-06" }),
  ],
  schema: {
    types: [post, category, product],
  },
});
