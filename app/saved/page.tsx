import { redirect } from "next/navigation";

import SavedProductsGrid from "@/components/SavedProductsGrid";
import { createClient } from "@/lib/supabase/server";
import type { SavedProduct } from "@/lib/saved-products";

export const metadata = {
  title: "Saved Products",
  description: "Your saved baby products and reviews.",
};

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/sign-in?next=/saved");
  }

  const { data: products, error: productsError } = await supabase
    .from("saved_products")
    .select("*")
    .eq("user_id", data.claims.sub)
    .order("created_at", { ascending: false });

  if (productsError) {
    throw new Error(productsError.message);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            Your shortlist
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-950 dark:text-white">
            Saved Products
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
            Compare your saved Amazon finds, recommendations, and full reviews
            from any device.
          </p>
        </div>

        <SavedProductsGrid products={(products ?? []) as SavedProduct[]} />
      </div>
    </div>
  );
}
