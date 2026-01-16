/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink, Check, X, ShoppingCart } from "lucide-react";
import { PortableText } from "@portabletext/react";

import {
  getProductBySlug,
  getProductReviews,
  isProductReview,
} from "@/lib/sanity.client";
import { getImageUrl, getProductCardImage } from "@/lib/sanity.image";
import { portableTextComponents } from "@/components/PortableTextComponents";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import { cleanProductTitle } from "@/lib/helper";

// Generate static params
export async function generateStaticParams() {
  const products = await getProductReviews();

  return products.map((product) => ({
    slug: product.slug.current,
  }));
}

// Generate metadata
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
    };
  }

  const title =
    product.seo?.metaTitle || `${product.title} Review | MishBabyGuide`;
  const description = product.seo?.metaDescription || product.excerpt;
  const imageUrl = product.mainImage
    ? getProductCardImage(product.mainImage)
    : "";

  return {
    title,
    description,
    keywords: product.seo?.keywords?.join(", "),
    openGraph: {
      title,
      description,
      type: "article",
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
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
      alt: product.title,
    })) || []),
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="hidden sm:block">
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
            <div>
              <ImageGallery images={galleryImages} />
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {product.title}
              </h1>

              {product.excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.excerpt}
                </p>
              )}

              <Link
                href={product.amazonLink}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-cyan-600 dark:bg-cyan-500 text-white font-bold text-lg rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all shadow-lg hover:shadow-xl"
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
                <div className="bg-green-50 dark:bg-green-900 rounded-2xl p-6 border border-green-200 dark:border-green-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
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
                <div className="bg-red-50 dark:bg-red-900 rounded-2xl p-6 border border-red-200 dark:border-red-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <X className="h-6 w-6 text-red-600 dark:text-red-400" />
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
            <div className="prose prose-lg max-w-none mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Detailed Review
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                <PortableText
                  value={product.review as any}
                  components={portableTextComponents}
                />
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="bg-linear-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 text-center text-white mb-12">
            <h3 className="text-2xl font-bold mb-2">Ready to Buy?</h3>
            <p className="text-cyan-100 dark:text-cyan-200 mb-6">
              Get the {cleanProductTitle(product.title)} on Amazon
            </p>
            <Link
              href={product.amazonLink}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-cyan-600 font-bold text-lg rounded-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition-all shadow-lg"
            >
              <ShoppingCart className="h-6 w-6" />
              Buy on Amazon
              <ExternalLink className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            itemReviewed: {
              "@type": "Product",
              name: product.title,
              image: galleryImages.map((img) => img.url),
              description: product.excerpt,
            },
            author: {
              "@type": "Organization",
              name: "MishBabyGuide",
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: 5,
              bestRating: 5,
            },
          }),
        }}
      />
    </>
  );
}

export const revalidate = 3600;
