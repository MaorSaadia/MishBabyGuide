"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import { getProductCardImage } from "@/lib/sanity.image";
import {
  getFeaturedProducts,
  Product,
  isProductReview,
  isProductRecommendation,
} from "@/lib/sanity.client";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import ReviewCard from "./ReviewCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getFeaturedProducts();
      setProducts(data.slice(0, 4));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section id="featured-products" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl h-96 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no products
  if (products.length === 0) {
    return (
      <section id="featured-products" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Top Picks"
            badgeIcon={<Sparkles className="h-4 w-4" />}
            title="Our Featured Products"
            subtitle="Hand-picked essentials that parents love and trust."
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
    <section id="featured-products" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Top Picks</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hand-picked essentials that parents love and trust. Reviews and
            recommendations to help you choose the best.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const imageUrl = product.mainImage
              ? getProductCardImage(product.mainImage)
              : "/placeholder.jpg";

            // Render ReviewCard for reviews, ProductCard for recommendations
            if (isProductReview(product)) {
              return (
                <ReviewCard
                  key={product._id}
                  title={product.title}
                  slug={product.slug.current}
                  image={imageUrl}
                  excerpt={product.excerpt}
                  amazonLink={product.amazonLink}
                  category={product.category?.title}
                  prosCount={product.pros?.length || 0}
                  consCount={product.cons?.length || 0}
                />
              );
            } else if (isProductRecommendation(product)) {
              return (
                <ProductCard
                  key={product._id}
                  title={product.title}
                  slug={product.slug.current}
                  image={imageUrl}
                  excerpt={product.excerpt}
                  amazonLink={product.amazonLink}
                  category={product.category?.title}
                />
              );
            }
            return null;
          })}
        </div>

        {/* View All Links */}
        <div className="flex justify-center gap-6 mt-12">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors group"
          >
            All Reviews
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
          <span className="text-gray-400">|</span>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors group"
          >
            All Products
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
