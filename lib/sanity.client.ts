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

// Create the Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
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

// Fetch all products (both types)
export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await client.fetch<Product[]>(allProductsQuery);
    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

// Fetch featured products (both types)
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await client.fetch<Product[]>(featuredProductsQuery);
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

// Fetch product by slug (either type)
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await client.fetch<Product>(productBySlugQuery, { slug });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Fetch products by category (both types)
export async function getProductsByCategory(slug: string): Promise<Product[]> {
  try {
    const products = await client.fetch<Product[]>(productsByCategoryQuery, {
      slug,
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

// Fetch related products (both types)
export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string
): Promise<Product[]> {
  try {
    const products = await client.fetch<Product[]>(relatedProductsQuery, {
      categoryId,
      currentProductId,
    });
    return products;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

// Search products (both types)
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const products = await client.fetch<Product[]>(searchProductsQuery, {
      query,
    } as any);
    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

// Fetch only product reviews
export async function getProductReviews(): Promise<ProductReview[]> {
  try {
    const products = await client.fetch<ProductReview[]>(productReviewsQuery);
    return products;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
}

// Fetch only product recommendations
export async function getProductRecommendations(): Promise<
  ProductRecommendation[]
> {
  try {
    const products = await client.fetch<ProductRecommendation[]>(
      productRecommendationsQuery
    );
    return products;
  } catch (error) {
    console.error("Error fetching product recommendations:", error);
    return [];
  }
}

// Blog functions
export async function getLatestPosts(limit: number = 6): Promise<Post[]> {
  try {
    const posts = await client.fetch<Post[]>(latestPostsQuery);
    return posts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return [];
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const posts = await client.fetch<Post[]>(allPostsQuery);
    return posts;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await client.fetch<Post>(postBySlugQuery, { slug });
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Category functions
export async function getAllProductCategories(): Promise<ProductCategory[]> {
  try {
    const categories = await client.fetch<ProductCategory[]>(
      allProductCategoriesQuery
    );
    return categories;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
}

export async function getAllBlogCategories(): Promise<BlogCategory[]> {
  try {
    const categories = await client.fetch<BlogCategory[]>(
      allBlogCategoriesQuery
    );
    return categories;
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [];
  }
}

export async function getProductCategoryBySlug(
  slug: string
): Promise<ProductCategory | null> {
  try {
    const category = await client.fetch<ProductCategory>(
      productCategoryBySlugQuery,
      { slug }
    );
    return category;
  } catch (error) {
    console.error("Error fetching product category:", error);
    return null;
  }
}

export async function getBlogCategoryBySlug(
  slug: string
): Promise<BlogCategory | null> {
  try {
    const category = await client.fetch<BlogCategory>(blogCategoryBySlugQuery, {
      slug,
    });
    return category;
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
