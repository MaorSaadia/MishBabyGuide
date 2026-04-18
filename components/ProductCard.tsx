import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";

import SaveProductButton from "@/components/SaveProductButton";
import type { SavedProductInput } from "@/lib/saved-products";

interface ProductCardProps {
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  amazonLink: string;
  category?: string;
  savedProduct?: SavedProductInput;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  slug,
  image,
  amazonLink,
  savedProduct,
}) => {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cyan-900">
      {/* Image Section */}
      <Link
        href={`/products/${slug}`}
        className="relative block aspect-square overflow-hidden bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
      >
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 sm:p-4"
        />
        {/* {category && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-cyan-600 text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
              {category}
            </span>
          </div>
        )} */}
      </Link>

      {/* Content Section */}
      <div className="flex grow flex-col bg-white p-3 dark:bg-gray-900 sm:p-4">
        {/* Product Title */}
        <Link href={`/products/${slug}`} className="mb-3">
          <h3 className="line-clamp-3 min-h-14 text-sm font-bold leading-snug text-gray-950 transition-colors hover:text-cyan-600 dark:text-gray-100 sm:text-base">
            {title}
          </h3>
        </Link>

        {/* Description - Hidden on mobile */}
        {/* <p className="hidden sm:block text-gray-600 text-xs md:text-sm line-clamp-3 md:line-clamp-4 leading-relaxed mb-3 md:mb-4 grow">
          {excerpt}
        </p> */}

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2">
          {/* View Product Button */}
          <Link
            href={`/products/${slug}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-cyan-700 hover:shadow-md sm:gap-2 sm:text-sm"
          >
            <span className="hidden sm:inline">View Product</span>
            <span className="sm:hidden">View</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>

          {/* Amazon Quick Link */}
          <Link
            href={amazonLink}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-cyan-600 bg-white px-3 py-2.5 text-xs font-semibold text-cyan-600 transition-all hover:bg-cyan-50 dark:bg-gray-900 dark:hover:bg-cyan-950/30 sm:px-3 sm:text-sm"
            title="View on Amazon"
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="ml-1.5 sm:hidden">Amazon</span>
          </Link>
          {savedProduct && (
            <SaveProductButton product={savedProduct} compact />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
