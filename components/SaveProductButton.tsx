"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { SavedProductInput } from "@/lib/saved-products";
import { storePendingSavedProduct } from "@/components/PendingSavedProductSync";

type SaveProductButtonProps = {
  product: SavedProductInput;
  className?: string;
  compact?: boolean;
};

export default function SaveProductButton({
  product,
  className,
  compact = false,
}: SaveProductButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    async function loadSavedState() {
      const response = await fetch(
        `/api/saved-products?product_key=${encodeURIComponent(product.product_key)}`,
      );

      if (!active) return;

      if (response.status === 401) {
        setLoaded(true);
        return;
      }

      if (response.ok) {
        const data = (await response.json()) as { saved?: boolean };
        setSaved(Boolean(data.saved));
      }

      setLoaded(true);
    }

    if (product.product_key) {
      void loadSavedState();
    }

    return () => {
      active = false;
    };
  }, [product.product_key]);

  function handleAuthRedirect() {
    storePendingSavedProduct(product);
    const next = pathname || product.site_url || "/saved";
    router.push(`/sign-in?next=${encodeURIComponent(next)}`);
  }

  function toggleSave() {
    startTransition(async () => {
      const response = await fetch(
        saved
          ? `/api/saved-products?product_key=${encodeURIComponent(product.product_key)}`
          : "/api/saved-products",
        {
          method: saved ? "DELETE" : "POST",
          headers: saved ? undefined : { "Content-Type": "application/json" },
          body: saved ? undefined : JSON.stringify(product),
        },
      );

      if (response.status === 401) {
        handleAuthRedirect();
        return;
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast.error(data?.error ?? "Could not update saved products.");
        return;
      }

      setSaved(!saved);
      toast.success(saved ? "Removed from saved products." : "Saved.");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggleSave}
      disabled={!loaded || isPending || !product.product_key}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-600 bg-white px-3 py-2.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-900 dark:text-cyan-300 dark:hover:bg-cyan-950/30 sm:text-sm"
      }
      aria-pressed={saved}
      aria-label={saved ? `Unsave ${product.title}` : `Save ${product.title}`}
      title={saved ? "Remove from saved products" : "Save product"}
    >
      {isPending || !loaded ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
      )}
      {!compact && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
