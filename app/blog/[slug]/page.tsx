/* eslint-disable @typescript-eslint/no-explicit-any */
// app/blog/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Calendar, Clock, User, Tag } from "lucide-react";
import { PortableText } from "@portabletext/react";

import { getPostBySlug, getAllPosts } from "@/lib/sanity.client";
import { getImageUrl, getProductCardImage } from "@/lib/sanity.image";
import {
  generatePostMetadata,
  generateBlogPostJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/metadata";
import { portableTextComponents } from "@/components/PortableTextComponents";
import ShareButtons from "@/components/ShareButtons";
import ProductCard from "@/components/ProductCard";

// Generate static params for all posts at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

// Generate metadata for SEO using our helper
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The blog post you're looking for could not be found.",
    };
  }

  // Use our centralized metadata helper
  return generatePostMetadata(post);
}

// Loading skeleton for related products
function RelatedProductsSkeleton() {
  return (
    <div className="bg-linear-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Products Mentioned in This Article
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-80 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Separate component for related products to enable Suspense
function RelatedProductsSection({
  products,
}: {
  products: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    mainImage?: any;
    excerpt?: string;
    amazonLink: string;
  }>;
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-linear-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Products Mentioned in This Article
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Shop the products we recommend
          </p>
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
              excerpt={product.excerpt || "Check out this product"}
              amazonLink={product.amazonLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = post.body
    ? JSON.stringify(post.body).split(/\s+/).length
    : 0;
  const readTime = Math.ceil(wordCount / 200);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`;

  // Generate structured data
  const postJsonLd = generateBlogPostJsonLd(post);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://www.mishbabyguide.com" },
    { name: "Blog", url: "https://www.mishbabyguide.com/blog" },
    ...(post.categories?.[0]
      ? [
          {
            name: post.categories[0].title,
            url: `https://www.mishbabyguide.com/blog?category=${post.categories[0].slug.current}`,
          },
        ]
      : []),
    {
      name: post.title,
      url: currentUrl,
    },
  ]);

  return (
    <>
      <article className="min-h-screen bg-white dark:bg-gray-900">
        {/* Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <header className="mb-8">
            {/* Category Badges */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category) => (
                  <Link
                    key={category.slug.current}
                    href={`/blog?category=${category.slug.current}`}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-full text-sm font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
                  >
                    <Tag className="h-3 w-3" />
                    {category.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {post.author}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>

              {readTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readTime} min read</span>
                </div>
              )}
            </div>

            {/* Share Buttons */}
            <div className="py-4 border-y border-gray-200 dark:border-gray-700">
              <ShareButtons
                url={currentUrl}
                title={post.title}
                description={post.excerpt}
              />
            </div>
          </header>

          {/* Featured Image */}
          {post.mainImage && (
            <figure className="mb-12 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative w-full aspect-video">
                <Image
                  src={getImageUrl(post.mainImage, 1200, 675)}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            </figure>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border-l-4 border-cyan-600 dark:border-cyan-400">
              {post.excerpt}
            </div>
          )}

          {/* Post Content */}
          {post.body && (
            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <PortableText
                value={post.body as any}
                components={portableTextComponents}
              />
            </div>
          )}

          {/* Bottom Share */}
          <div className="py-8 border-y border-gray-200 dark:border-gray-700 mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Found this helpful? Share it!
              </p>
              <ShareButtons
                url={currentUrl}
                title={post.title}
                description={post.excerpt}
              />
            </div>
          </div>

          {/* Author Bio */}
          {post.author && (
            <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-16 h-16 bg-cyan-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    About {post.author}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Part of the MishBabyGuide team, dedicated to helping parents
                    make informed decisions about baby products.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section with Suspense */}
        {Array.isArray(post.relatedProducts) &&
          post.relatedProducts.length > 0 && (
            <Suspense fallback={<RelatedProductsSkeleton />}>
              <RelatedProductsSection products={post.relatedProducts} />
            </Suspense>
          )}
      </article>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(postJsonLd),
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

// Cache blog posts for 1 hour
export const revalidate = 3600;

// Enable dynamic params for new posts
export const dynamicParams = true;
