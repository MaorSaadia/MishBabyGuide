"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Loader2 } from "lucide-react";
import { Product } from "@/lib/sanity.client";
import { getProductCardImage } from "@/lib/sanity.image";

interface ProductGridProps {
  products: Product[];
  itemsPerPage?: number;
  showLoadMore?: boolean;
  emptyStateMessage?: string;
  emptyStateAction?: {
    text: string;
    href: string;
  };
}

export default function ProductGrid({
  products,
  itemsPerPage = 12,
  showLoadMore = true,
  emptyStateMessage = "No products found",
  emptyStateAction,
}: ProductGridProps) {
  const [displayCount, setDisplayCount] = useState(itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);

  const displayedProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayCount((prev) => prev + itemsPerPage);
      setIsLoading(false);
    }, 500);
  };

  // Empty State
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {emptyStateMessage}
        </h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your filters or browse our other categories
        </p>
        {emptyStateAction && (
          <Link
            href={emptyStateAction.href}
            className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            {emptyStateAction.text}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More Products
                <span className="bg-cyan-700 px-2 py-0.5 rounded-full text-sm">
                  {products.length - displayCount} remaining
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Pagination Info */}
      <div className="mt-8 text-center text-gray-600">
        Showing {displayedProducts.length} of {products.length} products
      </div>
    </div>
  );
}

// Product Card Component
interface ProductCardProps {
  product: Product;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
      style={{
        animation: `fadeIn 0.5s ease-in-out ${index * 0.05}s both`,
      }}
    >
      {/* Product Image */}
      <Link href={`/product/${product.slug.current}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.mainImage?.asset ? (
            <Image
              src={getProductCardImage(product.mainImage.asset)}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              loading={index < 8 ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              Featured
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4">
        {/* Category & Subcategory */}
        <div className="flex items-center gap-2 mb-2">
          {product.category && (
            <Link
              href={`/category/${product.category.slug.current}`}
              className="text-xs text-gray-500 hover:text-cyan-600 transition-colors"
            >
              {product.category.title}
            </Link>
          )}
          {product.subcategory && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-cyan-600 font-medium">
                {product.subcategory}
              </span>
            </>
          )}
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.slug.current}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors min-h-14">
            {product.title}
          </h3>
        </Link>

        {/* Product Excerpt */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-10">
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
            onClick={(e) => {
              e.stopPropagation();
              // Track analytics here if needed
            }}
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

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Loading Skeleton Component
export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="aspect-square bg-gray-200" />

          {/* Content Skeleton */}
          <div className="p-4">
            {/* Category */}
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />

            {/* Title */}
            <div className="space-y-2 mb-3">
              <div className="h-5 bg-gray-200 rounded w-full" />
              <div className="h-5 bg-gray-200 rounded w-2/3" />
            </div>

            {/* Excerpt */}
            <div className="space-y-2 mb-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>

            {/* Rating */}
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />

            {/* Price & Button */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-9 bg-gray-200 rounded w-2/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
