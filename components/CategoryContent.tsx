"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { Product, Category } from "@/lib/sanity.client";
import ProductFilter from "@/components/ProductFilter";
import ProductGrid from "@/components/ProductGrid";

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

                <ProductGrid
                  products={filteredProducts}
                  itemsPerPage={12}
                  showLoadMore={true}
                  emptyStateMessage="No products found"
                  emptyStateAction={{
                    text: "Browse All Products",
                    href: "/products",
                  }}
                />
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
