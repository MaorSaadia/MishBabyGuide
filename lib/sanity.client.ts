import { createClient } from "next-sanity";
import {
  featuredProductsQuery,
  latestPostsQuery,
  allCategoriesQuery,
  productsByCategoryQuery,
  productBySlugQuery,
  postBySlugQuery,
  categoryBySlugQuery,
  allPostsQuery,
  allProductsQuery,
  searchProductsQuery,
  relatedProductsQuery,
} from "./sanity.queries";

// Create the Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Set to true in production for better performance
});

// Type definitions
export interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: {
      _id: string;
      url: string;
    };
  };
  gallery?: Array<{
    asset: {
      _id: string;
      url: string;
    };
  }>;
  price: string;
  rating?: number;
  excerpt: string;
  amazonLink: string;
  category?: {
    title: string;
    slug: { current: string };
  };
  subcategory?: string;
  pros?: string[];
  cons?: string[];
  review?: unknown[];
  featured?: boolean;
  publishedAt: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface Post {
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
  body?: unknown[];
  publishedAt: string;
  author?: string;
  categories?: Array<{
    title: string;
    slug: { current: string };
  }>;
  relatedProducts?: Product[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  icon?: string;
}

// Fetch featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await client.fetch<Product[]>(featuredProductsQuery);
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

// Fetch latest posts
export async function getLatestPosts(limit: number = 6): Promise<Post[]> {
  try {
    const posts = await client.fetch<Post[]>(latestPostsQuery);
    return posts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return [];
  }
}

// Fetch all categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await client.fetch<Category[]>(allCategoriesQuery);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Fetch products by category
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

// Fetch single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await client.fetch<Product>(productBySlugQuery, { slug });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Fetch single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await client.fetch<Post>(postBySlugQuery, { slug });
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Fetch category by slug
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const category = await client.fetch<Category>(categoryBySlugQuery, {
      slug,
    });
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// Fetch all posts
export async function getAllPosts(): Promise<Post[]> {
  try {
    const posts = await client.fetch<Post[]>(allPostsQuery);
    return posts;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

// Fetch all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await client.fetch<Product[]>(allProductsQuery);
    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

// Search products
export async function searchProducts(searchQuery: string): Promise<Product[]> {
  try {
    const products = await client.fetch<Product[]>(searchProductsQuery, {
      searchQuery,
    });
    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

// Get related products
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
