"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, TrendingUp } from "lucide-react";

import BlogCard from "./BlogCard";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: {
      url: string;
    };
  };
  excerpt: string;
  publishedAt: string;
  author?: string;
  categories?: Array<{
    title: string;
  }>;
}

const LatestReviews = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = `*[_type == "post"] | order(publishedAt desc)[0...6] {
          _id,
          title,
          slug,
          mainImage {
            asset-> {
              url
            }
          },
          excerpt,
          publishedAt,
          author,
          categories[]-> {
            title
          }
        }`;

        const response = await fetch(
          `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/production?query=${encodeURIComponent(query)}`
        );

        const data = await response.json();
        setPosts(data.result || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl h-96 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full mb-4">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-semibold">Latest Articles</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Reviews & Guides
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert insights and buying guides to help you choose the best
            </p>
          </div>

          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              No blog posts yet. Start creating content in Sanity Studio!
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all"
            >
              Go to Studio
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full mb-4">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">Latest Articles</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Reviews & Guides
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
              mainImage={post.mainImage?.asset?.url}
              excerpt={post.excerpt || "Read this article to learn more..."}
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all shadow-md hover:shadow-lg group"
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

export default LatestReviews;
