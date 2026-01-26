// components/PortableTextComponents.tsx
import Image from "next/image";
import { PortableTextComponents } from "@portabletext/react";
import { getImageUrl } from "@/lib/sanity.image";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";

export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-cyan-600 dark:border-cyan-400 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-4">{children}</li>,
    number: ({ children }) => <li className="ml-4">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900 dark:text-white">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const rel = !value?.href?.startsWith("/")
        ? "noopener noreferrer"
        : undefined;
      return (
        <Link
          href={value?.href}
          rel={rel}
          target={!value?.href?.startsWith("/") ? "_blank" : undefined}
          className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={getImageUrl(value, 1200, 675)}
              alt={value.alt || "Article image"}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    // NEW: Product Recommendation Block
    productRecommendation: ({ value }) => {
      if (!value?.productName || !value?.amazonLink) return null;

      return (
        <div className="my-8 p-6 bg-linear-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800">
          {value.topPick && (
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                Top Pick
              </span>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            {value.productImage?.asset && (
              <div className="md:w-1/3 shrink-0">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-white">
                  <Image
                    src={getImageUrl(value.productImage, 400, 400)}
                    alt={value.productName}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.productName}
                </h3>
                {value.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {value.description}
                  </p>
                )}
              </div>

              <Link
                href={value.amazonLink}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg group w-full md:w-auto"
              >
                View on Amazon
                <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      );
    },
  },
};
