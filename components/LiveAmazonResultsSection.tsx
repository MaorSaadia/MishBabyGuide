"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Loader2, Sparkles } from "lucide-react";

import type {
  LiveAmazonProduct,
  LiveAmazonSearchResult,
} from "@/lib/amazon-live-search";
import LiveAmazonProductCard from "@/components/LiveAmazonProductCard";

type LiveAmazonResultsSectionProps = {
  initialResults: LiveAmazonSearchResult;
  badgeLabel?: string;
  title?: string;
  description?: string;
  totalResultsLabel?: string;
  className?: string;
  fullSearchHref?: string;
  fullSearchLabel?: string;
  hideEmptyState?: boolean;
};

function formatFetchedAt(isoString: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoString));
}

function getProductKey(product: LiveAmazonProduct) {
  return product.asin ?? product.url ?? product.title ?? "";
}

function mergeProducts(
  currentProducts: LiveAmazonProduct[],
  nextProducts: LiveAmazonProduct[],
) {
  const seen = new Set(currentProducts.map(getProductKey).filter(Boolean));
  const uniqueNextProducts = nextProducts.filter((product) => {
    const key = getProductKey(product);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });

  return [...currentProducts, ...uniqueNextProducts];
}

export default function LiveAmazonResultsSection({
  initialResults,
  badgeLabel = "Live results",
  title,
  description,
  totalResultsLabel,
  className = "mt-10",
  fullSearchHref,
  fullSearchLabel = "Open full live Amazon search",
  hideEmptyState = false,
}: LiveAmazonResultsSectionProps) {
  const [products, setProducts] = useState(initialResults.products);
  const [itemPage, setItemPage] = useState(initialResults.itemPage);
  const [fetchedAt, setFetchedAt] = useState(initialResults.fetchedAt);
  const [hasMore, setHasMore] = useState(initialResults.hasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  async function handleLoadMore() {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const nextPage = itemPage + 1;
      const response = await fetch(
        `/api/amazon/search?q=${encodeURIComponent(
          initialResults.query,
        )}&itemCount=${initialResults.itemCount}&itemPage=${nextPage}`,
      );

      if (!response.ok) {
        throw new Error("Unable to load more Amazon results.");
      }

      const nextResults = (await response.json()) as LiveAmazonSearchResult;
      const mergedProducts = mergeProducts(products, nextResults.products);

      setProducts(mergedProducts);
      setItemPage(nextResults.itemPage);
      setFetchedAt(nextResults.fetchedAt);
      setHasMore(nextResults.hasMore && mergedProducts.length > products.length);
    } catch {
      setLoadMoreError(
        "We couldn't load more Amazon results right now. Please try again in a moment.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (hideEmptyState && products.length === 0) {
    return null;
  }

  const sectionTitle =
    title ??
    `${products.length} result${products.length === 1 ? "" : "s"} for "${
      initialResults.query
    }"`;
  const totalResultsText =
    totalResultsLabel ??
    `Amazon found about ${initialResults.totalResultCount} matching result${
      initialResults.totalResultCount === 1 ? "" : "s"
    }.`;

  return (
    <section className={className}>
      <div className="flex flex-col gap-5 rounded-[2rem] border border-cyan-100 bg-white/80 p-6 dark:border-gray-800 dark:bg-gray-900/75 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-200">
            <Sparkles className="h-4 w-4" />
            {badgeLabel}
          </div>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            {sectionTitle}
          </h2>
          {description ? (
            <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
              {description}
            </p>
          ) : null}
          {initialResults.totalResultCount ? (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {totalResultsText}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
            Price and rating last fetched {formatFetchedAt(fetchedAt)}
          </p>
          <p>
            Prices and availability are accurate as of the displayed time and
            are subject to change.
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-[2rem] border border-dashed border-gray-200 bg-white/70 p-10 text-center dark:border-gray-800 dark:bg-gray-900/65">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            No Amazon matches found
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
            Try a broader search term like &quot;baby carrier&quot; or
            &quot;crib mattress&quot;, or browse our editorial picks on the
            products page.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              View curated products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <LiveAmazonProductCard
                key={`${product.asin ?? product.url ?? product.title}`}
                product={product}
              />
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            {loadMoreError ? (
              <p className="max-w-xl text-center text-sm text-amber-700 dark:text-amber-300">
                {loadMoreError}
              </p>
            ) : null}

            {hasMore ? (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/10 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading more...
                  </>
                ) : (
                  "Load more Amazon results"
                )}
              </button>
            ) : (
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                You&apos;ve reached the end of the available live results.
              </p>
            )}

            {fullSearchHref ? (
              <Link
                href={fullSearchHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-100"
              >
                {fullSearchLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
