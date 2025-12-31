import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/sanity.client";
import { getProductCardImage } from "@/lib/sanity.image";
import { Sparkles } from "lucide-react";

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  title = "You Might Also Like",
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50 rounded-2xl">
      <div className="px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-4 shadow-sm">
            <Sparkles className="h-4 w-4 text-cyan-600" />
            <span className="text-sm font-semibold text-cyan-600">
              Related Products
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
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
      </div>
    </section>
  );
};

export default RelatedProducts;
