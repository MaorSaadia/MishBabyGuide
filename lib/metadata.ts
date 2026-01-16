// lib/metadata.ts
import { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mishbabyguide.com";
const siteName = "Mish Baby Guide";
const siteDescription =
  "Expert baby product reviews, recommendations, and parenting guides. Find the best products for your little one with honest, in-depth reviews.";

/**
 * Default metadata for the site
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} - Baby Product Reviews & Recommendations`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "baby products",
    "baby product reviews",
    "parenting guides",
    "baby gear",
    "infant products",
    "newborn essentials",
    "baby recommendations",
    "baby product comparisons",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: siteName,
    title: `${siteName} - Baby Product Reviews & Recommendations`,
    description: siteDescription,
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Baby Product Reviews & Recommendations`,
    description: siteDescription,
    images: [`${baseUrl}/og-image.jpg`],
    creator: "@yourtwitterhandle", // Update with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(product: {
  _type: "productReview" | "productRecommendation";
  title: string;
  excerpt: string;
  mainImage?: { asset: { url?: string; _id?: string } };
  category?: { title: string };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  slug: { current: string };
}): Metadata {
  const title = product.seo?.metaTitle || `${product.title} - ${siteName}`;
  const description = product.seo?.metaDescription || product.excerpt;
  const imageUrl = product.mainImage?.asset?.url || `${baseUrl}/og-image.jpg`;

  // Enhanced keywords based on product type
  const defaultKeywords = [
    product.title,
    "baby product",
    product._type === "productReview"
      ? "product review"
      : "product recommendation",
    ...(product.category ? [product.category.title] : []),
  ];

  const keywords = product.seo?.keywords || defaultKeywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${baseUrl}/products/${product.slug.current}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/products/${product.slug.current}`,
    },
  };
}

/**
 * Generate metadata for blog posts
 */
export function generatePostMetadata(post: {
  title: string;
  excerpt: string;
  mainImage?: { asset: { url: string } };
  publishedAt: string;
  author?: string;
  categories?: Array<{ title: string }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  slug: { current: string };
}): Metadata {
  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const imageUrl = post.mainImage?.asset?.url || `${baseUrl}/og-image.jpg`;

  return {
    title,
    description,
    keywords: post.categories?.map((cat) => cat.title) || [],
    openGraph: {
      title,
      description,
      type: "article",
      url: `${baseUrl}/blog/${post.slug.current}`,
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug.current}`,
    },
  };
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(category: {
  title: string;
  description?: string;
  slug: { current: string };
}): Metadata {
  const title = `${category.title} - ${siteName}`;
  const description =
    category.description ||
    `Browse ${category.title.toLowerCase()} products and reviews`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/products/category/${category.slug.current}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/products/category/${category.slug.current}`,
    },
  };
}

/**
 * Generate JSON-LD structured data for product
 */
export function generateProductJsonLd(product: {
  _type: "productReview" | "productRecommendation";
  title: string;
  excerpt: string;
  mainImage?: { asset: { url?: string } };
  amazonLink: string;
  publishedAt: string;
  slug: { current: string };
  pros?: string[];
  cons?: string[];
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.excerpt,
    image: product.mainImage?.asset?.url || `${baseUrl}/og-image.jpg`,
    url: `${baseUrl}/products/${product.slug.current}`,
    offers: {
      "@type": "Offer",
      url: product.amazonLink,
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      seller: {
        "@type": "Organization",
        name: "Amazon",
      },
    },
  };

  // Add review data if this is a product review
  if (product._type === "productReview") {
    schema.review = {
      "@type": "Review",
      datePublished: product.publishedAt,
      author: {
        "@type": "Organization",
        name: siteName,
      },
      reviewBody: product.excerpt,
    };

    // Add review rating if pros/cons exist
    if (product.pros && product.cons) {
      const prosCount = product.pros.length;
      const consCount = product.cons.length;
      const totalPoints = prosCount + consCount;
      const rating = totalPoints > 0 ? (prosCount / totalPoints) * 5 : 4.5;

      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: rating.toFixed(1),
        reviewCount: "1",
      };
    }
  }

  return schema;
}

/**
 * Generate JSON-LD structured data for blog post
 */
export function generateBlogPostJsonLd(post: {
  title: string;
  excerpt: string;
  mainImage?: { asset: { url: string } };
  publishedAt: string;
  author?: string;
  slug: { current: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage?.asset?.url,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author || siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug.current}`,
    },
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
