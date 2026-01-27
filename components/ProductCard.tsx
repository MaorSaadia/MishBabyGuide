import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";

interface ProductCardProps {
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  amazonLink: string;
  category?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  slug,
  image,
  amazonLink,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-900 flex flex-col h-full">
      {/* Image Section */}
      <Link
        href={`/products/${slug}`}
        className="block relative h-48 sm:h-56 md:h-64 lg:h-72 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col grow bg-white dark:bg-gray-800">
        {/* Product Title */}
        <Link href={`/products/${slug}`} className="mb-2 sm:mb-3">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-cyan-600 transition-colors line-clamp-3 min-h-10 sm:min-h-12 md:min-h-14 leading-tight sm:leading-snug">
            {title}
          </h3>
        </Link>

        {/* Description - Hidden on mobile */}
        {/* <p className="hidden sm:block text-gray-600 text-xs md:text-sm line-clamp-3 md:line-clamp-4 leading-relaxed mb-3 md:mb-4 grow">
          {excerpt}
        </p> */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          {/* View Product Button */}
          <Link
            href={`/products/${slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-cyan-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-cyan-700 transition-all shadow-sm hover:shadow-md"
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
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-white dark:bg-gray-800 text-cyan-600 text-xs sm:text-sm font-semibold rounded-lg border-2 border-cyan-600 hover:bg-cyan-50 transition-all"
            title="View on Amazon"
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="ml-1.5 sm:hidden">Amazon</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
