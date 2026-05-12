import { getProductRecommendations } from "./sanity.client";
import { getProductCardImage } from "./sanity.image";

function getRandomProducts<T>(items: T[], count: number) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, count);
}

export async function getNewsletterContent() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mishbabyguide.com";

  const products = await getProductRecommendations();

  const newsletterProducts = getRandomProducts(products, 10).map((product) => ({
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
