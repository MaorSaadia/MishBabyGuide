"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import SaveProductButton from "@/components/SaveProductButton";
import type { SavedProductInput } from "@/lib/saved-products";

interface ProductReviewCardProps {
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  amazonLink: string;
  category?: string;
  savedProduct?: SavedProductInput;
}

const ProductReviewCard = ({
  title,
  slug,
  image,
  excerpt,
  savedProduct,
}: ProductReviewCardProps) => {
  return (
    <article className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      {/* Image Container */}
      <Link
        href={`/reviews/${slug}`}
        className="relative block overflow-hidden bg-gray-100 dark:bg-gray-900"
      >
        <div className="relative w-full aspect-square">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Review Badge */}
          <div className="absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1 rounded-full bg-cyan-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm sm:left-4 sm:top-4 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
            <CheckCircle2 className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
            <span className="truncate">Full Review</span>
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
      <div className="flex grow flex-col p-2.5 sm:p-3">
        {/* Title */}
        <Link href={`/reviews/${slug}`}>
          <h3 className="mb-1 line-clamp-3 min-h-16 text-sm font-bold leading-tight text-gray-900 transition-colors group-hover:text-cyan-600 dark:text-gray-100 dark:group-hover:text-cyan-400 sm:min-h-0 sm:text-xl md:text-2xl">
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="mb-4 grow line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:mb-6 sm:line-clamp-3 sm:text-sm md:text-base">
          {excerpt}
        </p>

        {/* Action Button */}
        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_36px] items-center gap-1.5 sm:-mt-3 sm:flex sm:gap-2">
          <Link
            href={`/reviews/${slug}`}
            className="inline-flex min-w-0 items-center justify-center gap-1 rounded-xl bg-linear-to-r from-cyan-600 to-cyan-700 px-2 py-2 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-cyan-700 hover:to-cyan-800 hover:shadow-lg sm:flex-1 sm:gap-2 sm:px-4 sm:text-base"
          >
            <span className="sm:hidden">Read</span>
            <span className="hidden sm:inline">Read Review</span>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform" />
          </Link>
          {savedProduct && (
            <SaveProductButton product={savedProduct} compact />
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-linear-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </article>
  );
};

export default ProductReviewCard;
