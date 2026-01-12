import { Metadata } from "next";
import {
  getAllProducts,
  getAllProductCategories,
  getProductReviews,
  getProductRecommendations,
} from "@/lib/sanity.client";
import ProductGrid from "@/components/ProductGrid";
import { Package, Filter } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Products - Baby Product Reviews | MishBabyGuide",
  description:
    "Browse all our recommended baby products. From full reviews to quick recommendations, find everything you need for your little one.",
  openGraph: {
    title: "All Products - MishBabyGuide",
    description: "Browse all our recommended baby products",
    type: "website",
  },
};

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const selectedType = params.type; // 'reviews' or 'recommendations'

  const categories = await getAllProductCategories();

  // Fetch products based on type filter
  let products;
  if (selectedType === "reviews") {
    products = await getProductReviews();
  } else if (selectedType === "recommendations") {
    products = await getProductRecommendations();
  } else {
    products = await getAllProducts();
  }

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
            <Package className="h-4 w-4" />
            <span className="text-sm font-semibold">All Products</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Product Recommendations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the best baby products we recommend. Full reviews and quick
            picks to help you make the right choice.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          {/* Type Filter */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Filter by type:
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedType
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Products
              </Link>
              <Link
                href="/products?type=reviews"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === "reviews"
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📝 Full Reviews
              </Link>
              <Link
                href="/products?type=recommendations"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === "recommendations"
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ⚡ Quick Recommendations
              </Link>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Filter by category:
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={
                    selectedType
                      ? `/products?type=${selectedType}`
                      : "/products"
                  }
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
                    href={`/products?category=${category.slug.current}${selectedType ? `&type=${selectedType}` : ""}`}
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
        </div>

        {/* Products Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-cyan-600">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} />

        {/* Info Banner */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <div className="bg-linear-to-br from-cyan-50 to-cyan-100 rounded-2xl p-8">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Full Reviews
            </h3>
            <p className="text-gray-600 mb-4">
              In-depth reviews with pros, cons, detailed analysis, and our
              expert opinion.
            </p>
            <Link
              href="/products?type=reviews"
              className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700"
            >
              View Full Reviews →
            </Link>
          </div>

          <div className="bg-linear-to-br from-sky-50 to-sky-100 rounded-2xl p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Quick Recommendations
            </h3>
            <p className="text-gray-600 mb-4">
              Products we recommend with quick descriptions. Perfect for fast
              shopping decisions.
            </p>
            <Link
              href="/products?type=recommendations"
              className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-700"
            >
              View Quick Picks →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;
