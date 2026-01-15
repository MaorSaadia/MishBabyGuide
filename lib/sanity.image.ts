/* eslint-disable @typescript-eslint/no-explicit-any */
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./sanity.client";

// Create image URL builder
const builder = imageUrlBuilder(client);

/**
 * Get a unique identifier for an image source
 */
function getImageSourceId(source: SanityImageSource): string {
  if (typeof source === "string") return source;

  // Handle different source formats
  const imageSource = source as any;
  return (
    imageSource?.asset?._ref ||
    imageSource?.asset?._id ||
    imageSource?._ref ||
    imageSource?._id ||
    JSON.stringify(source)
  );
}

/**
 * Generate cache key for image URLs
 */
function getCacheKey(
  source: SanityImageSource,
  width?: number,
  height?: number,
  quality?: number,
  fit?: string
): string {
  const sourceId = getImageSourceId(source);
  return `${sourceId}-${width || "auto"}-${height || "auto"}-${quality || 85}-${fit || "crop"}`;
}

// Memoization cache for image URLs (with size limit)
const MAX_CACHE_SIZE = 1000;
const urlCache = new Map<string, string>();

function addToCache(key: string, value: string) {
  // Prevent memory leaks by limiting cache size
  if (urlCache.size >= MAX_CACHE_SIZE) {
    const firstKey = urlCache.keys().next().value;
    urlCache.delete(firstKey as any);
  }
  urlCache.set(key, value);
}

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
  if (!source) return "/placeholder.jpg";

  const cacheKey = getCacheKey(source, width, height);

  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!;
  }

  try {
    const imageBuilder = urlFor(source)
      .width(width)
      .quality(85)
      .auto("format")
      .format("webp");

    const url = height
      ? imageBuilder.height(height).fit("crop").url()
      : imageBuilder.url();

    addToCache(cacheKey, url);
    return url;
  } catch (error) {
    console.error("Error generating image URL:", error);
    return "/placeholder.jpg";
  }
}

/**
 * Get image URL for product cards
 * @param source - Sanity image source
 * @returns Image URL optimized for cards (400x400)
 */
export function getProductCardImage(source: SanityImageSource): string {
  if (!source) return "/placeholder.jpg";

  const cacheKey = getCacheKey(source, 400, 400, 85, "crop");

  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!;
  }

  try {
    const url = urlFor(source)
      .width(400)
      .height(400)
      .fit("crop")
      .quality(85)
      .auto("format")
      .format("webp")
      .url();

    addToCache(cacheKey, url);
    return url;
  } catch (error) {
    console.error("Error generating product card image:", error, source);
    return "/placeholder.jpg";
  }
}

/**
 * Get image URL for blog cards
 * @param source - Sanity image source
 * @returns Image URL optimized for blog cards (600x400)
 */
export function getBlogCardImage(source: SanityImageSource): string {
  if (!source) return "/placeholder.jpg";

  const cacheKey = getCacheKey(source, 600, 400, 85, "crop");

  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!;
  }

  try {
    const url = urlFor(source)
      .width(600)
      .height(400)
      .fit("crop")
      .quality(85)
      .auto("format")
      .format("webp")
      .url();

    addToCache(cacheKey, url);
    return url;
  } catch (error) {
    console.error("Error generating blog card image:", error);
    return "/placeholder.jpg";
  }
}

/**
 * Get image URL for hero sections
 * @param source - Sanity image source
 * @returns Image URL optimized for hero (1200x600)
 */
export function getHeroImage(source: SanityImageSource): string {
  if (!source) return "/placeholder.jpg";

  const cacheKey = getCacheKey(source, 1200, 600, 90, "crop");

  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!;
  }

  try {
    const url = urlFor(source)
      .width(1200)
      .height(600)
      .fit("crop")
      .quality(90)
      .auto("format")
      .format("webp")
      .url();

    addToCache(cacheKey, url);
    return url;
  } catch (error) {
    console.error("Error generating hero image:", error);
    return "/placeholder.jpg";
  }
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
  if (!source) {
    return { src: "/placeholder.jpg", srcSet: "" };
  }

  const cacheKey = `${getCacheKey(source)}-responsive-${sizes.join("-")}`;

  if (urlCache.has(cacheKey)) {
    const cached = urlCache.get(cacheKey)!;
    const [srcSet, src] = cached.split("||");
    return { src, srcSet };
  }

  try {
    const srcSet = sizes
      .map((size) => {
        const url = urlFor(source)
          .width(size)
          .quality(85)
          .auto("format")
          .format("webp")
          .url();
        return `${url} ${size}w`;
      })
      .join(", ");

    const src = urlFor(source)
      .width(sizes[Math.floor(sizes.length / 2)])
      .quality(85)
      .auto("format")
      .format("webp")
      .url();

    addToCache(cacheKey, `${srcSet}||${src}`);
    return { src, srcSet };
  } catch (error) {
    console.error("Error generating responsive images:", error);
    return { src: "/placeholder.jpg", srcSet: "" };
  }
}

/**
 * Get image dimensions (memoized)
 */
const dimensionsCache = new Map<
  string,
  { width: number; height: number; aspectRatio: number }
>();

export async function getImageDimensions(source: any): Promise<{
  width: number;
  height: number;
  aspectRatio: number;
} | null> {
  try {
    if (!source?.asset?._ref) return null;

    const ref = source.asset._ref;

    if (dimensionsCache.has(ref)) {
      return dimensionsCache.get(ref)!;
    }

    const dimensions = ref.split("-")[2];
    if (!dimensions) return null;

    const [width, height] = dimensions.split("x").map(Number);

    if (isNaN(width) || isNaN(height)) return null;

    const result = {
      width,
      height,
      aspectRatio: width / height,
    };

    dimensionsCache.set(ref, result);
    return result;
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
  if (!source) return "/placeholder.jpg";

  const cacheKey = `${getCacheKey(source)}-placeholder`;

  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!;
  }

  try {
    const url = urlFor(source)
      .width(20)
      .height(20)
      .blur(50)
      .quality(30)
      .auto("format")
      .format("webp")
      .url();

    addToCache(cacheKey, url);
    return url;
  } catch (error) {
    console.error("Error generating placeholder image:", error);
    return "/placeholder.jpg";
  }
}

/**
 * Clear the image URL cache
 */
export function clearImageCache(): void {
  urlCache.clear();
  dimensionsCache.clear();
}

/**
 * Preload image (for critical images)
 */
export function preloadImage(
  source: SanityImageSource,
  width: number = 800,
  height?: number
): void {
  if (typeof window !== "undefined" && source) {
    try {
      const url = getImageUrl(source, width, height);
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
    } catch (error) {
      console.error("Error preloading image:", error);
    }
  }
}
