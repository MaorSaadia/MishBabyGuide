"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ProductReviewCardProps {
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  amazonLink: string;
  category?: string;
}

const ProductReviewCard = ({
  title,
  slug,
  image,
  excerpt,
}: ProductReviewCardProps) => {
  return (
    <article className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <Link
        href={`/reviews/${slug}`}
        className="relative block overflow-hidden"
      >
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Review Badge */}
          <div className="absolute top-4 left-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            📝 Full Review
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col grow">
        {/* Title */}
        <Link href={`/products/${slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 grow">
          {excerpt}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          {/* Read Review Button */}
          <Link
            href={`/products/${slug}`}
            className="flex-1 px-4 py-2.5 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all flex items-center justify-center gap-2 group/btn"
          >
            <span>Read Review</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>

          {/* Amazon Link Button */}
          {/* <a
            href={amazonLink}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="px-4 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 group/amazon"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4 group-hover/amazon:scale-110 transition-transform" />
          </a> */}
        </div>
      </div>
    </article>
  );
};

export default ProductReviewCard;
