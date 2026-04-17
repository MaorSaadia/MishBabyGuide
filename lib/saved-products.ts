import type { Product } from "@/lib/sanity.client";
import { getProductDisplayImage, getProductDisplayLink } from "@/lib/product-display";

export const SAVED_PRODUCT_SOURCE_TYPES = [
  "amazon_live",
  "productRecommendation",
  "productReview",
] as const;

export type SavedProductSourceType =
  (typeof SAVED_PRODUCT_SOURCE_TYPES)[number];

export type SavedProductInput = {
  product_key: string;
  source_type: SavedProductSourceType;
  title: string;
  image?: string | null;
  amazon_url?: string | null;
  site_url?: string | null;
  asin?: string | null;
  price?: string | null;
  rating?: number | null;
  category?: string | null;
  features?: string[];
};

export type SavedProduct = SavedProductInput & {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

export function getStableProductKey(input: {
  asin?: string | null;
  amazonUrl?: string | null;
  siteUrl?: string | null;
}) {
  if (input.asin) {
    return `asin:${normalizeKey(input.asin)}`;
  }

  if (input.amazonUrl) {
    return `amazon:${normalizeKey(input.amazonUrl)}`;
  }

  if (input.siteUrl) {
    return `site:${normalizeKey(input.siteUrl)}`;
  }

  return "";
}

export function isSavedProductSourceType(
  value: unknown,
): value is SavedProductSourceType {
  return (
    typeof value === "string" &&
    SAVED_PRODUCT_SOURCE_TYPES.includes(value as SavedProductSourceType)
  );
}

export function savedProductFromProduct(
  product: Product,
  sitePath: string,
): SavedProductInput {
  const amazonUrl = getProductDisplayLink(product);
  const siteUrl = sitePath.startsWith("http")
    ? sitePath
    : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${sitePath}`;

  return {
    product_key: getStableProductKey({
      asin: product.amazon?.asin,
      amazonUrl,
      siteUrl,
    }),
    source_type: product._type,
    title: product.title,
    image: getProductDisplayImage(product),
    amazon_url: amazonUrl === "#" ? null : amazonUrl,
    site_url: siteUrl,
    asin: product.amazon?.asin ?? null,
    price: product.amazon?.price ?? null,
    rating: product.amazon?.rating ?? null,
    category: product.category?.title ?? null,
    features: [],
  };
}
