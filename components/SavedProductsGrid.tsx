"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { SavedProduct } from "@/lib/saved-products";

type SavedProductsGridProps = {
  products: SavedProduct[];
};

export default function SavedProductsGrid({ products }: SavedProductsGridProps) {
  const [items, setItems] = useState(products);
  const [removingKey, setRemovingKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function removeProduct(productKey: string) {
    setRemovingKey(productKey);
    startTransition(async () => {
      const response = await fetch(
        `/api/saved-products?product_key=${encodeURIComponent(productKey)}`,
        { method: "DELETE" },
      );

      setRemovingKey(null);

      if (!response.ok) {
        toast.error("Could not remove that product.");
        return;
      }

      setItems((current) =>
        current.filter((item) => item.product_key !== productKey),
      );
      toast.success("Removed from saved products.");
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-cyan-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
          Nothing saved yet
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-gray-600 dark:text-gray-300">
          Build your shortlist as you compare products, reviews, and live Amazon
          finds.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            Shop
          </Link>
          <Link
            href="/products"
            className="rounded-lg border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/30"
          >
            Products
          </Link>
          <Link
            href="/reviews"
            className="rounded-lg border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/30"
          >
            Reviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((product) => (
        <article
          key={product.id}
          className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <Link
            href={product.site_url || product.amazon_url || "#"}
            className="relative block aspect-square bg-gray-50 dark:bg-gray-950"
          >
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain p-5"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-sm text-gray-500">
                Product image unavailable
              </div>
            )}
          </Link>

          <div className="flex grow flex-col p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300">
                {product.category || product.source_type}
              </span>
              {product.rating !== null && product.rating !== undefined && (
                <span className="text-sm font-semibold text-amber-600">
                  {Number(product.rating).toFixed(1)}
                </span>
              )}
            </div>

            <h2 className="line-clamp-3 text-base font-bold leading-snug text-gray-950 dark:text-white">
              {product.title}
            </h2>

            {product.price && (
              <p className="mt-3 text-lg font-bold text-gray-950 dark:text-white">
                {product.price}
              </p>
            )}

            <div className="mt-auto flex gap-2 pt-5">
              {product.site_url && (
                <Link
                  href={product.site_url}
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
                >
                  View
                </Link>
              )}
              {product.amazon_url && (
                <Link
                  href={product.amazon_url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-cyan-600 px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/30"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
              <button
                type="button"
                onClick={() => removeProduct(product.product_key)}
                disabled={isPending && removingKey === product.product_key}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                aria-label={`Remove ${product.title}`}
              >
                {isPending && removingKey === product.product_key ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
