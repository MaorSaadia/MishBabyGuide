"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronRight, Package } from "lucide-react";

import { Product, Category } from "@/lib/sanity.client";
import { getProductCardImage } from "@/lib/sanity.image";
import ProductFilter from "@/components/ProductFilter";

interface CategoryContentProps {
  category: Category;
  initialProducts: Product[];
}

export default function CategoryContent({
  category,
  initialProducts,
}: CategoryContentProps) {
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);

  return (
    <div className="min-h-screen bg-linear-to-b from-cyan-50 to-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-cyan-600 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href="/products"
              className="text-gray-600 hover:text-cyan-600 transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-cyan-600 font-medium">{category.title}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <section className="bg-linear-to-r from-cyan-100 to-blue-100 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {category.icon && (
              <div className="text-6xl mb-4">{category.icon}</div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {category.title}
            </h1>
            {category.description && (
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-600">
              <Package className="w-5 h-5" />
              <span>
                {initialProducts.length}{" "}
                {initialProducts.length === 1 ? "Product" : "Products"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section with Filter */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {initialProducts.length === 0 ? (
            // Empty State
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No Products Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  We&apos;re currently curating products for this category.
                  Check back soon!
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filter Sidebar */}
              <aside className="lg:w-64 shrink-0">
                <ProductFilter
                  products={initialProducts}
                  onFilterChange={setFilteredProducts}
                />
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing {filteredProducts.length} of{" "}
                    {initialProducts.length} products
                  </p>
                </div>

                {filteredProducts.length === 0 ? (
                  // No Results
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters to see more results
                    </p>
                  </div>
                ) : (
                  // Products Grid
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                      >
                        {/* Product Image */}
                        <Link href={`/product/${product.slug.current}`}>
                          <div className="relative aspect-square overflow-hidden bg-gray-100">
                            {product.mainImage?.asset ? (
                              <Image
                                src={getProductCardImage(
                                  product.mainImage.asset
                                )}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-16 h-16 text-gray-300" />
                              </div>
                            )}

                            {/* Featured Badge */}
                            {product.featured && (
                              <div className="absolute top-3 left-3 bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                Featured
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="p-4">
                          {/* Subcategory */}
                          {product.subcategory && (
                            <div className="mb-2">
                              <span className="text-xs text-cyan-600 font-medium">
                                {product.subcategory}
                              </span>
                            </div>
                          )}

                          {/* Product Title */}
                          <Link href={`/product/${product.slug.current}`}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                              {product.title}
                            </h3>
                          </Link>

                          {/* Product Excerpt */}
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.excerpt}
                          </p>

                          {/* Rating */}
                          {product.rating && (
                            <div className="flex items-center gap-1 mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating!)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 ml-1">
                                {product.rating.toFixed(1)}
                              </span>
                            </div>
                          )}

                          {/* Price & CTA */}
                          <div className="flex items-center justify-between pt-3 border-t">
                            <span className="text-xl font-bold text-gray-900">
                              {product.price}
                            </span>
                            <a
                              href={product.amazonLink}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-1"
                            >
                              View on Amazon
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Affiliate Disclaimer */}
      <section className="bg-cyan-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-600">
              <strong>Affiliate Disclosure:</strong> As an Amazon Associate, we
              earn from qualifying purchases. This means when you click on
              product links and make a purchase, we may earn a commission at no
              additional cost to you.{" "}
              <Link
                href="/disclaimer"
                className="text-cyan-600 hover:text-cyan-700 underline"
              >
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Check out our blog for detailed guides and product comparisons
            </p>
            <Link
              href="/blog"
              className="inline-block bg-white hover:bg-gray-50 text-cyan-600 border-2 border-cyan-600 px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
