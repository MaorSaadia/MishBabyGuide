// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mishbabyguide.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/studio/*", // Sanity Studio
          "/_next/*", // Next.js internal files
          "/admin/*", // Any admin pages
          "/private/*", // Private pages
          "/*.json$", // JSON files
          "/*?*", // Pages with query parameters (optional)
        ],
      },
      {
        userAgent: "GPTBot", // OpenAI's crawler
        allow: ["/"], // Disallow if you don't want AI training on your content
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
      },
      {
        userAgent: "CCBot", // Common Crawl
        allow: ["/"],
      },
      {
        userAgent: "anthropic-ai", // Claude's crawler
        allow: ["/"],
      },
      {
        userAgent: "Google-Extended", // Google's AI training crawler
        allow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

// If you prefer a static robots.txt file instead:
// Create: public/robots.txt
/*
# Allow all crawlers
User-agent: *
Allow: /

# Disallow specific paths
Disallow: /api/
Disallow: /studio/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/

# Block AI crawlers (optional)
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Google-Extended
Disallow: /

# Sitemap location
Sitemap: https://www.mishbabyguide.com/sitemap.xml
*/
