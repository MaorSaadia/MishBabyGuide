"use client";

import { useEffect, useMemo, useState } from "react";

import LiveAmazonResultsSection from "@/components/LiveAmazonResultsSection";
import type { LiveAmazonSearchResult } from "@/lib/amazon-live-search";

type CategoryLiveAmazonSectionProps = {
  categoryTitle: string;
  categorySlug: string;
  description?: string;
};

type CategoryLiveAmazonState =
  | { status: "idle" | "loading"; data: null }
  | { status: "success"; data: LiveAmazonSearchResult }
  | { status: "error"; data: null };

function CategoryLiveAmazonLoading() {
  return (
    <section className="mt-16" aria-label="Loading live Amazon products">
      <div className="rounded-[2rem] border border-cyan-100 bg-white/80 p-6 dark:border-gray-800 dark:bg-gray-900/75">
        <div className="h-9 w-48 animate-pulse rounded-full bg-cyan-100 dark:bg-cyan-950/60" />
        <div className="mt-5 h-10 w-[34rem] max-w-full animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
        <div className="mt-4 h-16 max-w-3xl animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-[31rem] animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-800"
          />
        ))}
      </div>
    </section>
  );
}

export default function CategoryLiveAmazonSection({
  categoryTitle,
  categorySlug,
  description,
}: CategoryLiveAmazonSectionProps) {
  const query = categoryTitle.trim();
  const [state, setState] = useState<CategoryLiveAmazonState>({
    status: "idle",
    data: null,
  });
  const fullSearchHref = useMemo(
    () => `/shop?q=${encodeURIComponent(query)}`,
    [query],
  );

  useEffect(() => {
    if (!query) {
      return;
    }

    const controller = new AbortController();

    async function loadCategoryAmazonResults() {
      try {
        setState({ status: "loading", data: null });

        const response = await fetch(
          `/api/amazon/search?q=${encodeURIComponent(query)}&itemCount=6`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Amazon category search failed.");
        }

        const data = (await response.json()) as LiveAmazonSearchResult;

        if (data.products.length === 0) {
          setState({ status: "error", data: null });
          return;
        }

        setState({ status: "success", data });
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setState({ status: "error", data: null });
      }
    }

    void loadCategoryAmazonResults();

    return () => {
      controller.abort();
    };
  }, [query]);

  if (!query || state.status === "error") {
    return null;
  }

  if (state.status === "idle" || state.status === "loading") {
    return <CategoryLiveAmazonLoading />;
  }

  const data = state.data;

  if (!data) {
    return null;
  }

  return (
    <LiveAmazonResultsSection
      initialResults={data}
      badgeLabel="Live Amazon Picks"
      title={`More ${categoryTitle} products on Amazon`}
      description={
        description ??
        "These are live Amazon marketplace results based on this category, not MishBabyGuide editorial recommendations. Use them for broader discovery after reviewing our curated picks."
      }
      className="mt-16"
      fullSearchHref={fullSearchHref}
      fullSearchLabel={`Open full live search for ${categoryTitle}`}
      hideEmptyState
      totalResultsLabel={`Amazon found about ${data.totalResultCount} marketplace result${
        data.totalResultCount === 1 ? "" : "s"
      } for this category.`}
      key={categorySlug}
    />
  );
}
