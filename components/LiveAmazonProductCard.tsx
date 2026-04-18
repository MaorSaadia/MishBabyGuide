import Link from "next/link";
import { ExternalLink, ShieldCheck, Star } from "lucide-react";

import SaveProductButton from "@/components/SaveProductButton";
import type { LiveAmazonProduct } from "@/lib/amazon-live-search";
import { getStableProductKey, type SavedProductInput } from "@/lib/saved-products";

type LiveAmazonProductCardProps = {
  product: LiveAmazonProduct;
};

export default function LiveAmazonProductCard({
  product,
}: LiveAmazonProductCardProps) {
  const features = product.features.filter(Boolean).slice(0, 3);
  const savedProduct: SavedProductInput = {
    product_key: getStableProductKey({
      asin: product.asin,
      amazonUrl: product.url,
      siteUrl: null,
    }),
    source_type: "amazon_live",
    title: product.title ?? "Untitled Amazon product",
    image: product.imageUrl,
    amazon_url: product.url,
    site_url: null,
    asin: product.asin,
    price: product.price,
    rating: product.rating,
    category: "Live Amazon",
    features,
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
      <div className="relative overflow-hidden border-b border-cyan-50 bg-linear-to-br from-cyan-50 via-white to-amber-50 dark:border-gray-800 dark:from-cyan-950/60 dark:via-gray-900 dark:to-amber-950/20">
        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700 shadow-sm dark:bg-gray-900/95 dark:text-cyan-200">
          <ShieldCheck className="h-3.5 w-3.5" />
          Live Amazon
        </div>
        <Link
          href={product.url ?? "#"}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="block"
          aria-label={`Open ${product.title ?? "this product"} on Amazon`}
        >
          <div className="relative h-64">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title ?? "Amazon product image"}
                className="absolute inset-0 h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Amazon image unavailable
              </div>
            )}
          </div>
        </Link>
      </div>

      <div className="flex grow flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Amazon search result
            </p>
            <h2 className="mt-2 line-clamp-3 text-lg font-bold leading-tight text-gray-900 dark:text-white">
              {product.title ?? "Untitled Amazon product"}
            </h2>
          </div>
          {typeof product.rating === "number" && (
            <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              <Star className="h-4 w-4 fill-current" />
              {product.rating.toFixed(1)}
            </div>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              Current price
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {product.price ?? "See Amazon"}
            </p>
          </div>
          {product.asin && (
            <span className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
              {product.asin}
            </span>
          )}
        </div>

        <ul className="mb-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          {features.length > 0 ? (
            features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                <span className="line-clamp-2">{feature}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 dark:text-gray-400">
              Open on Amazon to view the latest feature details.
            </li>
          )}
        </ul>

        <div className="mt-auto flex gap-2">
          <Link
            href={product.url ?? "#"}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            View on Amazon
            <ExternalLink className="h-4 w-4" />
          </Link>
          <SaveProductButton product={savedProduct} compact />
        </div>
      </div>
    </article>
  );
}
