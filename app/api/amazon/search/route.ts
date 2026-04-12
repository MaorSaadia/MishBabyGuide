import { NextRequest, NextResponse } from "next/server";

import { AmazonCreatorsError } from "@/lib/amazon-creators";
import {
  normalizeLiveAmazonItemCount,
  normalizeLiveAmazonItemPage,
  searchLiveAmazonProducts,
  validateLiveAmazonQuery,
} from "@/lib/amazon-live-search";

export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map<string, number[]>();

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

  return `${ip}:${request.headers.get("user-agent") ?? "unknown-agent"}`;
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const requests = (requestLog.get(key) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (requests.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(key, requests);
    return false;
  }

  requests.push(now);
  requestLog.set(key, requests);
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") ?? "";
    const itemCountValue = request.nextUrl.searchParams.get("itemCount");
    const itemCount = normalizeLiveAmazonItemCount(
      itemCountValue ? Number(itemCountValue) : undefined,
    );
    const itemPageValue = request.nextUrl.searchParams.get("itemPage");
    const itemPage = normalizeLiveAmazonItemPage(
      itemPageValue ? Number(itemPageValue) : undefined,
    );

    validateLiveAmazonQuery(q);

    if (!checkRateLimit(getClientKey(request))) {
      return NextResponse.json(
        {
          error:
            "Too many Amazon searches from this device right now. Please wait a minute and try again.",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: {
            "cache-control": "no-store",
          },
        },
      );
    }

    const result = await searchLiveAmazonProducts({
      query: q,
      itemCount,
      itemPage,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof AmazonCreatorsError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        {
          status: error.status,
          headers: {
            "cache-control": "no-store",
          },
        },
      );
    }

    return NextResponse.json(
      {
        error:
          "We couldn't load live Amazon results right now. Please try again in a moment.",
      },
      {
        status: 500,
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }
}
