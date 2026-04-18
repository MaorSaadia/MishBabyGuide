"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

const PENDING_SAVE_KEY = "mish_pending_saved_product";

export function storePendingSavedProduct(product: unknown) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_SAVE_KEY, JSON.stringify(product));
}

export async function flushPendingSavedProduct() {
  if (typeof window === "undefined") return false;

  const pending = sessionStorage.getItem(PENDING_SAVE_KEY);
  if (!pending) return false;

  const response = await fetch("/api/saved-products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: pending,
  });

  if (response.status === 401) return false;

  if (!response.ok) {
    throw new Error("Could not save the product you picked.");
  }

  sessionStorage.removeItem(PENDING_SAVE_KEY);
  return true;
}

export default function PendingSavedProductSync() {
  useEffect(() => {
    const supabase = createClient();

    async function syncPendingSave() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      try {
        const saved = await flushPendingSavedProduct();
        if (saved) {
          toast.success("Saved to your products.");
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not save that product.",
        );
      }
    }

    void syncPendingSave();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        void syncPendingSave();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
