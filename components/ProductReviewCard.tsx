"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
    <article className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      {/* Image Container */}
      <Link
        href={`/reviews/${slug}`}
        className="relative block overflow-hidden bg-gray-100 dark:bg-gray-900"
      >
        <div className="relative w-full aspect-square">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Review Badge */}
          <div className="absolute top-4 left-4 bg-cyan-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Full Review
          </div>

          {/* Category Badge */}
          {/* {category && (
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm shadow-md">
              {category}
            </div>
          )} */}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col grow">
        {/* Title */}
        <Link href={`/reviews/${slug}`}>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-6 line-clamp-3 grow leading-relaxed">
          {excerpt}
        </p>

        {/* Action Button */}
        <Link
          href={`/reviews/${slug}`}
          className="w-full px-4 py-2 bg-linear-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold text-sm sm:text-md rounded-xl transition-all flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <span>Read Review</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-linear-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </article>
  );
};

export default ProductReviewCard;
