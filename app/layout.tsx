// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  organizationSchema,
  websiteSchema,
  renderJsonLd,
} from "@/lib/structuredData";
// import { Script } from "vm";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "MishBabyGuide - Honest Baby Product Reviews & Buying Guides",
    template: "%s | MishBabyGuide",
  },
  description:
    "Expert reviews and guides to help you choose the best baby products. From nursery essentials to feeding gear, we help parents make informed decisions.",
  keywords: [
    "baby products",
    "baby product reviews",
    "baby buying guide",
    "best baby products",
    "baby gear reviews",
    "parenting products",
    "baby essentials",
  ],
  authors: [{ name: "MishBabyGuide Team" }],
  creator: "MishBabyGuide",
  publisher: "MishBabyGuide",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "MishBabyGuide",
    title: "MishBabyGuide - Honest Baby Product Reviews",
    description: "Expert reviews and buying guides for baby products",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "MishBabyGuide Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MishBabyGuide - Honest Baby Product Reviews",
    description: "Expert reviews and buying guides for baby products",
    images: ["/logo.png"],
    creator: "@mishbabyguide", // Add your Twitter handle
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
    google: "CYIt1AAU7pbTjPX0KMVjsU9jy1DRLqHUJ0L-HWfueqM", // Add your verification code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={renderJsonLd(organizationSchema)}
        />
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={renderJsonLd(websiteSchema)}
        />
      </head>
      <body className={inter.className}>
        {/* Umami Analytics */}
        <Script
          async
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="beforeInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
