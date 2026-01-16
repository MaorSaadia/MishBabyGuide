import Link from "next/link";
import { getLatestPosts } from "@/lib/sanity.client";
import { getBlogCardImage } from "@/lib/sanity.image";
import { BookOpen, TrendingUp } from "lucide-react";
import BlogCard from "./BlogCard";

// Server Component - no "use client" needed
const LatestBlogs = async () => {
  // Fetch data directly on the server
  const posts = await getLatestPosts(6);

  // Empty state
  if (posts.length === 0) {
    return (
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400 rounded-full mb-4">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-semibold">Latest Articles</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Blogs & Guides
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Expert insights and buying guides to help you choose the best
            </p>
          </div>

          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No blog posts yet. Start creating content in Sanity Studio!
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 dark:bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all"
            >
              Go to Studio
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400 rounded-full mb-4">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">Latest Articles</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Blogs & Guides
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Expert insights, honest reviews, and buying guides to help you make
            the best choices for your baby
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard
              key={post._id}
              title={post.title}
              slug={post.slug.current}
              mainImage={
                post.mainImage ? getBlogCardImage(post.mainImage) : undefined
              }
              excerpt={post.excerpt}
              publishedAt={post.publishedAt}
              author={post.author}
              category={post.categories?.[0]?.title}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 dark:bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all shadow-md hover:shadow-lg group"
          >
            View All Articles
            <svg
              className="h-5 w-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;
