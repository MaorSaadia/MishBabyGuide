import { NextRequest, NextResponse } from "next/server";

import {
  AmazonSanityImportError,
  getDraftDocumentId,
  getPublishedDocumentId,
  importAmazonProductToSanity,
} from "@/lib/amazon-sanity-import";
import { writeClient } from "@/lib/sanity.write.client";

export const dynamic = "force-dynamic";

type ProductDocumentType = "productRecommendation" | "productReview";

type StudioImportBody = {
  asin?: string;
  documentId?: string;
  documentType?: ProductDocumentType;
};

type ExistingProductDocument = {
  _id: string;
  _type: ProductDocumentType;
  amazon?: {
    asin?: string;
    title?: string | null;
    detailPageUrl?: string | null;
    imageUrl?: string | null;
    price?: string | null;
    rating?: number | null;
    syncStatus?: "pending" | "synced" | "error";
    lastSyncedAt?: string;
    lastError?: string;
    source?: string;
  };
  [key: string]: unknown;
};

function stripSystemFields(document: ExistingProductDocument) {
  const {
    _id,
    _rev,
    _createdAt,
    _updatedAt,
    ...rest
  } = document as ExistingProductDocument & {
    _rev?: string;
    _createdAt?: string;
    _updatedAt?: string;
  };

  void _id;
  void _rev;
  void _createdAt;
  void _updatedAt;

  return rest;
}

function isStudioRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const expectedOrigin = request.nextUrl.origin;

  return (
    origin === expectedOrigin &&
    typeof referer === "string" &&
    referer.startsWith(`${expectedOrigin}/studio`)
  );
}

async function fetchExistingProductDocument(documentId: string) {
  return writeClient.fetch<ExistingProductDocument | null>(
    `*[_id in [$draftId, $publishedId]][0]{
      ...
    }`,
    {
      draftId: getDraftDocumentId(documentId),
      publishedId: getPublishedDocumentId(documentId),
    },
  );
}

async function markSyncState(input: {
  documentId: string;
  status: "pending" | "error";
  lastError?: string;
}) {
  const existing = await fetchExistingProductDocument(input.documentId);

  if (!existing) {
    return;
  }

  const draftId = getDraftDocumentId(existing._id);

  await writeClient.createOrReplace({
    ...stripSystemFields(existing),
    _id: draftId,
    _type: existing._type,
    amazon: {
      ...(existing.amazon ?? {}),
      syncStatus: input.status,
      lastError: input.lastError,
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isStudioRequest(request)) {
    return NextResponse.json(
      { error: "Studio import requests must originate from the embedded Studio." },
      { status: 403 },
    );
  }

  let body: StudioImportBody = {};

  try {
    body = (await request.json()) as StudioImportBody;
    const existingDocument = body.documentId
      ? await fetchExistingProductDocument(body.documentId)
      : null;

    const asin = typeof body.asin === "string" && body.asin.trim()
      ? body.asin.trim().toUpperCase()
      : existingDocument?.amazon?.asin?.trim().toUpperCase();

    const documentType =
      existingDocument?._type ??
      (body.documentType === "productReview"
        ? "productReview"
        : "productRecommendation");

    if (!asin) {
      return NextResponse.json({ error: "asin is required" }, { status: 400 });
    }

    if (body.documentId) {
      await markSyncState({
        documentId: body.documentId,
        status: "pending",
      });
    }

    const result = await importAmazonProductToSanity({
      asin,
      documentType,
    });

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    if (body.documentId) {
      await markSyncState({
        documentId: body.documentId,
        status: "error",
        lastError:
          error instanceof Error
            ? error.message
            : "Unexpected Amazon import error.",
      }).catch(() => undefined);
    }

    if (error instanceof AmazonSanityImportError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected Amazon import error.",
      },
      { status: 500 },
    );
  }
}
