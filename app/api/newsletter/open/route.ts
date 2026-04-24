import { createAdminClient } from "@/lib/supabase/admin";

const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
  "base64",
);

export async function GET(request: Request) {
  const deliveryId = new URL(request.url).searchParams.get("delivery");

  if (deliveryId) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from("newsletter_deliveries")
        .select("id, open_count, opened_at")
        .eq("id", deliveryId)
        .maybeSingle();

      if (!error && data) {
        await adminClient
          .from("newsletter_deliveries")
          .update({
            open_count: (data.open_count ?? 0) + 1,
            opened_at: data.opened_at ?? new Date().toISOString(),
          })
          .eq("id", deliveryId);
      }
    } catch (error) {
      console.error("Newsletter open tracking error:", error);
    }
  }

  return new Response(TRANSPARENT_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
