import { Metadata } from "next";
import { getAllPosts, getAllCategories } from "@/lib/sanity.client";
import BlogCard from "@/components/BlogCard";
import { getBlogCardImage } from "@/lib/sanity.image";
import { BookOpen, Filter } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - Baby Product Reviews & Guides | MishBabyGuide",
  description:
    "Expert advice, buying guides, and helpful tips for parents. Read our latest articles on baby products, parenting tips, and product reviews.",
  openGraph: {
    title: "Blog - MishBabyGuide",
    description: "Expert advice and buying guides for parents",
    type: "website",
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;

  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  // Filter posts by category if selected
  const filteredPosts = selectedCategory
    ? posts.filter((post) =>
        post.categories?.some((cat) => cat.slug.current === selectedCategory)
      )
    : posts;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full mb-4">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-semibold">Our Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Articles & Guides
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert advice, honest reviews, and helpful guides to make parenting
            easier
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Filter by category:
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <a
                  key={category.slug.current}
                  href={`/blog?category=${category.slug.current}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.slug.current
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Posts Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">
              {filteredPosts.length}
            </span>{" "}
            {filteredPosts.length === 1 ? "article" : "articles"} found
            {selectedCategory && (
              <>
                {" "}
                in{" "}
                <span className="font-semibold text-cyan-600">
                  {
                    categories.find(
                      (cat) => cat.slug.current === selectedCategory
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
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Articles Found
            </h3>
            <p className="text-gray-600 mb-6">
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

        {/* Newsletter CTA */}
        <div className="mt-16 bg-linear-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
            Get the latest baby product reviews and parenting tips delivered to
            your inbox
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Subscribe to Newsletter
          </a>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;
