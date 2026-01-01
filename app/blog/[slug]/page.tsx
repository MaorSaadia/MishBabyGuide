import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getPostBySlug, getAllPosts } from "@/lib/sanity.client";
import {
  getImageUrl,
  getBlogCardImage,
  getProductCardImage,
} from "@/lib/sanity.image";
import Breadcrumb from "@/components/Breadcrumb";
import ShareButtons from "@/components/ShareButtons";
import ProductCard from "@/components/ProductCard";
import { portableTextComponents } from "@/components/PortableTextComponents";
import { Calendar, Clock, User, Tag } from "lucide-react";

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

// Generate metadata for SEO
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
    };
  }

  const title = post.seo?.metaTitle || `${post.title} | MishBabyGuide`;
  const description = post.seo?.metaDescription || post.excerpt;
  const imageUrl = post.mainImage ? getBlogCardImage(post.mainImage) : "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
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

  return (
    <>
      <article className="min-h-screen bg-white">
        {/* Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
          />

          {/* Hero Section */}
          <header className="mb-8">
            {/* Category Badges */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category) => (
                  <a
                    key={category.slug.current}
                    href={`/blog?category=${category.slug.current}`}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-sm font-medium hover:bg-cyan-100 transition-colors"
                  >
                    <Tag className="h-3 w-3" />
                    {category.title}
                  </a>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-gray-900">
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

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readTime} min read</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="py-4 border-y border-gray-200">
              <ShareButtons
                url={currentUrl}
                title={post.title}
                description={post.excerpt}
              />
            </div>
          </header>

          {/* Featured Image */}
          {post.mainImage && (
            <figure className="mb-12 rounded-2xl overflow-hidden">
              <div className="relative w-full aspect-video">
                <Image
                  src={getImageUrl(post.mainImage, 1200, 675)}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </figure>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="text-xl text-gray-600 leading-relaxed mb-8 p-6 bg-gray-50 rounded-2xl border-l-4 border-cyan-600">
              {post.excerpt}
            </div>
          )}

          {/* Post Content */}
          {post.body && (
            <div className="prose prose-lg max-w-none mb-12">
              <PortableText
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={post.body as any}
                components={portableTextComponents}
              />
            </div>
          )}

          {/* Bottom Share */}
          <div className="py-8 border-y border-gray-200 mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-600">Found this helpful? Share it!</p>
              <ShareButtons
                url={currentUrl}
                title={post.title}
                description={post.excerpt}
              />
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {post.relatedProducts && post.relatedProducts.length > 0 && (
          <div className="bg-linear-to-b from-gray-50 to-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Products Mentioned in This Article
                </h2>
                <p className="text-lg text-gray-600">
                  Shop the products we recommend
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {post.relatedProducts.map((product) => (
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
                    excerpt={product.excerpt || "Check out this product"}
                    amazonLink={product.amazonLink}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Author Bio (Optional) */}
        {post.author && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    About {post.author}
                  </h3>
                  <p className="text-gray-600">
                    Part of the MishBabyGuide team, dedicated to helping parents
                    make informed decisions about baby products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Article Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.mainImage ? getImageUrl(post.mainImage, 1200) : "",
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            author: {
              "@type": "Person",
              name: post.author || "MishBabyGuide Team",
            },
            publisher: {
              "@type": "Organization",
              name: "MishBabyGuide",
              logo: {
                "@type": "ImageObject",
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": currentUrl,
            },
          }),
        }}
      />
    </>
  );
}

export const revalidate = 3600; // Revalidate every hour
