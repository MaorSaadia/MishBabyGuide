// lib/structuredData.ts

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mish-baby-guide.vercel.app";

// Organization Schema (for site-wide use)
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MishBabyGuide",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  description: "Expert baby product reviews and buying guides for parents",
  sameAs: [
    // Add your social media URLs here
    // 'https://www.facebook.com/mishbabyguide',
    // 'https://www.instagram.com/mishbabyguide',
    // 'https://twitter.com/mishbabyguide',
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    availableLanguage: "English",
  },
};

// Website Schema with Search
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MishBabyGuide",
  url: baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${baseUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// BreadcrumbList Schema Generator
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? `${baseUrl}${item.url}` : undefined,
    })),
  };
}

// Product Schema Generator
export function generateProductSchema(product: {
  title: string;
  description: string;
  image: string;
  price?: string;
  rating?: number;
  amazonLink: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: "Various",
    },
    ...(product.price && {
      offers: {
        "@type": "Offer",
        url: product.amazonLink,
        priceCurrency: "USD",
        price: product.price.replace(/[^0-9.]/g, ""),
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "Amazon",
        },
      },
    }),
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: 1,
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
      datePublished: product.publishedAt,
    },
  };
}

// Article Schema Generator
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  author?: string;
  publishedAt: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: article.image || `${baseUrl}/logo.png`,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author || "MishBabyGuide Team",
    },
    publisher: {
      "@type": "Organization",
      name: "MishBabyGuide",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  };
}

// ItemList Schema Generator (for category pages)
export function generateItemListSchema(
  name: string,
  items: Array<{ name: string; url: string; image?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${baseUrl}${item.url}`,
      ...(item.image && { image: item.image }),
    })),
  };
}

// FAQ Schema Generator
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Helper to render JSON-LD script
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderJsonLd(data: any) {
  return {
    __html: JSON.stringify(data),
  };
}
