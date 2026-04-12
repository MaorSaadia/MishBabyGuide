"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, Sparkles } from "lucide-react";

import { cleanProductTitle } from "@/lib/helper";
import type { LiveAmazonProduct } from "@/lib/amazon-live-search";
import LiveAmazonProductCard from "@/components/LiveAmazonProductCard";

type AmazonRelatedProductsProps = {
  productTitle: string;
  categoryTitle?: string;
  currentAsin?: string;
};

type AmazonSearchResponse = {
  query: string;
  itemCount: number;
  fetchedAt: string;
  products: LiveAmazonProduct[];
};

type RelatedState =
  | { status: "idle" | "loading"; data: null }
  | { status: "success"; data: AmazonSearchResponse }
  | { status: "error"; data: null };

function formatFetchedAt(isoString: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoString));
}

function buildRelatedQuery(input: {
  productTitle: string;
  categoryTitle?: string;
}) {
  const cleanedTitle = cleanProductTitle(input.productTitle);
  const categoryTitle = input.categoryTitle?.trim();

  return [categoryTitle, cleanedTitle].filter(Boolean).join(" ");
}

function RelatedProductsLoading() {
  return (
    <section className="bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_34%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)] py-16 dark:bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.18),_transparent_30%),linear-gradient(to_bottom,_#0f172a,_#020617)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[2rem] border border-cyan-100 bg-white/85 p-8 dark:border-cyan-950/60 dark:bg-gray-900/78">
          <div className="h-5 w-44 animate-pulse rounded-full bg-cyan-100 dark:bg-cyan-950/60" />
          <div className="mt-5 h-10 w-96 max-w-full animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          <div className="mt-4 h-16 max-w-2xl animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-[31rem] animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AmazonRelatedProducts({
  productTitle,
  categoryTitle,
  currentAsin,
}: AmazonRelatedProductsProps) {
  const query = buildRelatedQuery({ productTitle, categoryTitle });
  const normalizedCurrentAsin = currentAsin?.trim().toUpperCase();
  const [state, setState] = useState<RelatedState>({
    status: "idle",
    data: null,
  });

  useEffect(() => {
    if (!query) {
      return;
    }

    const controller = new AbortController();

    async function loadRelatedProducts() {
      try {
        setState({ status: "loading", data: null });

        const response = await fetch(
          `/api/amazon/search?q=${encodeURIComponent(query)}&itemCount=12`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Amazon related search failed.");
        }

        const data = (await response.json()) as AmazonSearchResponse;
        setState({ status: "success", data });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Error fetching Amazon related products:", error);
        setState({ status: "error", data: null });
      }
    }

    void loadRelatedProducts();

    return () => {
      controller.abort();
    };
  }, [query]);

  if (!query || state.status === "error") {
    return null;
  }

  if (state.status === "idle" || state.status === "loading") {
    return <RelatedProductsLoading />;
  }

  const data = state.status === "success" ? state.data : null;

  if (!data) {
    return null;
  }

  const products = data.products
    .filter((product) => {
      if (!product.url) {
        return false;
      }

      if (!normalizedCurrentAsin || !product.asin) {
        return true;
      }

      return product.asin.trim().toUpperCase() !== normalizedCurrentAsin;
    })
    .slice(0, 12);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_34%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)] py-16 dark:bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.18),_transparent_30%),linear-gradient(to_bottom,_#0f172a,_#020617)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-cyan-100 bg-white/85 p-6 shadow-[0_25px_80px_-45px_rgba(8,145,178,0.45)] backdrop-blur dark:border-cyan-950/60 dark:bg-gray-900/78 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Live Amazon Picks
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 dark:text-white md:text-4xl">
                You Might Also Like on Amazon
              </h2>
              <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">
                These live Amazon results are based on this product and its
                category. They are marketplace results, not MishBabyGuide
                editorial reviews.
              </p>
            </div>

            <div className="max-w-md space-y-2 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-cyan-950 dark:border-cyan-950/60 dark:bg-cyan-950/25 dark:text-cyan-100">
              <p className="inline-flex items-center gap-2 font-semibold">
                <Clock3 className="h-4 w-4" />
                Fetched {formatFetchedAt(data.fetchedAt)}
              </p>
              <p className="leading-6">
                Prices and availability can change. Check Amazon before
                purchasing. As an Amazon Associate, we earn from qualifying
                purchases.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
            <LiveAmazonProductCard
              key={`${product.asin ?? product.url}`}
              product={product}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/shop?q=${encodeURIComponent(data.query)}`}
            className="inline-flex items-center justify-center rounded-full border border-cyan-200 bg-white px-5 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:border-cyan-900 dark:bg-gray-900 dark:text-cyan-300 dark:hover:bg-cyan-950/30"
          >
            See more live Amazon results
          </Link>
        </div>
      </div>
    </section>
  );
}
