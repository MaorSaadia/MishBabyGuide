import { NextRequest, NextResponse } from "next/server";

import {
  AmazonSanityImportError,
  assertAmazonImportSecret,
  importAmazonProductToSanity,
} from "@/lib/amazon-sanity-import";

export const dynamic = "force-dynamic";

function getRequestSecret(request: NextRequest) {
  return (
    request.headers.get("x-amazon-import-secret") ??
    request.nextUrl.searchParams.get("secret")
  );
}

export async function POST(request: NextRequest) {
  try {
    assertAmazonImportSecret(getRequestSecret(request));

    const body = await request.json();
    const asin =
      typeof body?.asin === "string" ? body.asin : request.nextUrl.searchParams.get("asin");
    const documentType =
      body?.documentType === "productReview" ? "productReview" : "productRecommendation";

    if (!asin) {
      return NextResponse.json(
        { error: "asin is required" },
        { status: 400 },
      );
    }

    const result = await importAmazonProductToSanity({
      asin,
      documentType,
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof AmazonSanityImportError) {
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
        error: error instanceof Error ? error.message : "Unexpected Amazon import error.",
      },
      { status: 500 },
    );
  }
}
