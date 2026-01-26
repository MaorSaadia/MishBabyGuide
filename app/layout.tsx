// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default:
      "MishBabyGuide - Amazon Baby Product Recommendations & Parenting Guides",
    template: "%s | MishBabyGuide",
  },
  description:
    "Discover the best baby products on Amazon with our expert recommendations and buying guides. Read helpful parenting articles and find curated product picks for your little one.",
  keywords: [
    "baby products amazon",
    "baby product recommendations",
    "amazon baby essentials",
    "parenting blog",
    "baby buying guide",
    "best baby products",
    "baby gear amazon",
    "parenting tips",
    "baby product guides",
    "amazon baby recommendations",
  ],
  authors: [{ name: "MishBabyGuide Team" }],
  creator: "MishBabyGuide",
  publisher: "MishBabyGuide",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "MishBabyGuide",
    title: "MishBabyGuide - Amazon Baby Product Recommendations",
    description:
      "Discover the best baby products on Amazon with expert recommendations and parenting guides",
    images: [
      {
        url: "/og-image.jpg", // Use main OG image instead of logo
        width: 1200,
        height: 630,
        alt: "MishBabyGuide - Baby Product Recommendations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MishBabyGuide - Amazon Baby Products & Parenting Guides",
    description:
      "Expert baby product recommendations from Amazon and helpful parenting articles",
    images: ["/og-image.jpg"],
    creator: "@mishbabyguide",
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
  verification: {
    google: "CYIt1AAU7pbTjPX0KMVjsU9jy1DRLqHUJ0L-HWfueqM",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mishbabyguide.com";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "MishBabyGuide",
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              description: "Baby product recommendations and parenting guides",
              sameAs: [
                // Add your social media profiles here
                "https://www.facebook.com/profile.php?id=61567086625746",
                "https://www.instagram.com/mishbabystore",
                "https://www.youtube.com/@MishBabyShop",
              ],
            }),
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MishBabyGuide",
              url: siteUrl,
              description:
                "Amazon baby product recommendations, parenting guides, and helpful articles for parents",
              publisher: {
                "@type": "Organization",
                name: "MishBabyGuide",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${siteUrl}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Umami Analytics */}
        <Script
          async
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-right" expand={false} richColors closeButton />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <AccessibilityWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
