/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/sanity.client.ts
import { createClient } from "next-sanity";
import {
  featuredProductsQuery,
  latestPostsQuery,
  allProductCategoriesQuery,
  allBlogCategoriesQuery,
  productsByCategoryQuery,
  productBySlugQuery,
  postBySlugQuery,
  productCategoryBySlugQuery,
  blogCategoryBySlugQuery,
  allPostsQuery,
  allProductsQuery,
  searchProductsQuery,
  relatedProductsQuery,
  productReviewsQuery,
  productRecommendationsQuery,
} from "./sanity.queries";

// Create the Sanity client with CDN enabled for better performance
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true, // Enable CDN for faster reads
  perspective: "published", // Only fetch published documents
});

// Base Product interface (shared fields)
interface BaseProduct {
  _id: string;
  _type: "productReview" | "productRecommendation";
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: {
      _id: string;
      url: string;
    };
  };
  excerpt: string;
  amazonLink: string;
  category?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  featured?: boolean;
  publishedAt: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

// Product Review (Full Review)
export interface ProductReview extends BaseProduct {
  _type: "productReview";
  gallery?: Array<{
    asset: {
      _id: string;
      url: string;
    };
  }>;
  pros?: string[];
  cons?: string[];
  review?: any[];
}

// Product Recommendation (Quick Product)
export interface ProductRecommendation extends BaseProduct {
  _type: "productRecommendation";
  additionalImages?: Array<{
    asset: {
      _id: string;
      url: string;
    };
  }>;
  description?: any[];
}

// Union type for any product
export type Product = ProductReview | ProductRecommendation;

// Type guard functions
export function isProductReview(product: Product): product is ProductReview {
  return product._type === "productReview";
}

export function isProductRecommendation(
  product: Product
): product is ProductRecommendation {
  return product._type === "productRecommendation";
}

export interface Post {
  relatedProducts: boolean;
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: {
      _id: string;
      url: string;
    };
  };
  excerpt: string;
  body?: any[];
  publishedAt: string;
  author?: string;
  categories?: Array<{
    title: string;
    slug: { current: string };
    color?: string;
  }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface ProductCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  icon?: string;
  order?: number;
}

export interface BlogCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color?: string;
  order?: number;
}

// Cache configuration - adjust these times based on your needs
const CACHE_TAGS = {
  products: "products",
  posts: "posts",
  categories: "categories",
};

const REVALIDATE_TIME = {
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 3600, // 1 hour
};

// Helper function for cached fetch with Next.js 14+
async function fetchWithCache<T>(
  query: string,
  params: any = {},
  revalidate: number = REVALIDATE_TIME.medium,
  tags: string[] = []
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate,
      tags,
    },
  });
}

// Fetch all products (both types) - cached
export async function getAllProducts(): Promise<Product[]> {
  try {
    return await fetchWithCache<Product[]>(
      allProductsQuery,
      {},
      REVALIDATE_TIME.medium,
      [CACHE_TAGS.products]
    );
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

// Fetch featured products (both types) - cached with longer time
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    return await fetchWithCache<Product[]>(
      featuredProductsQuery,
      {},
      REVALIDATE_TIME.long, // Featured products change less frequently
      [CACHE_TAGS.products, "featured"]
    );
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

// Fetch product by slug (either type) - cached
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await fetchWithCache<Product>(
      productBySlugQuery,
      { slug },
      REVALIDATE_TIME.long,
      [CACHE_TAGS.products, `product-${slug}`]
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Fetch products by category (both types) - cached
export async function getProductsByCategory(slug: string): Promise<Product[]> {
  try {
    return await fetchWithCache<Product[]>(
      productsByCategoryQuery,
      { slug },
      REVALIDATE_TIME.medium,
      [CACHE_TAGS.products, `category-${slug}`]
    );
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

// Fetch related products (both types) - cached
export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string
): Promise<Product[]> {
  try {
    return await fetchWithCache<Product[]>(
      relatedProductsQuery,
      { categoryId, currentProductId },
      REVALIDATE_TIME.medium,
      [CACHE_TAGS.products, `related-${currentProductId}`]
    );
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

// Search products (both types) - no cache for search results
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    // Search should not be cached as it's user-specific
    return await client.fetch<Product[]>(searchProductsQuery, {
      query,
    } as any);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

// Fetch only product reviews - cached
export async function getProductReviews(): Promise<ProductReview[]> {
  try {
    return await fetchWithCache<ProductReview[]>(
      productReviewsQuery,
      {},
      REVALIDATE_TIME.medium,
      [CACHE_TAGS.products, "reviews"]
    );
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
}

// Fetch only product recommendations - cached
export async function getProductRecommendations(): Promise<
  ProductRecommendation[]
> {
  try {
    return await fetchWithCache<ProductRecommendation[]>(
      productRecommendationsQuery,
      {},
      REVALIDATE_TIME.medium,
      [CACHE_TAGS.products, "recommendations"]
    );
  } catch (error) {
    console.error("Error fetching product recommendations:", error);
    return [];
  }
}

// Blog functions - cached
export async function getLatestPosts(limit: number = 6): Promise<Post[]> {
  try {
    const posts = await fetchWithCache<Post[]>(
      latestPostsQuery,
      {},
      REVALIDATE_TIME.short,
      [CACHE_TAGS.posts, "latest"]
    );
    return posts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return [];
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    return await fetchWithCache<Post[]>(
      allPostsQuery,
      {},
      REVALIDATE_TIME.medium,
      [CACHE_TAGS.posts]
    );
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    return await fetchWithCache<Post>(
      postBySlugQuery,
      { slug },
      REVALIDATE_TIME.long,
      [CACHE_TAGS.posts, `post-${slug}`]
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Category functions - cached with long revalidation
export async function getAllProductCategories(): Promise<ProductCategory[]> {
  try {
    return await fetchWithCache<ProductCategory[]>(
      allProductCategoriesQuery,
      {},
      REVALIDATE_TIME.long,
      [CACHE_TAGS.categories, "products"]
    );
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
}

export async function getAllBlogCategories(): Promise<BlogCategory[]> {
  try {
    return await fetchWithCache<BlogCategory[]>(
      allBlogCategoriesQuery,
      {},
      REVALIDATE_TIME.long,
      [CACHE_TAGS.categories, "blog"]
    );
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [];
  }
}

export async function getProductCategoryBySlug(
  slug: string
): Promise<ProductCategory | null> {
  try {
    return await fetchWithCache<ProductCategory>(
      productCategoryBySlugQuery,
      { slug },
      REVALIDATE_TIME.long,
      [CACHE_TAGS.categories, `product-category-${slug}`]
    );
  } catch (error) {
    console.error("Error fetching product category:", error);
    return null;
  }
}

export async function getBlogCategoryBySlug(
  slug: string
): Promise<BlogCategory | null> {
  try {
    return await fetchWithCache<BlogCategory>(
      blogCategoryBySlugQuery,
      { slug },
      REVALIDATE_TIME.long,
      [CACHE_TAGS.categories, `blog-category-${slug}`]
    );
  } catch (error) {
    console.error("Error fetching blog category:", error);
    return null;
  }
}

// Legacy functions for backward compatibility
export async function getAllCategories(): Promise<ProductCategory[]> {
  return getAllProductCategories();
}

export async function getCategoryBySlug(
  slug: string
): Promise<ProductCategory | null> {
  return getProductCategoryBySlug(slug);
}
