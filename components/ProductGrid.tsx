import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/sanity.client";
import { getProductCardImage } from "@/lib/sanity.image";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
}) => {
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
          We couldn&apos;t find any products in this category yet.
        </p>
        <a
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all"
        >
          Browse All Products
        </a>
      </div>
    );
  }

  // Products grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
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
        />
      ))}
    </div>
  );
};

export default ProductGrid;
