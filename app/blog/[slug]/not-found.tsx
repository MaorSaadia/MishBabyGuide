import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <BookOpen className="h-16 w-16 text-cyan-600 dark:text-cyan-400 mx-auto mb-6" />

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Article Not Found
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Sorry, we couldn&apos;t find the article you&apos;re looking for. It
          may have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all"
          >
            View All Articles
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
