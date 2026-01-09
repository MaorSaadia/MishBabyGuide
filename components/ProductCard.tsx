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
      {/* Image Section */}
      {hasFullReview ? (
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
      ) : (
        <div className="block relative h-64 bg-gray-50 overflow-hidden">
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
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Product Title */}
        {hasFullReview ? (
          <Link href={`/products/${slug}`}>
            <h3 className="text-xl font-bold text-gray-900 hover:text-cyan-600 transition-colors line-clamp-2 group-hover:text-cyan-600">
              {title}
            </h3>
          </Link>
        ) : (
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {title}
          </h3>
        )}

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
        {hasFullReview ? (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* View on Amazon Button */}
            <Link
              href={amazonLink}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all shadow-sm hover:shadow-md"
            >
              View on Amazon
              <ExternalLink className="h-4 w-4" />
            </Link>

            {/* Read Review Link */}
            <Link
              href={`/products/${slug}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-cyan-600 font-semibold rounded-lg border-2 border-cyan-600 hover:bg-cyan-50 transition-all"
            >
              Full Review
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="pt-2">
            {/* Amazon Button Only */}
            <Link
              href={amazonLink}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all shadow-sm hover:shadow-md"
            >
              Buy on Amazon
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
