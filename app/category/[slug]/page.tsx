import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag } from "lucide-react";

import {
  getCategoryBySlug,
  getProductsByCategory,
  getAllCategories,
  getProductCategoryBySlug,
} from "@/lib/sanity.client";
import { generateItemListSchema, renderJsonLd } from "@/lib/structuredData";
import { getProductCardImage } from "@/lib/sanity.image";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";

// Generate static params for all categories (for static generation)
export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map((category) => ({
    slug: category.slug.current,
  }));
}

// Generate metadata for SEO
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
    };
  }

  return {
    title: `${category.title} - Best Baby Products | MishBabyGuide`,
    description:
      category.description ||
      `Browse our selection of ${category.title.toLowerCase()} products. Expert reviews and buying guides to help you choose the best for your baby.`,
    openGraph: {
      title: `${category.title} - MishBabyGuide`,
      description:
        category.description ||
        `Best ${category.title.toLowerCase()} products for your baby`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch category and products
  const [category, products] = await Promise.all([
    getProductCategoryBySlug(slug),
    getProductsByCategory(slug),
  ]);

  // Handle 404
  if (!category) {
    notFound();
  }

  const categorySchema = generateItemListSchema(
    category.title,
    products.map((product) => ({
      name: product.title,
      url: `/products/${product.slug.current}`,
      image: product.mainImage
        ? getProductCardImage(product.mainImage)
        : undefined,
    }))
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: category.title },
          ]}
        />

        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            {category.icon && (
              <div className="shrink-0 w-16 h-16 bg-cyan-50 rounded-xl flex items-center justify-center">
                <span className="text-3xl">{category.icon}</span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Tag className="h-5 w-5 text-cyan-600" />
                <span className="text-sm font-medium text-cyan-600 uppercase tracking-wide">
                  Category
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {category.title}
              </h1>
              {category.description && (
                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          {/* Product Count */}
          <div className="flex items-center gap-2 text-sm text-gray-500 -mt-4 -mb-6">
            <span className="font-medium text-gray-900">{products.length}</span>
            <span>{products.length === 1 ? "product" : "products"} found</span>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} />

        {/* Bottom CTA */}
        {/* {products.length > 0 && (
          <div className="mt-16 text-center bg-linear-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Check out our comprehensive buying guides to make the best
              decision for your little one.
            </p>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all shadow-md hover:shadow-lg"
            >
              View Buying Guides
            </Link>
          </div>
        )} */}
      </div>

      {/* Schema.org Structured Data for Category */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJsonLd(categorySchema)}
      />
    </div>
  );
}

// Optional: Add revalidation for ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour
