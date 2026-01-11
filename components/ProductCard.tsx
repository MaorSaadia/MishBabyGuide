import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";

interface ProductCardProps {
  title: string;
  slug: string;
  image: string;
  price: string;
  excerpt: string;
  amazonLink: string;
  category?: string;
  hasFullReview?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  slug,
  image,
  price,
  excerpt,
  amazonLink,
  category,
  hasFullReview = false,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Image Section - Always clickable now */}
      <Link
        href={`/products/${slug}`}
        className="block relative h-64 bg-gray-50 overflow-hidden"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-cyan-600 text-white text-xs font-medium rounded-full">
              {category}
            </span>
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Product Title - Always clickable */}
        <Link href={`/products/${slug}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-cyan-600 transition-colors line-clamp-2 group-hover:text-cyan-600">
            {title}
          </h3>
        </Link>

        {/* Price */}
        {price && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-cyan-600">{price}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {excerpt}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* View Product Button - Goes to your site */}
          <Link
            href={`/products/${slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all shadow-sm hover:shadow-md"
          >
            {hasFullReview ? "Read Review" : "View Product"}
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Quick Amazon Link */}
          <Link
            href={amazonLink}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-cyan-600 font-semibold rounded-lg border-2 border-cyan-600 hover:bg-cyan-50 transition-all"
          >
            Amazon
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
