import {
  getAllProducts,
  getProductReviews,
  getAllPosts,
} from "./sanity.client";
import { getProductCardImage, getBlogCardImage } from "./sanity.image";

export async function getNewsletterContent() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mishbabyguide.com";

  // Fetch all content in parallel
  const [products, reviews, posts] = await Promise.all([
    getAllProducts(),
    getProductReviews(),
    getAllPosts(),
  ]);

  // Get 10 most recent products
  const newsletterProducts = products
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 10)
    .map((product) => ({
      title: product.title,
      excerpt: product.excerpt,
      image: product.mainImage
        ? getProductCardImage(product.mainImage)
        : `${baseUrl}/placeholder.jpg`,
      url: `${baseUrl}/products/${product.slug.current}`,
    }));

  // Get 2 most recent reviews
  const newsletterReviews = reviews
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 2)
    .map((review) => ({
      title: review.title,
      excerpt: review.excerpt,
      image: review.mainImage
        ? getProductCardImage(review.mainImage)
        : `${baseUrl}/placeholder.jpg`,
      url: `${baseUrl}/reviews/${review.slug.current}`,
    }));

  // Get most recent blog post
  const latestPost = posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )[0];

  const newsletterBlogPost = latestPost
    ? {
        title: latestPost.title,
        excerpt: latestPost.excerpt,
        image: latestPost.mainImage
          ? getBlogCardImage(latestPost.mainImage)
          : `${baseUrl}/placeholder.jpg`,
        url: `${baseUrl}/blog/${latestPost.slug.current}`,
      }
    : null;

  return {
    products: newsletterProducts,
    reviews: newsletterReviews,
    blogPost: newsletterBlogPost,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}
