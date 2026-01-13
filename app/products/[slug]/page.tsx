/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { PortableText } from "@portabletext/react";

import {
  getProductBySlug,
  getRelatedProducts,
  getAllProducts,
  isProductReview,
  isProductRecommendation,
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

  const title = product.seo?.metaTitle || `${product.title} | MishBabyGuide`;
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

  // Check product type
  const isReview = isProductReview(product);
  const isRecommendation = isProductRecommendation(product);

  // Prepare images
  let galleryImages: { url: string; alt: string }[] = [];

  if (isReview && product.gallery) {
    galleryImages = [
      {
        url: product.mainImage
          ? getImageUrl(product.mainImage, 800)
          : "/placeholder-product.jpg",
        alt: product.title,
      },
      ...product.gallery.map((img) => ({
        url: getImageUrl(img, 800),
        alt: product.title,
      })),
    ];
  } else {
    galleryImages = [
      {
        url: product.mainImage
          ? getImageUrl(product.mainImage, 800)
          : "/placeholder-product.jpg",
        alt: product.title,
      },
    ];
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-32">
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

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* LEFT: Images */}
            <div>
              <ImageGallery images={galleryImages} />
            </div>

            {/* RIGHT: Product Info */}
            <div className="space-y-6">
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

              {isRecommendation &&
                product.description &&
                product.description.length > 0 && (
                  <div className="prose prose-lg max-w-none bg-white rounded-xl p-6 py-1 border border-gray-200">
                    <PortableText
                      value={product.description as any}
                      components={portableTextComponents}
                    />
                  </div>
                )}

              <div className="bg-linear-to-br from-cyan-600 to-cyan-700 rounded-2xl p-6 text-white shadow-xl -mb-12">
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
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-12">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>

      {/* Sticky Buy Footer */}
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
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "Amazon",
              },
            },
          }),
        }}
      />
    </>
  );
}

export const revalidate = 3600;
