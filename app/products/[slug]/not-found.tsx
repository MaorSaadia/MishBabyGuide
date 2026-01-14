// app/products/[slug]/not-found.tsx
import Link from "next/link";
import { Package } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Package className="h-16 w-16 text-cyan-600 dark:text-cyan-400 mx-auto mb-6" />

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Product Not Found
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Sorry, we couldn&apos;t find the product you&apos;re looking for. It
          may have been removed or the link might be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-cyan-600 dark:bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all"
          >
            Browse Products
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 font-semibold rounded-lg border-2 border-cyan-600 dark:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-gray-700 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
