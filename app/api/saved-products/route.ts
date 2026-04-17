import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  isSavedProductSourceType,
  type SavedProductInput,
} from "@/lib/saved-products";

async function getAuthenticatedUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return { supabase, userId: null };
  }

  return { supabase, userId: data.claims.sub };
}

function normalizeSavedProduct(body: Partial<SavedProductInput>) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const productKey =
    typeof body.product_key === "string" ? body.product_key.trim() : "";

  if (!productKey || !title || !isSavedProductSourceType(body.source_type)) {
    return null;
  }

  return {
    product_key: productKey,
    source_type: body.source_type,
    title,
    image: body.image ?? null,
    amazon_url: body.amazon_url ?? null,
    site_url: body.site_url ?? null,
    asin: body.asin ?? null,
    price: body.price ?? null,
    rating: typeof body.rating === "number" ? body.rating : null,
    category: body.category ?? null,
    features: Array.isArray(body.features) ? body.features.slice(0, 12) : [],
  };
}

export async function GET(request: Request) {
  const { supabase, userId } = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productKey = searchParams.get("product_key");

  if (productKey) {
    const { data, error } = await supabase
      .from("saved_products")
      .select("*")
      .eq("user_id", userId)
      .eq("product_key", productKey)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: Boolean(data), product: data });
  }

  const { data, error } = await supabase
    .from("saved_products")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}

export async function POST(request: Request) {
  const { supabase, userId } = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const savedProduct = normalizeSavedProduct(await request.json());

  if (!savedProduct) {
    return NextResponse.json(
      { error: "A valid saved product payload is required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("saved_products")
    .upsert(
      {
        ...savedProduct,
        user_id: userId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,product_key" },
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { supabase, userId } = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productKey = searchParams.get("product_key");

  if (!productKey) {
    return NextResponse.json(
      { error: "product_key is required" },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("saved_products")
    .delete()
    .eq("user_id", userId)
    .eq("product_key", productKey);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
