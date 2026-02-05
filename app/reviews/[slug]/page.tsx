/* eslint-disable @typescript-eslint/no-explicit-any */
// app/reviews/[slug]/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExternalLink, Check, X, ShoppingCart, Package } from "lucide-react";
import { PortableText } from "@portabletext/react";

import {
  getProductBySlug,
  getProductReviews,
  getRelatedProducts,
  isProductReview,
} from "@/lib/sanity.client";
import { getImageUrl } from "@/lib/sanity.image";
import {
  generateProductMetadata,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/metadata";
import { cleanProductTitle } from "@/lib/helper";
import { portableTextComponents } from "@/components/PortableTextComponents";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import RelatedProducts from "@/components/RelatedProducts";

// Generate static params for all reviews at build time
export async function generateStaticParams() {
  const products = await getProductReviews();

  return products.map((product) => ({
    slug: product.slug.current,
  }));
}

// Generate metadata for SEO using centralized helper
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !isProductReview(product)) {
    return {
      title: "Review Not Found",
      description: "The product review you're looking for could not be found.",
    };
  }

  // Use centralized metadata helper
  return generateProductMetadata(product);
}

// Loading skeleton for related products
function RelatedProductsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-8 bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-3xl h-80 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

// Separate component for related products
async function RelatedReviewsSection({
  categoryId,
  productId,
}: {
  categoryId: string;
  productId: string;
}) {
  const relatedProducts = await getRelatedProducts(categoryId, productId);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !isProductReview(product)) {
    notFound();
  }

  // Prepare gallery images
  const galleryImages = [
    {
      url: product.mainImage
        ? getImageUrl(product.mainImage, 800)
        : "/placeholder-product.jpg",
      alt: product.title,
    },
    ...(product.gallery?.map((img) => ({
      url: getImageUrl(img, 800),
      alt: `${product.title} - Gallery image`,
    })) || []),
  ];

  // Generate structured data
  const productJsonLd = generateProductJsonLd(product);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://www.mishbabyguide.com" },
    { name: "Reviews", url: "https://www.mishbabyguide.com/reviews" },
    ...(product.category
      ? [
          {
            name: product.category.title,
            url: `https://www.mishbabyguide.com/reviews?category=${product.category.slug.current}`,
          },
        ]
      : []),
    {
      name: product.title,
      url: `https://www.mishbabyguide.com/reviews/${product.slug.current}`,
    },
  ]);

  // Enhanced review schema with rating
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: product.title,
      image: galleryImages.map((img) => img.url),
      description: product.excerpt,
      offers: {
        "@type": "Offer",
        url: product.amazonLink,
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
      },
    },
    author: {
      "@type": "Organization",
      name: "MishBabyGuide",
    },
    reviewBody: product.excerpt,
    datePublished: product.publishedAt,
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          {/* Breadcrumb with enhanced styling */}
          <div className="hidden sm:block mb-8">
            <Breadcrumb
              items={[
                { label: "Reviews", href: "/reviews" },
                ...(product.category
                  ? [
                      {
                        label: product.category.title,
                        href: `/reviews?category=${product.category.slug.current}`,
                      },
                    ]
                  : []),
                { label: product.title },
              ]}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Left: Image Gallery - Sticky on desktop */}
            <div className="lg:sticky lg:top-8 lg:self-start w-full max-w-full overflow-hidden">
              <ImageGallery images={galleryImages} />
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6 w-full">
              {/* Category Badge with animation */}
              {product.category && (
                <div className="animate-[fadeIn_0.5s_ease-out]">
                  <Link
                    href={`/reviews?category=${product.category.slug.current}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-50 to-sky-50 dark:from-cyan-950/50 dark:to-sky-950/50 text-cyan-700 dark:text-cyan-300 text-sm font-semibold rounded-full border border-cyan-200 dark:border-cyan-800 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Package className="w-4 h-4" />
                    {product.category.title}
                  </Link>
                </div>
              )}

              {/* Title with gradient */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent leading-tight animate-[fadeIn_0.6s_ease-out]">
                {product.title}
              </h1>

              {/* Excerpt */}
              {product.excerpt && (
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed animate-[fadeIn_0.8s_ease-out]">
                  {product.excerpt}
                </p>
              )}

              {/* Primary CTA */}
              <div className="space-y-4 animate-[fadeIn_1s_ease-out]">
                <Link
                  href={product.amazonLink}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-cyan-600 dark:bg-cyan-500 text-white font-bold text-lg rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all shadow-lg hover:shadow-xl"
                  aria-label={`Buy ${product.title} on Amazon`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  View on Amazon
                  <ExternalLink className="h-5 w-5" />
                </Link>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  As an Amazon Associate, we earn from qualifying purchases
                </p>
              </div>
            </div>
          </div>

          {/* Pros & Cons with enhanced design */}
          {(product.pros?.length || product.cons?.length) && (
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {product.pros && product.pros.length > 0 && (
                <div className="group relative bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-3xl p-8 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-linear-to-br from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Check className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        What We Love
                      </h3>
                    </div>
                    <ul className="space-y-4">
                      {product.pros.map((pro, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-4 group/item"
                        >
                          <div className="shrink-0 w-6 h-6 mt-0.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                            <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                          </div>
                          <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                            {pro}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {product.cons && product.cons.length > 0 && (
                <div className="group relative bg-linear-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30 rounded-3xl p-8 border-2 border-rose-200 dark:border-rose-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 dark:bg-rose-400/5 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-linear-to-br from-rose-600 to-red-600 dark:from-rose-500 dark:to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <X className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Consider This
                      </h3>
                    </div>
                    <ul className="space-y-4">
                      {product.cons.map((con, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-4 group/item"
                        >
                          <div className="shrink-0 w-6 h-6 mt-0.5 bg-rose-100 dark:bg-rose-900/50 rounded-lg flex items-center justify-center">
                            <X className="h-4 w-4 text-rose-700 dark:text-rose-400" />
                          </div>
                          <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                            {con}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Review Content - Magazine style */}
          {product.review && (
            <div className="mb-16">
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-3">
                  Our In-Depth Review
                </h2>
                <div className="w-24 h-1.5 bg-linear-to-r from-cyan-600 to-sky-600 rounded-full" />
              </div>
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -left-4 top-0 w-1 h-full bg-linear-to-b from-cyan-500/50 via-sky-500/50 to-purple-500/50 rounded-full hidden lg:block" />

                <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-4 md:p-8 border border-gray-200 dark:border-gray-800 shadow-2xl">
                  <PortableText
                    value={product.review as any}
                    components={portableTextComponents}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="bg-linear-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 text-center text-white mb-12 shadow-xl">
            <h3 className="text-2xl font-bold mb-2">Ready to Buy?</h3>
            <p className="text-cyan-100 mb-6">
              Get the {cleanProductTitle(product.title)} on Amazon
            </p>
            <Link
              href={product.amazonLink}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-cyan-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              aria-label={`Buy ${product.title} on Amazon`}
            >
              <ShoppingCart className="h-6 w-6" />
              Buy on Amazon
              <ExternalLink className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Related Products with enhanced styling */}
        {product.category?._id && (
          <div className="bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950 py-16 border-t border-gray-200 dark:border-gray-800">
            <Suspense fallback={<RelatedProductsSkeleton />}>
              <RelatedReviewsSection
                categoryId={product.category._id}
                productId={product._id}
              />
            </Suspense>
          </div>
        )}
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewSchema),
        }}
      />
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

// Cache review pages for 1 hour
export const revalidate = 3600;

// Enable dynamic params for new reviews
export const dynamicParams = true;
