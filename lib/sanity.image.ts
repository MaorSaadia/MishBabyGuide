import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./sanity.client";

// Create image URL builder
const builder = imageUrlBuilder(client);

/**
 * Generate optimized image URL from Sanity image asset
 * @param source - Sanity image source
 * @returns Image URL builder
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Get optimized image URL with specific dimensions
 * @param source - Sanity image source
 * @param width - Desired width
 * @param height - Desired height (optional)
 * @returns Optimized image URL
 */
export function getImageUrl(
  source: SanityImageSource,
  width: number = 800,
  height?: number
): string {
  const imageBuilder = urlFor(source).width(width).quality(85).auto("format");

  if (height) {
    return imageBuilder.height(height).fit("crop").url();
  }

  return imageBuilder.url();
}

/**
 * Get image URL for product cards
 * @param source - Sanity image source
 * @returns Image URL optimized for cards (400x400)
 */
export function getProductCardImage(source: SanityImageSource): string {
  return urlFor(source)
    .width(400)
    .height(400)
    .fit("crop")
    .quality(85)
    .auto("format")
    .url();
}

/**
 * Get image URL for blog cards
 * @param source - Sanity image source
 * @returns Image URL optimized for blog cards (600x400)
 */
export function getBlogCardImage(source: SanityImageSource): string {
  return urlFor(source)
    .width(600)
    .height(400)
    .fit("crop")
    .quality(85)
    .auto("format")
    .url();
}

/**
 * Get image URL for hero sections
 * @param source - Sanity image source
 * @returns Image URL optimized for hero (1200x600)
 */
export function getHeroImage(source: SanityImageSource): string {
  return urlFor(source)
    .width(1200)
    .height(600)
    .fit("crop")
    .quality(90)
    .auto("format")
    .url();
}

/**
 * Get responsive image srcset
 * @param source - Sanity image source
 * @param sizes - Array of widths for responsive images
 * @returns Object with src and srcSet
 */
export function getResponsiveImageUrls(
  source: SanityImageSource,
  sizes: number[] = [320, 640, 960, 1280, 1920]
) {
  const srcSet = sizes
    .map((size) => {
      const url = urlFor(source).width(size).quality(85).auto("format").url();
      return `${url} ${size}w`;
    })
    .join(", ");

  const src = urlFor(source)
    .width(sizes[Math.floor(sizes.length / 2)])
    .quality(85)
    .auto("format")
    .url();

  return { src, srcSet };
}

/**
 * Get image dimensions
 * @param source - Sanity image source
 * @returns Promise with image dimensions
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getImageDimensions(source: any): Promise<{
  width: number;
  height: number;
  aspectRatio: number;
} | null> {
  try {
    if (!source?.asset?._ref) return null;

    const dimensions = source.asset._ref.split("-")[2];
    const [width, height] = dimensions.split("x").map(Number);

    return {
      width,
      height,
      aspectRatio: width / height,
    };
  } catch (error) {
    console.error("Error getting image dimensions:", error);
    return null;
  }
}

/**
 * Get placeholder image (blurred low-quality version)
 * @param source - Sanity image source
 * @returns Blurred placeholder image URL
 */
export function getPlaceholderImage(source: SanityImageSource): string {
  return urlFor(source)
    .width(20)
    .height(20)
    .blur(50)
    .quality(30)
    .auto("format")
    .url();
}
