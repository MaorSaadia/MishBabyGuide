import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle className="h-16 w-16 text-cyan-600 mx-auto mb-6" />

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Category Not Found
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the category you&apos;re looking for. It
          may have been moved or doesn&apos;t exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all"
          >
            Browse Categories
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-cyan-600 font-semibold rounded-lg border-2 border-cyan-600 hover:bg-cyan-50 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
