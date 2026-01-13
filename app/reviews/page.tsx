// app/reviews/page.tsx
import { Metadata } from "next";
import {
  getProductReviews,
  getAllProductCategories,
} from "@/lib/sanity.client";
import ProductGrid from "@/components/ProductGrid";
import { FileText, Filter } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product Reviews - In-Depth Baby Product Analysis | MishBabyGuide",
  description:
    "Read our comprehensive baby product reviews with detailed pros, cons, and expert analysis to make the best choice for your little one.",
  openGraph: {
    title: "Product Reviews - MishBabyGuide",
    description: "In-depth baby product reviews and analysis",
    type: "website",
  },
};

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;

  const [products, categories] = await Promise.all([
    getProductReviews(),
    getAllProductCategories(),
  ]);

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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full mb-4">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-semibold">Product Reviews</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            📝 In-Depth Product Reviews
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive reviews with detailed analysis, pros & cons, and
            expert recommendations to help you choose the best for your baby.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Filter by category:
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/reviews"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Categories
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug.current}
                  href={`/reviews?category=${category.slug.current}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.slug.current
                      ? "bg-cyan-600 text-white"
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
            <span className="font-semibold text-cyan-600">
              {filteredProducts.length}
            </span>{" "}
            reviews
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} urlPrefix="/reviews" />
      </div>
    </div>
  );
}

export const revalidate = 3600;
