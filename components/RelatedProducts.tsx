import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/sanity.client";
import { getProductCardImage } from "@/lib/sanity.image";
import { Sparkles, ExternalLink, ArrowRight } from "lucide-react";

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
    <section className="py-16 bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 rounded-full mb-4 border border-cyan-100">
            <Sparkles className="h-4 w-4 text-cyan-600" />
            <span className="text-sm font-semibold text-cyan-600">
              Related Products
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {title}
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product) => {
            const imageUrl = product.mainImage
              ? getProductCardImage(product.mainImage)
              : "/placeholder-product.jpg";

            return (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                {/* Image */}
                <Link
                  href={`/products/${product.slug.current}`}
                  className="block relative h-64 bg-gray-50 overflow-hidden"
                >
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.category?.title && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-cyan-600 text-white text-xs font-semibold rounded-full shadow-md">
                        {product.category.title}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <Link href={`/products/${product.slug.current}`}>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-cyan-600 transition-colors line-clamp-2 min-h-14">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {product.excerpt}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/products/${product.slug.current}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 text-white text-sm font-semibold rounded-lg hover:bg-cyan-700 transition-all"
                    >
                      View Product
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={product.amazonLink}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-cyan-600 text-sm font-semibold rounded-lg border-2 border-cyan-600 hover:bg-cyan-50 transition-all"
                      title="View on Amazon"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
