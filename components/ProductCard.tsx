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
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
      {/* Image Section */}
      <Link
        href={`/products/${slug}`}
        className="block relative h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {category && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 bg-cyan-600 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
              {category}
            </span>
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="p-6 flex flex-col grow">
        {/* Product Title */}
        <Link href={`/products/${slug}`} className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 hover:text-cyan-600 transition-colors line-clamp-2 min-h-[3.5rem] leading-snug">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4 grow">
          {excerpt}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          {/* View Product Button */}
          <Link
            href={`/products/${slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white text-sm font-semibold rounded-lg hover:bg-cyan-700 transition-all shadow-sm hover:shadow-md"
          >
            View Product
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Amazon Quick Link */}
          <Link
            href={amazonLink}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-3 bg-white text-cyan-600 text-sm font-semibold rounded-lg border-2 border-cyan-600 hover:bg-cyan-50 transition-all"
            title="View on Amazon"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
