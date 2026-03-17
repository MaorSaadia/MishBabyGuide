import { NextRequest, NextResponse } from "next/server";

import {
  AmazonCreatorsError,
  assertAmazonTestSecret,
  runAmazonCreatorsTest,
} from "@/lib/amazon-creators";

export const dynamic = "force-dynamic";

function getRequestSecret(request: NextRequest) {
  return (
    request.headers.get("x-amazon-test-secret") ??
    request.nextUrl.searchParams.get("secret")
  );
}

export async function GET(request: NextRequest) {
  try {
    assertAmazonTestSecret(getRequestSecret(request));

    const asin = request.nextUrl.searchParams.get("asin") ?? undefined;
    const keywords = request.nextUrl.searchParams.get("keywords") ?? undefined;
    const searchIndex =
      request.nextUrl.searchParams.get("searchIndex") ?? undefined;
    const itemCountValue = request.nextUrl.searchParams.get("itemCount");
    const itemCount = itemCountValue ? Number(itemCountValue) : undefined;

    if (itemCountValue && Number.isNaN(itemCount)) {
      return NextResponse.json(
        { error: "itemCount must be a valid number" },
        { status: 400 },
      );
    }

    const result = await runAmazonCreatorsTest({
      asin,
      keywords,
      searchIndex,
      itemCount,
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof AmazonCreatorsError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected Amazon API error.",
      },
      { status: 500 },
    );
  }
}
