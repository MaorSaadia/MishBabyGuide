// app/category/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Tag, Package } from "lucide-react";
import Link from "next/link";

import {
  getCategoryBySlug,
  getProductsByCategory,
  getAllCategories,
  getProductCategoryBySlug,
} from "@/lib/sanity.client";
import {
  generateCategoryMetadata,
  generateBreadcrumbJsonLd,
} from "@/lib/metadata";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";

// Generate static params for all categories at build time
export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map((category) => ({
    slug: category.slug.current,
  }));
}

// Generate metadata for SEO using centralized helper
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The category you're looking for could not be found.",
    };
  }

  // Use centralized metadata helper
  return generateCategoryMetadata(category);
}

// Loading skeleton for product grid
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-80 animate-pulse"
        />
      ))}
    </div>
  );
}

// Separate component for products to enable Suspense
async function CategoryProducts({ slug }: { slug: string }) {
  const products = await getProductsByCategory(slug);

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl">
        <Package className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No Products Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We&apos;re working on adding products to this category.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Product Count */}
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-900 dark:text-white">
            {products.length}
          </span>{" "}
          {products.length === 1 ? "product" : "products"} in this category
        </p>
      </div>

      {/* Products Grid */}
      <ProductGrid products={products} />

      {/* Bottom CTA */}
      {products.length >= 3 && (
        <div className="mt-16 bg-linear-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 border border-cyan-100 dark:border-cyan-800">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Check out our comprehensive buying guides and reviews to make the
              best decision for your little one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all shadow-md hover:shadow-lg"
              >
                View Full Reviews
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border-2 border-cyan-600 dark:border-cyan-400"
              >
                Read Buying Guides
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch category data (cached)
  const category = await getProductCategoryBySlug(slug);

  // Handle 404
  if (!category) {
    notFound();
  }

  // Generate breadcrumb structured data
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://www.mishbabyguide.com" },
    { name: "Products", url: "https://www.mishbabyguide.com/products" },
    {
      name: category.title,
      url: `https://www.mishbabyguide.com/category/${category.slug.current}`,
    },
  ]);

  // Generate category collection schema
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description:
      category.description ||
      `Browse ${category.title.toLowerCase()} products for your baby`,
    url: `https://www.mishbabyguide.com/category/${category.slug.current}`,
    breadcrumb: breadcrumbJsonLd,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Products", href: "/products" },
              { label: category.title },
            ]}
          />
        </div>

        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-6">
            {category.icon && (
              <div className="shrink-0 w-16 h-16 bg-cyan-50 dark:bg-cyan-900 rounded-xl flex items-center justify-center shadow-sm">
                <span
                  className="text-3xl"
                  role="img"
                  aria-label="Category icon"
                >
                  {category.icon}
                </span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Tag className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                  Category
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {category.title}
              </h1>
              {category.description && (
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Products Content with Suspense */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <CategoryProducts slug={slug} />
        </Suspense>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
    </div>
  );
}

// Cache category pages for 1 hour
export const revalidate = 3600;

// Enable dynamic params for new categories
export const dynamicParams = true;
