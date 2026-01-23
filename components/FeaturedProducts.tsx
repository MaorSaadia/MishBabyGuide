import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getFeaturedProducts } from "@/lib/sanity.client";
import { getProductCardImage } from "@/lib/sanity.image";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";

const FeaturedProducts = async () => {
  // Fetch data directly in the server component
  const products = await getFeaturedProducts();
  const displayProducts = products.slice(0, 8);

  // If no products found
  if (displayProducts.length === 0) {
    return (
      <section
        id="featured-products"
        className="py-16 md:py-20 bg-white dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Top Picks"
            badgeIcon={<Sparkles className="h-4 w-4" />}
            title="Our Featured Products"
            subtitle="Hand-picked essentials that parents love and trust. Each product has been thoroughly tested and reviewed by our team."
            className="mb-12"
          />

          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No featured products yet. Add some products in Sanity Studio!
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all"
            >
              Go to Studio
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="featured-products"
      className="py-16 md:py-20 bg-white dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Top Picks</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Our Featured Products
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hand-picked essentials that parents love and trust. Each product has
            been thoroughly tested and reviewed by our team.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product._id}
              title={product.title}
              slug={product.slug.current}
              image={
                product.mainImage
                  ? getProductCardImage(product.mainImage)
                  : "/placeholder.jpg"
              }
              excerpt={product.excerpt}
              amazonLink={product.amazonLink}
              category={product.category?.title}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors group"
          >
            View All Products
            <svg
              className="h-5 w-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
