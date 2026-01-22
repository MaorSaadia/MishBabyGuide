/* eslint-disable @typescript-eslint/no-explicit-any */
// app/products/[slug]/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { PortableText } from "@portabletext/react";

import {
  getProductBySlug,
  getRelatedProducts,
  getAllProducts,
  isProductRecommendation,
} from "@/lib/sanity.client";
import { getImageUrl } from "@/lib/sanity.image";
import {
  generateProductMetadata,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/metadata";
import { portableTextComponents } from "@/components/PortableTextComponents";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import RelatedProducts from "@/components/RelatedProducts";
import StickyBuyFooter from "@/components/StickyBuyFooter";
import { cleanProductTitle } from "@/lib/helper";
import ProductShareButton from "@/components/ProductShareButton";

// Generate static params for all products at build time
export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map((product) => ({
    slug: product.slug.current,
  }));
}

// Generate metadata for SEO using our helper
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for could not be found.",
    };
  }

  // Use our centralized metadata helper
  return generateProductMetadata(product);
}

// Loading skeleton for related products
function RelatedProductsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-80 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

// Separate component for related products to enable Suspense
async function RelatedProductsSection({
  categoryId,
  productId,
}: {
  categoryId: string;
  productId: string;
}) {
  const relatedProducts = await getRelatedProducts(categoryId, productId);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-12">
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}`;

  if (!product) {
    notFound();
  }

  // Check product type
  const isRecommendation = isProductRecommendation(product);

  // Prepare images for gallery
  let galleryImages: { url: string; alt: string }[] = [];
  galleryImages = [
    {
      url: product.mainImage
        ? getImageUrl(product.mainImage, 800)
        : "/placeholder-product.jpg",
      alt: product.title,
    },
  ];

  // Generate structured data
  const productJsonLd = generateProductJsonLd(product);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://www.mishbabyguide.com" },
    { name: "Products", url: "https://www.mishbabyguide.com/products" },
    ...(product.category
      ? [
          {
            name: product.category.title,
            url: `https://www.mishbabyguide.com/products/category/${product.category.slug.current}`,
          },
        ]
      : []),
    {
      name: product.title,
      url: `https://www.mishbabyguide.com/products/${product.slug.current}`,
    },
  ]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="hidden sm:block mb-6">
            <Breadcrumb
              items={[
                { label: "Products", href: "/products" },
                ...(product.category
                  ? [
                      {
                        label: product.category.title,
                        href: `/category/${product.category.slug.current}`,
                      },
                    ]
                  : []),
                { label: product.title },
              ]}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* LEFT: Images */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <ImageGallery images={galleryImages} />
            </div>

            {/* RIGHT: Product Info */}
            <div className="space-y-2">
              {/* Product Info */}
              <div className="space-y-2">
                {/* Category Badge & Share Button Row */}
                <div className="flex items-center justify-between -mt-4">
                  {product.category && (
                    <Link href={`/category/${product.category.slug.current}`}>
                      <span className="inline-block mb-4 px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-sm font-medium rounded-full hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors">
                        {product.category.title}
                      </span>
                    </Link>
                  )}

                  {/* Share Button - Right aligned */}
                  <ProductShareButton
                    url={currentUrl}
                    title={product.title}
                    description={product.excerpt}
                  />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.title}
                </h1>
                {product.excerpt && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {product.excerpt}
                  </p>
                )}
              </div>

              {/* Description for Recommendations */}
              {isRecommendation &&
                product.description &&
                product.description.length > 0 && (
                  <div className="prose prose-lg max-w-none bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <PortableText
                      value={product.description as any}
                      components={portableTextComponents}
                    />
                  </div>
                )}

              {/* Call to Action */}
              <div className="bg-linear-to-br from-cyan-600 to-cyan-700 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-1">Ready to Buy?</h3>
                <p className="text-cyan-50 mb-4">
                  Get the {cleanProductTitle(product.title)} on Amazon
                </p>
                <Link
                  href={product.amazonLink}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-3 bg-white text-cyan-600 text-lg font-bold rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-xl w-full justify-center"
                  aria-label={`Buy ${product.title} on Amazon`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy on Amazon
                  <ExternalLink className="h-5 w-5" />
                </Link>
                <p className="text-xs text-cyan-100 mt-3 text-center">
                  As an Amazon Associate, we earn from qualifying purchases
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products with Suspense */}
        {product.category?._id && (
          <Suspense fallback={<RelatedProductsSkeleton />}>
            <RelatedProductsSection
              categoryId={product.category._id}
              productId={product._id}
            />
          </Suspense>
        )}
      </div>

      {/* Sticky Buy Footer */}
      <StickyBuyFooter
        amazonLink={product.amazonLink}
        productTitle={product.title}
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
    </>
  );
}

// Cache individual product pages for 1 hour
export const revalidate = 3600;

// Enable dynamic params for products not pre-rendered
export const dynamicParams = true;
