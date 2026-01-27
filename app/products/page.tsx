// app/products/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";
import { Package, Zap } from "lucide-react";

import {
  getAllProductCategories,
  getProductRecommendations,
} from "@/lib/sanity.client";
import ProductGrid from "@/components/ProductGrid";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

// Enhanced metadata with better SEO
export const metadata: Metadata = {
  title: "Quick Product Recommendations - Baby Products",
  description:
    "Browse our curated quick recommendations for baby products. Fast, reliable picks to help you make the right choice for your little one.",
  keywords: [
    "baby products",
    "baby product recommendations",
    "quick picks",
    "baby gear",
    "baby essentials",
  ],
  openGraph: {
    title: "Quick Product Recommendations - MishBabyGuide",
    description:
      "Browse our curated quick recommendations for baby products. Fast, reliable picks to help you make the right choice.",
    type: "website",
    images: [
      {
        url: "/og-products.jpg",
        width: 1200,
        height: 630,
        alt: "Baby Product Recommendations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Product Recommendations",
    description: "Curated baby product recommendations",
  },
  alternates: {
    canonical: "/products",
  },
};

// Loading component for ProductGrid
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-80 animate-pulse"
        />
      ))}
    </div>
  );
}

// Separate component for products to enable Suspense
async function ProductsContent({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  const products = await getProductRecommendations();

  // Filter by category if selected
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.category?.slug.current === selectedCategory,
      )
    : products;

  return (
    <>
      {/* Products Count */}
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-300">
          Showing{" "}
          <span className="font-semibold text-sky-600 dark:text-sky-400">
            {filteredProducts.length}
          </span>{" "}
          quick recommendation{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No products found in this category.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-all"
          >
            View All Products
          </Link>
        </div>
      )}
    </>
  );
}

export default async function ProductsPage({
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-900 text-sky-600 dark:text-sky-400 rounded-full mb-4">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold">Quick Recommendations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Quick Product Picks
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Curated baby products we recommend. Perfect for fast shopping
            decisions.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by category:
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                prefetch={true}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-sky-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                All Categories
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug.current}
                  href={`/category/${category.slug.current}`}
                  prefetch={true}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.slug.current
                      ? "bg-sky-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Content with Suspense */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductsContent selectedCategory={selectedCategory} />
        </Suspense>

        {/* Newsletter Subscription CTA */}
        <div className="mt-16">
          <NewsletterSubscribe />
        </div>

        {/* Info Banner - Link to Reviews */}
        <div className="mt-16">
          <div className="bg-linear-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900 dark:to-cyan-800 rounded-2xl p-8 border border-cyan-200 dark:border-cyan-700">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-5xl">📝</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Looking for Full Reviews?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Check out our in-depth reviews with pros, cons, detailed
                  analysis, and expert opinions.
                </p>
                <Link
                  href="/reviews"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 dark:bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-colors shadow-md hover:shadow-lg"
                >
                  View Full Reviews →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for Collection Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Baby Product Recommendations",
            description:
              "Curated quick recommendations for baby products to help parents make fast shopping decisions",
            url: "https://www.mishbabyguide.com/products",
            mainEntity: {
              "@type": "ItemList",
              name: "Baby Products",
            },
          }),
        }}
      />
    </div>
  );
}

// Cache for 15 minutes (products page updates moderately)
export const revalidate = 900;
