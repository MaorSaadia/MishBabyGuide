import { Suspense } from "react";

import CategoriesGrid from "@/components/CategoriesGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedReviews from "@/components/FeaturedReviews";
import Hero from "@/components/Hero";
import LatestBlogs from "@/components/LatestBlogs";
import TrustBadges from "@/components/TrustBadges";
import { FeaturedProductsSkeleton } from "@/components/skeleton/FeaturedProductsSkeleton";
import { FeaturedReviewsSkeleton } from "@/components/skeleton/FeaturedReviewsSkeleton";
import { getFeaturedProducts, getProductReviews } from "@/lib/sanity.client";
import { getProductCardImage } from "@/lib/sanity.image";
import { generateItemListSchema, renderJsonLd } from "@/lib/structuredData";

// // Optional: Add metadata for SEO
// export const metadata = {
//   title: "Baby Product Reviews & Recommendations",
//   description: "Expert reviews and recommendations for baby products",
// };

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const productReviews = await getProductReviews();

  // Schema for featured products
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

  // Schema for featured reviews
  const reviewsSchema = generateItemListSchema(
    "Featured Product Reviews",
    productReviews.slice(0, 3).map((review) => ({
      name: review.title,
      url: `/products/${review.slug.current}`,
      image: review.mainImage
        ? getProductCardImage(review.mainImage)
        : undefined,
    }))
  );

  return (
    <>
      <Hero />
      {/* Featured Products with Suspense */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      {/* Featured Reviews with Suspense */}
      <Suspense fallback={<FeaturedReviewsSkeleton />}>
        <FeaturedReviews />
      </Suspense>

      <CategoriesGrid />
      <LatestBlogs />
      <TrustBadges />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJsonLd(featuredSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJsonLd(reviewsSchema)}
      />
    </>
  );
}
