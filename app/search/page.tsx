import { Metadata } from "next";
import { BookOpen, Package, Search, Sparkles } from "lucide-react";

import { searchProducts, getAllPosts } from "@/lib/sanity.client";
import { getBlogCardImage } from "@/lib/sanity.image";
import {
  getProductDisplayImage,
  getProductDisplayLink,
} from "@/lib/product-display";
import { savedProductFromProduct } from "@/lib/saved-products";
import ProductCard from "@/components/ProductCard";
import BlogCard from "@/components/BlogCard";
import SearchComponent from "@/components/Search";

export const metadata: Metadata = {
  title: "Search Results | MishBabyGuide",
  description: "Search our baby products and articles",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";

  if (!query) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-10">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300">
              <Search className="h-7 w-7" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-950 dark:text-white">
              Search Products & Articles
            </h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Find baby products and helpful articles
            </p>
            <div className="mx-auto max-w-xl">
              <SearchComponent />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [products, posts] = await Promise.all([
    searchProducts(query),
    getAllPosts(),
  ]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = products.length + filteredPosts.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700 dark:border-cyan-900/70 dark:bg-cyan-950/50 dark:text-cyan-300">
                <Sparkles className="h-4 w-4" />
                {totalResults} {totalResults === 1 ? "result" : "results"} found
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                Search results for &quot;{query}&quot;
              </h1>
              <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
                Browse matching products and articles from MishBabyGuide.
              </p>
            </div>
            <div className="flex gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              <span className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                {products.length} products
              </span>
              <span className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                {filteredPosts.length} articles
              </span>
            </div>
          </div>

          {/* <div className="max-w-2xl">
            <SearchComponent />
          </div> */}
        </div>

        {totalResults === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Search className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-500" />
            <h3 className="mb-2 text-xl font-bold text-gray-950 dark:text-white">
              No Results Found
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              We couldn&apos;t find anything matching &quot;{query}&quot;. Try
              different keywords.
            </p>

            <div className="space-y-4">
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Suggestions:
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>Check your spelling</li>
                  <li>Try more general keywords</li>
                  <li>Try different keywords</li>
                </ul>
              </div>

              {/* <div className="mt-8">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Popular searches:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "baby stroller",
                    "car seat",
                    "baby monitor",
                    "high chair",
                  ].map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm hover:border-cyan-600 dark:hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {products.length > 0 && (
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300">
                    <Package className="h-5 w-5" />
                  </span>
                  <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                    Products ({products.length})
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      title={product.title}
                      slug={product.slug.current}
                      image={getProductDisplayImage(product)}
                      excerpt={product.excerpt}
                      amazonLink={getProductDisplayLink(product)}
                      category={product.category?.title}
                      savedProduct={savedProductFromProduct(
                        product,
                        `/products/${product.slug.current}`,
                      )}
                    />
                  ))}
                </div>
              </section>
            )}

            {filteredPosts.length > 0 && (
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                    Articles ({filteredPosts.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredPosts.map((post) => (
                    <BlogCard
                      key={post._id}
                      title={post.title}
                      slug={post.slug.current}
                      mainImage={
                        post.mainImage
                          ? getBlogCardImage(post.mainImage)
                          : undefined
                      }
                      excerpt={post.excerpt || ""}
                      publishedAt={post.publishedAt}
                      author={post.author}
                      category={post.categories?.[0]?.title}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const revalidate = 3600;
