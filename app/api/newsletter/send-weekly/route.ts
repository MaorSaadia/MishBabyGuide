import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const ua = request.headers.get("user-agent") || "";

  return NextResponse.json(
    {
      error:
        "Automatic cron sending is disabled. Use /admin/newsletter for manual weekly sends.",
      userAgent: ua || "unknown",
    },
    { status: 410 },
  );
}
