import CategoriesGrid from "@/components/CategoriesGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";
import LatestReviews from "@/components/LatestReviews";
import TrustBadges from "@/components/TrustBadges";
import { getFeaturedProducts } from "@/lib/sanity.client";
import { getProductCardImage } from "@/lib/sanity.image";
import { generateItemListSchema, renderJsonLd } from "@/lib/structuredData";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  const featuredSchema = generateItemListSchema(
    "Featured Baby Products",
    featuredProducts.slice(0, 4).map((product) => ({
      name: product.title,
      url: `/products/${product.slug.current}`,
      image: product.mainImage
        ? getProductCardImage(product.mainImage)
        : undefined,
    }))
  );

  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoriesGrid />
      <LatestReviews />
      <TrustBadges />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJsonLd(featuredSchema)}
      />
    </>
  );
}
