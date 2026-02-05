/* eslint-disable @next/next/no-img-element */
// app/reviews/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight, FileText, Filter, Star } from "lucide-react";
import {
  getProductReviews,
  getAllProductCategories,
} from "@/lib/sanity.client";
import { getProductCardImage } from "@/lib/sanity.image";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

// Enhanced metadata with better SEO
export const metadata: Metadata = {
  title: "Product Reviews - In-Depth Baby Product Analysis",
  description:
    "Read our comprehensive baby product reviews with detailed pros, cons, and expert analysis to make the best choice for your little one.",
  keywords: [
    "baby product reviews",
    "product analysis",
    "pros and cons",
    "expert reviews",
    "baby gear reviews",
    "product comparisons",
  ],
  openGraph: {
    title: "Product Reviews - MishBabyGuide",
    description: "In-depth baby product reviews and analysis",
    type: "website",
    images: [
      {
        url: "/og-reviews.jpg", // Create this image
        width: 1200,
        height: 630,
        alt: "Product Reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "In-Depth Product Reviews",
    description: "Comprehensive baby product reviews with pros and cons",
  },
  alternates: {
    canonical: "/reviews",
  },
};

// Loading skeleton for reviews grid
function ReviewsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-96 animate-pulse"
        />
      ))}
    </div>
  );
}

// Separate component for reviews to enable Suspense
async function ReviewsContent({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  const products = await getProductReviews();

  // Filter by category if selected
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.category?.slug.current === selectedCategory,
      )
    : products;

  return (
    <>
      {/* Products Count */}
      <div className="mb-8 -mt-2">
        <p className="text-gray-600 dark:text-gray-300">
          Showing{" "}
          <span className="font-semibold text-cyan-600 dark:text-cyan-400">
            {filteredProducts.length}
          </span>{" "}
          {filteredProducts.length === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Reviews Grid */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-4 md:space-y-6 mb-16">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              {/* Always horizontal layout */}
              <div className="flex flex-row gap-3 md:gap-6 p-3 md:p-6">
                {/* Image Section - Fixed width on all screens */}
                <div className="w-32 sm:w-40 md:w-64 shrink-0">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Link href={`/reviews/${product.slug.current}`}>
                      <img
                        src={
                          product.mainImage
                            ? getProductCardImage(product.mainImage)
                            : "/placeholder.jpg"
                        }
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </Link>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-1.5 md:space-y-3">
                    {/* Category Badge */}
                    {product.category?.title && (
                      <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 rounded-full">
                        {product.category.title}
                      </span>
                    )}

                    {/* Title */}
                    <Link href={`/reviews/${product.slug.current}`}>
                      <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Excerpt - Always visible */}
                    {product.excerpt && (
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 line-clamp-2 md:line-clamp-4 mb-2 mt-1 sm:mt-2">
                        {product.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Footer with Read Review Link */}
                  <div className="flex items-center pt-2 md:pt-4 mt-auto border-t border-gray-100 dark:border-gray-700">
                    <Link
                      href={`/reviews/${product.slug.current}`}
                      className="inline-flex items-center gap-1.5 md:gap-2 text-cyan-600 dark:text-cyan-400 font-semibold hover:gap-2 md:hover:gap-3 transition-all text-xs md:text-base"
                    >
                      Read Review
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 md:py-16 bg-gray-50 dark:bg-gray-800 rounded-xl md:rounded-2xl">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <FileText className="w-8 h-8 md:w-10 md:h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Reviews Found
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 md:mb-6">
            Try selecting a different category or check back later.
          </p>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-cyan-600 dark:bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all text-sm md:text-base"
          >
            View All Reviews
          </Link>
        </div>
      )}
    </>
  );
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;

  // Fetch categories (cached)
  const categories = await getAllProductCategories();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400 rounded-full mb-4">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-semibold">Product Reviews</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            In-Depth Product Reviews
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive reviews with detailed analysis, pros & cons, and
            expert recommendations to help you choose the best for your baby.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by category:
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/reviews"
                prefetch={true}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                All Categories
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug.current}
                  href={`/reviews?category=${category.slug.current}`}
                  prefetch={true}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.slug.current
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Content with Suspense */}
        <Suspense fallback={<ReviewsGridSkeleton />}>
          <ReviewsContent selectedCategory={selectedCategory} />
        </Suspense>

        {/* Newsletter Subscription CTA */}
        <div className="mt-16">
          <NewsletterSubscribe />
        </div>

        {/* Info Banner */}
        <div className="mt-16 bg-linear-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 border border-cyan-100 dark:border-cyan-800">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="shrink-0">
              <div className="w-16 h-16 bg-cyan-600 dark:bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <Star className="h-8 w-8 text-white fill-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Why Trust Our Reviews?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Every product is personally tested and evaluated. We provide
                honest, detailed reviews covering pros, cons, and real-world
                performance to help you choose the best for your baby.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
              >
                Learn About Our Process →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Baby Product Reviews",
            description:
              "Comprehensive baby product reviews with detailed analysis and expert recommendations",
            url: "https://www.mishbabyguide.com/reviews",
          }),
        }}
      />
    </div>
  );
}

// Cache for 15 minutes (reviews update moderately)
export const revalidate = 900;
