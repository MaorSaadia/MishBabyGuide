// lib/sanity.write.client.ts
import { createClient } from "@sanity/client";

// Create a client with write permissions for server-side mutations
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN, // This is the key difference
  useCdn: false, // Must be false for mutations
});

// Export both read and write clients
export { client as readClient } from "./sanity.client";
