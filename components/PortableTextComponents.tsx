// components/PortableTextComponents.tsx
import Image from "next/image";
import { PortableTextComponents } from "@portabletext/react";
import { getImageUrl } from "@/lib/sanity.image";
import Link from "next/link";

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
  },
};
