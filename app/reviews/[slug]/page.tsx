/* eslint-disable @typescript-eslint/no-explicit-any */
// app/reviews/[slug]/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExternalLink, Check, X, ShoppingCart } from "lucide-react";
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
import { portableTextComponents } from "@/components/PortableTextComponents";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import RelatedProducts from "@/components/RelatedProducts";
import { cleanProductTitle } from "@/lib/helper";

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
      <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-12">
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
    reviewRating: {
      "@type": "Rating",
      ratingValue:
        product.pros && product.cons
          ? Math.min(5, Math.max(1, 5 - product.cons.length * 0.5))
          : 4.5,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: product.excerpt,
    datePublished: product.publishedAt,
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="hidden sm:block mb-6">
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

          {/* Product Header */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Left: Image Gallery - Sticky on desktop */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <ImageGallery images={galleryImages} />
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Category Badge */}
              {product.category && (
                <Link
                  href={`/reviews?category=${product.category.slug.current}`}
                  className="inline-block px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 text-sm font-medium rounded-full hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors"
                >
                  {product.category.title}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {product.title}
              </h1>

              {product.excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.excerpt}
                </p>
              )}

              {/* Buy Button */}
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

          {/* Pros & Cons */}
          {(product.pros?.length || product.cons?.length) && (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {product.pros && product.pros.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    Pros
                  </h3>
                  <ul className="space-y-3">
                    {product.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {pro}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.cons && product.cons.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-600 dark:bg-red-500 rounded-full flex items-center justify-center">
                      <X className="h-5 w-5 text-white" />
                    </div>
                    Cons
                  </h3>
                  <ul className="space-y-3">
                    {product.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <X className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {con}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Full Review Content */}
          {product.review && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Detailed Review
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                <PortableText
                  value={product.review as any}
                  components={portableTextComponents}
                />
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

        {/* Related Products with Suspense */}
        {product.category?._id && (
          <Suspense fallback={<RelatedProductsSkeleton />}>
            <RelatedReviewsSection
              categoryId={product.category._id}
              productId={product._id}
            />
          </Suspense>
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
