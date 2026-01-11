"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Package, Loader2 } from "lucide-react";

import { Product } from "@/lib/sanity.client";
import { getProductCardImage } from "@/lib/sanity.image";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
}) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [productsPerPage] = useState(5);

  // Initialize displayed products
  useEffect(() => {
    setDisplayedProducts(products.slice(0, productsPerPage));
  }, [products, productsPerPage]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);

    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const nextProducts = products.slice(0, currentLength + productsPerPage);
      setDisplayedProducts(nextProducts);
      setIsLoadingMore(false);
    }, 500);
  };

  const hasMore = displayedProducts.length < products.length;

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-2xl h-96 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find any products matching your filters.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all"
        >
          View All Products
        </Link>
      </div>
    );
  }

  // Products grid
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product._id}
            title={product.title}
            slug={product.slug.current}
            image={
              product.mainImage
                ? getProductCardImage(product.mainImage)
                : "/placeholder-product.jpg"
            }
            price={product.price}
            excerpt={product.excerpt}
            amazonLink={product.amazonLink}
            category={product.category?.title}
            hasFullReview={product.hasFullReview}
          />
        ))}
      </div>

      {/* Load More Section */}
      {hasMore && (
        <div className="mt-12 space-y-6">
          {/* Load More Button */}
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="group relative px-8 py-4 bg-linear-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
            >
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-linear-to-r from-cyan-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Button content */}
              <div className="relative flex items-center gap-3">
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Load More</span>
                    <svg
                      className="h-5 w-5 transform group-hover:translate-y-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
            </button>
          </div>

          {/* Products counter */}
          {/* <div className="text-center">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {displayedProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {products.length}
              </span>{" "}
              products
            </p>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
