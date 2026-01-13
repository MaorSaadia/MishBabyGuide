// app/reviews/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { FileText, Filter } from "lucide-react";
import {
  getProductReviews,
  getAllProductCategories,
} from "@/lib/sanity.client";
import { getProductCardImage } from "@/lib/sanity.image";
import ProductReviewCard from "@/components/ProductReviewCard";

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

        {/* Reviews Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProducts.map((product) => (
              <ProductReviewCard
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
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600 mb-6">
              Try selecting a different category or check back later.
            </p>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all"
            >
              View All Reviews
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export const revalidate = 3600;
