import type { Product } from "@/lib/sanity.client";
import { getImageUrl, getProductCardImage } from "@/lib/sanity.image";

type ProductWithAmazonDisplay = Pick<
  Product,
  "mainImage" | "imageUrl" | "amazonLink" | "amazon"
>;

export function getProductDisplayImage(
  product: ProductWithAmazonDisplay,
  variant: "card" | "detail" = "card",
): string {
  if (product.mainImage) {
    return variant === "detail"
      ? getImageUrl(product.mainImage, 800)
      : getProductCardImage(product.mainImage);
  }

  return product.imageUrl ?? product.amazon?.imageUrl ?? "/placeholder-product.jpg";
}

export function getProductDisplayLink(product: ProductWithAmazonDisplay): string {
  return product.amazonLink || product.amazon?.detailPageUrl || "#";
}
