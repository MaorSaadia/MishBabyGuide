// app/products/page.tsx
import { Metadata } from "next";
import {
  getAllProductCategories,
  getProductRecommendations,
} from "@/lib/sanity.client";
import ProductGrid from "@/components/ProductGrid";
import { Package, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quick Product Recommendations - Baby Products | MishBabyGuide",
  description:
    "Browse our curated quick recommendations for baby products. Fast, reliable picks to help you make the right choice.",
  openGraph: {
    title: "Quick Product Recommendations - MishBabyGuide",
    description: "Browse our curated quick recommendations for baby products",
    type: "website",
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;

  const categories = await getAllProductCategories();

  // Only fetch quick recommendations
  const products = await getProductRecommendations();

  // Filter by category if selected
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.category?.slug.current === selectedCategory
      )
    : products;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-full mb-4">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold">Quick Recommendations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Quick Product Picks
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated baby products we recommend. Perfect for fast shopping
            decisions.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Filter by category:
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-sky-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Categories
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug.current}
                  href={`/products?category=${category.slug.current}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.slug.current
                      ? "bg-sky-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-sky-600">
              {filteredProducts.length}
            </span>{" "}
            quick recommendations
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} />

        {/* Info Banner - Link to Reviews */}
        <div className="mt-16">
          <div className="bg-linear-to-br from-cyan-50 to-cyan-100 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-5xl">📝</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Looking for Full Reviews?
                </h3>
                <p className="text-gray-600 mb-4">
                  Check out our in-depth reviews with pros, cons, detailed
                  analysis, and expert opinions.
                </p>
                <Link
                  href="/reviews"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-full hover:bg-cyan-700 transition-colors"
                >
                  View Full Reviews →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;
