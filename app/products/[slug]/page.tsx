/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink, Check, X, ShoppingCart } from "lucide-react";
import { PortableText } from "@portabletext/react";

import {
  getProductBySlug,
  getRelatedProducts,
  getAllProducts,
} from "@/lib/sanity.client";
import { getImageUrl, getProductCardImage } from "@/lib/sanity.image";
import { portableTextComponents } from "@/components/PortableTextComponents";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import RelatedProducts from "@/components/RelatedProducts";
import StickyBuyFooter from "@/components/StickyBuyFooter";

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map((product) => ({
    slug: product.slug.current,
  }));
}

// Generate metadata for SEO
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
    };
  }

  const title =
    product.seo?.metaTitle || `${product.title} - Review | MishBabyGuide`;
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products
  const relatedProducts = product.category?._id
    ? await getRelatedProducts(String(product.category._id), product._id)
    : [];

  // Prepare images for gallery
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
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-32">
        {/* Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="hidden sm:block">
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

          {product.hasFullReview ? (
            // ==================== FULL REVIEW LAYOUT ====================
            <>
              {/* Product Header Section */}
              <div className="grid lg:grid-cols-2 gap-12 mb-12">
                {/* Left: Image Gallery */}
                <div>
                  <ImageGallery images={galleryImages} />
                </div>

                {/* Right: Product Info */}
                <div className="space-y-6">
                  {/* Product Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {product.title}
                  </h1>

                  {/* Excerpt */}
                  {product.excerpt && (
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {product.excerpt}
                    </p>
                  )}

                  {/* Primary CTA */}
                  <Link
                    href={product.amazonLink}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-cyan-600 text-white font-bold text-lg rounded-lg hover:bg-cyan-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    View on Amazon
                    <ExternalLink className="h-5 w-5" />
                  </Link>

                  {/* Secondary Info */}
                  <p className="text-sm text-gray-500 text-center">
                    As an Amazon Associate, we earn from qualifying purchases
                  </p>
                </div>
              </div>

              {/* Pros & Cons Section */}
              {(product.pros?.length || product.cons?.length) && (
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  {/* Pros */}
                  {product.pros && product.pros.length > 0 && (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Check className="h-6 w-6 text-green-600" />
                        Pros
                      </h3>
                      <ul className="space-y-3">
                        {product.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-gray-700">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cons */}
                  {product.cons && product.cons.length > 0 && (
                    <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <X className="h-6 w-6 text-red-600" />
                        Cons
                      </h3>
                      <ul className="space-y-3">
                        {product.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <X className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                            <span className="text-gray-700">{con}</span>
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Detailed Review
                  </h2>
                  <div className="bg-white rounded-2xl p-8 border border-gray-100">
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
                <p className="text-cyan-100 mb-6">
                  Get the {product.title} on Amazon{" "}
                  {product.price && `for ${product.price}`}
                </p>
                <Link
                  href={product.amazonLink}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-cyan-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  <ShoppingCart className="h-6 w-6" />
                  Buy on Amazon
                  <ExternalLink className="h-5 w-5" />
                </Link>
              </div>
            </>
          ) : (
            // ==================== SHORT PRODUCT PAGE ====================
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              {/* Left: Image Gallery */}
              <div>
                <ImageGallery images={galleryImages} />
              </div>

              {/* RIGHT: Product Info Section */}
              <div className="space-y-6">
                {/* Title & Excerpt */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 -mt-6 lg:mt-0">
                    {product.title}
                  </h1>
                  {product.excerpt && (
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {product.excerpt}
                    </p>
                  )}
                </div>

                {/* Product Description */}
                {product.shortDescription &&
                product.shortDescription.length > 0 ? (
                  <div className="prose prose-lg max-w-none bg-white rounded-xl p-6 py-1 border border-gray-200">
                    <PortableText
                      value={product.shortDescription as any}
                      components={portableTextComponents}
                    />
                  </div>
                ) : null}
                <div className="bg-linear-to-br from-cyan-600 to-cyan-700 rounded-2xl p-6 text-white shadow-xl -mb-12 ">
                  <h3 className="text-2xl font-bold mb-1">Ready to Buy?</h3>
                  <p className="text-cyan-50 mb-4">
                    Get the {product.title} on Amazon
                  </p>
                  <Link
                    href={product.amazonLink}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-3 bg-white text-cyan-600 text-lg font-bold rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-xl w-full justify-center"
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
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-12">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>

      {/* Sticky Buy Footer - NEW! */}
      <StickyBuyFooter
        amazonLink={product.amazonLink}
        productTitle={product.title}
      />

      {/* Product Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: galleryImages.map((img) => img.url),
            description: product.excerpt,
            brand: {
              "@type": "Brand",
              name: "Various",
            },
            offers: {
              "@type": "Offer",
              url: product.amazonLink,
              priceCurrency: "USD",
              price: product.price?.replace(/[^0-9.]/g, ""),
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "Amazon",
              },
            },
            ...(product.rating && {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                bestRating: 5,
                worstRating: 1,
              },
            }),
            review: {
              "@type": "Review",
              reviewRating: {
                "@type": "Rating",
                ratingValue: product.rating || 5,
              },
              author: {
                "@type": "Organization",
                name: "MishBabyGuide",
              },
            },
          }),
        }}
      />
    </>
  );
}

export const revalidate = 3600; // Revalidate every hour
