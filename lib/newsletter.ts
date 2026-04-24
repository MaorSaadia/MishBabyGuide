import { getProductRecommendations } from "./sanity.client";
import { getProductCardImage } from "./sanity.image";

export async function getNewsletterContent() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mishbabyguide.com";

  const products = await getProductRecommendations();

  // Get 10 most recent product recommendations
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

  return {
    products: newsletterProducts,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}
