import CategoriesGrid from "@/components/CategoriesGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";
import LatestReviews from "@/components/LatestReviews";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoriesGrid />
      <LatestReviews />
    </>
  );
}
