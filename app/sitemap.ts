// app/sitemap.ts
import { MetadataRoute } from "next";
import {
  getAllPosts,
  getAllProducts,
  getAllProductCategories,
  getAllBlogCategories,
} from "@/lib/sanity.client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mishbabyguide.com";

  // Fetch all dynamic content in parallel for better performance
  const [posts, products, productCategories, blogCategories] =
    await Promise.all([
      getAllPosts(),
      getAllProducts(),
      getAllProductCategories(),
      getAllBlogCategories(),
    ]);

  // Static pages with proper priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/recommendations`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Product category pages
  const productCategoryPages: MetadataRoute.Sitemap = productCategories.map(
    (category) => ({
      url: `${baseUrl}/category/${category.slug.current}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  // Blog category pages
  const blogCategoryPages: MetadataRoute.Sitemap = blogCategories.map(
    (category) => ({
      url: `${baseUrl}/blog/category/${category.slug.current}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    }),
  );

  // All product pages (both reviews and recommendations)
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug.current}`,
    lastModified: new Date(product.publishedAt),
    changeFrequency: "monthly",
    priority: product.featured ? 0.85 : 0.7,
  }));

  // Separate routes for reviews only (if you have a dedicated reviews section)
  const reviewPages: MetadataRoute.Sitemap = products
    .filter((product) => product._type === "productReview")
    .map((product) => ({
      url: `${baseUrl}/reviews/${product.slug.current}`,
      lastModified: new Date(product.publishedAt),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  // Blog post pages
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Combine all pages
  return [
    ...staticPages,
    ...productCategoryPages,
    ...blogCategoryPages,
    ...productPages,
    ...reviewPages,
    ...postPages,
  ];
}

// Optional: Add dynamic segment config for better performance
export const revalidate = 3600; // Revalidate sitemap every hour
