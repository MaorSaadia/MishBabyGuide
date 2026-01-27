// app/blog/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";
import { BookOpen, Filter } from "lucide-react";

import BlogCard from "@/components/BlogCard";
import { getAllPosts, getAllBlogCategories } from "@/lib/sanity.client";
import { getBlogCardImage } from "@/lib/sanity.image";

// Enhanced metadata with better SEO
export const metadata: Metadata = {
  title: "Blog - Baby Product Reviews & Parenting Guides",
  description:
    "Expert advice, buying guides, and helpful tips for parents. Read our latest articles on baby products, parenting tips, and honest product reviews.",
  keywords: [
    "baby product reviews",
    "parenting guides",
    "baby care tips",
    "product buying guides",
    "parenting advice",
    "baby gear recommendations",
  ],
  openGraph: {
    title: "Blog - MishBabyGuide",
    description: "Expert advice, buying guides, and helpful tips for parents",
    type: "website",
    images: [
      {
        url: "/og-blog.jpg", // Create this image
        width: 1200,
        height: 630,
        alt: "MishBabyGuide Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Expert Parenting Advice",
    description: "Expert advice and buying guides for parents",
  },
  alternates: {
    canonical: "/blog",
  },
};

// Loading skeleton for blog grid
function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-96 animate-pulse"
        />
      ))}
    </div>
  );
}

// Separate component for blog posts to enable Suspense
async function BlogPostsContent({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllBlogCategories(),
  ]);

  // Filter posts by category if selected
  const filteredPosts = selectedCategory
    ? posts.filter((post) =>
        post.categories?.some((cat) => cat.slug.current === selectedCategory),
      )
    : posts;

  return (
    <>
      {/* Posts Count */}
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredPosts.length}
          </span>{" "}
          {filteredPosts.length === 1 ? "article" : "articles"} found
          {selectedCategory && (
            <>
              {" "}
              in{" "}
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                {
                  categories.find(
                    (cat) => cat.slug.current === selectedCategory,
                  )?.title
                }
              </span>
            </>
          )}
        </p>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
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
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Articles Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn&apos;t find any articles in this category yet.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all"
          >
            View All Articles
          </Link>
        </div>
      )}
    </>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;

  // Fetch categories for filter (cached)
  const categories = await getAllBlogCategories();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-full mb-4">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-semibold">Our Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Articles & Guides
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Expert advice, honest reviews, and helpful guides to make parenting
            easier
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by category:
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                prefetch={true}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug.current}
                  href={`/blog?category=${category.slug.current}`}
                  prefetch={true}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.slug.current
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts Content with Suspense */}
        <Suspense fallback={<BlogGridSkeleton />}>
          <BlogPostsContent selectedCategory={selectedCategory} />
        </Suspense>

        {/* Newsletter CTA (Uncomment if needed) */}
        <div className="mt-16 bg-linear-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
            Get the latest baby product reviews and parenting tips delivered to
            your inbox
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </div>

      {/* Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "MishBabyGuide Blog",
            description:
              "Expert advice, buying guides, and helpful tips for parents",
            url: "https://www.mishbabyguide.com/blog",
            publisher: {
              "@type": "Organization",
              name: "MishBabyGuide",
              logo: {
                "@type": "ImageObject",
                url: "https://www.mishbabyguide.com/logo.png",
              },
            },
          }),
        }}
      />
    </div>
  );
}

// Cache for 5 minutes (blog updates frequently)
export const revalidate = 300;
