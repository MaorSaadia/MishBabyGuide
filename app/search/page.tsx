// app/search/page.tsx
import { Metadata } from "next";
import { searchProducts, getAllPosts } from "@/lib/sanity.client";
import ProductCard from "@/components/ProductCard";
import BlogCard from "@/components/BlogCard";
import { getProductCardImage, getBlogCardImage } from "@/lib/sanity.image";
import SearchComponent from "@/components/Search";
import { Search, Package, BookOpen } from "lucide-react";

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
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Search Products & Articles
            </h1>
            <p className="text-gray-600 mb-8">
              Find baby products and helpful articles
            </p>
            <div className="max-w-xl mx-auto">
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Results for &quot;{query}&quot;
          </h1>
          <p className="text-gray-600 mb-6">
            Found{" "}
            <span className="font-semibold text-gray-900">{totalResults}</span>{" "}
            results
          </p>

          <div className="max-w-2xl">
            <SearchComponent />
          </div>
        </div>

        {totalResults === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find anything matching &quot;{query}&quot;. Try
              different keywords.
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Suggestions:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Check your spelling</li>
                  <li>• Try more general keywords</li>
                  <li>• Try different keywords</li>
                </ul>
              </div>

              <div className="mt-8">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Popular searches:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "baby stroller",
                    "car seat",
                    "baby monitor",
                    "high chair",
                  ].map((term) => (
                    <a
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-cyan-600 hover:text-cyan-600 transition-colors"
                    >
                      {term}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {products.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Package className="h-6 w-6 text-cyan-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Products ({products.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      title={product.title}
                      slug={product.slug.current}
                      image={
                        product.mainImage
                          ? getProductCardImage(product.mainImage)
                          : "/placeholder-product.jpg"
                      }
                      price={product.price}
                      excerpt={product.excerpt}
                      amazonLink={product.amazonLink}
                      category={product.category?.title}
                      hasFullReview={product.hasFullReview}
                    />
                  ))}
                </div>
              </section>
            )}

            {filteredPosts.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-6 w-6 text-cyan-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Articles ({filteredPosts.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
