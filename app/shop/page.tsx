import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowRight, Search, Sparkles } from "lucide-react";

import LiveAmazonResultsSection from "@/components/LiveAmazonResultsSection";
import LiveAmazonSearchForm from "@/components/LiveAmazonSearchForm";
import {
  searchLiveAmazonProducts,
  validateLiveAmazonQuery,
} from "@/lib/amazon-live-search";

export const metadata: Metadata = {
  title: "Shop Live Amazon Picks | MishBabyGuide",
  description:
    "Search Amazon-backed baby products live on MishBabyGuide and shop through our affiliate links with up-to-date product details.",
  alternates: {
    canonical: "/shop",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const trimmedQuery = q.trim();
  const hasQuery = trimmedQuery.length > 0;

  let results:
    | Awaited<ReturnType<typeof searchLiveAmazonProducts>>
    | null = null;
  let errorMessage: string | null = null;

  if (hasQuery) {
    try {
      const validQuery = validateLiveAmazonQuery(trimmedQuery);
      results = await searchLiveAmazonProducts({ query: validQuery });
    } catch {
      errorMessage =
        "We couldn't load live Amazon results for that search. Try a simple product keyword like stroller, monitor, or diaper bag.";
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_38%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)] dark:bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.2),_transparent_30%),linear-gradient(to_bottom,_#0f172a,_#020617)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-cyan-100/80 bg-white/85 p-8 shadow-[0_25px_80px_-35px_rgba(8,145,178,0.35)] backdrop-blur dark:border-cyan-950/60 dark:bg-gray-900/78 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Live Amazon shop
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-6xl">
                Search baby products live, then shop on Amazon in one click.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                This page shows live Amazon-backed product results without
                adding them to our CMS. Use it when you want fast shopping
                options beyond our curated editorial picks.
              </p>

              <div className="mt-8">
                <LiveAmazonSearchForm defaultValue={trimmedQuery} />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-cyan-100 bg-linear-to-br from-cyan-50 via-white to-amber-50 p-6 dark:border-cyan-950/50 dark:from-cyan-950/20 dark:via-gray-950 dark:to-amber-950/10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-300">
                Know what you are browsing
              </p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
                <p>
                  These are live Amazon search results, not editor-reviewed
                  product pages. For our handpicked recommendations, visit{" "}
                  <Link href="/products" className="font-semibold text-cyan-700 dark:text-cyan-300">
                    Products
                  </Link>
                  .
                </p>
                <p>
                  Prices and availability can change quickly. Check the Amazon
                  page before you buy.
                </p>
                <p>
                  As an Amazon Associate, we earn from qualifying purchases.
                  Certain content shown here comes from Amazon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {!hasQuery ? (
          <section className="mt-10 rounded-[2rem] border border-dashed border-cyan-200 bg-white/75 p-10 text-center dark:border-cyan-950/60 dark:bg-gray-900/70">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-200">
              <Search className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">
              Start with a product keyword
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
              Search for strollers, baby monitors, feeding gear, nursery
              products, and more. We’ll show live Amazon results while keeping
              your curated site content separate.
            </p>
          </section>
        ) : null}

        {errorMessage ? (
          <section className="mt-10 rounded-[2rem] border border-amber-200 bg-amber-50/90 p-8 dark:border-amber-900/60 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-amber-700 dark:text-amber-300" />
              <div>
                <h2 className="text-lg font-bold text-amber-900 dark:text-amber-100">
                  Live search is unavailable for this query
                </h2>
                <p className="mt-2 text-sm leading-7 text-amber-900/80 dark:text-amber-100/80">
                  {errorMessage}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {results ? (
          <LiveAmazonResultsSection initialResults={results} />
        ) : null}

        <section className="mt-12 rounded-[2rem] border border-gray-200 bg-white/70 p-8 dark:border-gray-800 dark:bg-gray-900/70">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                Prefer curated picks?
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                Browse our editorial recommendations and hands-on reviews
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Use the live shop for broad Amazon discovery, then switch to our
                curated sections when you want trusted recommendations, reviews,
                and category guides.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Explore products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-200 px-5 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:border-cyan-900 dark:text-cyan-300 dark:hover:bg-cyan-950/30"
              >
                Read reviews
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
