import "server-only";

import { AmazonCreatorsError, getProductByAsin } from "@/lib/amazon-creators";
import { cleanProductTitle } from "@/lib/helper";
import { writeClient } from "@/lib/sanity.write.client";

export class AmazonSanityImportError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.name = "AmazonSanityImportError";
    this.status = status;
    this.code = code;
  }
}

type ProductDocumentType = "productRecommendation" | "productReview";

type ExistingProductDocument = {
  _id: string;
  _type: ProductDocumentType;
  [key: string]: unknown;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  description?: unknown[];
  review?: unknown[];
  pros?: string[];
  cons?: string[];
  amazonLink?: string;
  featured?: boolean;
  publishedAt?: string;
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
};

type ImportDocument = {
  _id: string;
  _type: ProductDocumentType;
  title: string;
  slug: { _type: "slug"; current: string };
  amazonLink: string;
  excerpt: string;
  description?: unknown[];
  review?: unknown[];
  pros?: string[];
  cons?: string[];
  featured: boolean;
  publishedAt: string;
  amazon: {
    asin: string;
    title: string | null;
    detailPageUrl: string | null;
    imageUrl: string | null;
    price: string | null;
    rating: number | null;
    syncStatus: "synced";
    lastSyncedAt: string;
    lastError: undefined;
    source: "creatorsapi";
  };
};

type AmazonImportResult = {
  documentId: string;
  mode: "created" | "updated";
  documentType: ProductDocumentType;
  asin: string;
  title: string;
  syncStatus: "synced";
  lastSyncedAt: string;
};

function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function assertAmazonImportSecret(secret: string | null) {
  const expected = getEnv("AMAZON_SANITY_IMPORT_SECRET");

  if (!expected) {
    throw new AmazonSanityImportError(
      "Missing Amazon Sanity import secret. Set AMAZON_SANITY_IMPORT_SECRET.",
      500,
      "CONFIG_ERROR",
    );
  }

  if (!secret || secret !== expected) {
    throw new AmazonSanityImportError(
      "Unauthorized Amazon import request.",
      401,
      "UNAUTHORIZED",
    );
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function getDraftDocumentId(documentId: string) {
  return documentId.startsWith("drafts.") ? documentId : `drafts.${documentId}`;
}

export function getPublishedDocumentId(documentId: string) {
  return documentId.replace(/^drafts\./, "");
}

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

async function findExistingProductsByAsin(asin: string) {
  return writeClient.fetch<ExistingProductDocument[]>(
    `*[_type in ["productReview", "productRecommendation"] && amazon.asin == $asin]{
      ...
    }`,
    { asin },
  );
}

function pickExistingDocument(
  documents: ExistingProductDocument[],
): ExistingProductDocument | null {
  if (documents.length === 0) {
    return null;
  }

  const draft = documents.find((document) => document._id.startsWith("drafts."));
  return draft ?? documents[0];
}

function buildDraftId(documentType: ProductDocumentType, asin: string) {
  return `drafts.${documentType}-${asin.toLowerCase()}`;
}

function normalizeImportedTitle(title: string | null | undefined, asin: string) {
  const fallbackTitle = title || `Amazon Product ${asin}`;
  const cleanedTitle = cleanProductTitle(fallbackTitle).replace(/\s+/g, " ").trim();
  const words = cleanedTitle.split(/\s+/).filter(Boolean);

  if (words.length <= 12 && cleanedTitle.length <= 90) {
    return cleanedTitle;
  }

  return words.slice(0, 12).join(" ").trim();
}

function buildPortableTextFromFeatures(features: string[]) {
  if (features.length === 0) {
    return [];
  }

  return features.map((feature) => ({
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        marks: [],
        text: feature,
      },
    ],
    listItem: "bullet",
    level: 1,
  }));
}

function createBaseDocument(
  asin: string,
  documentType: ProductDocumentType,
  amazonProduct: NonNullable<Awaited<ReturnType<typeof getProductByAsin>>>,
  now: string,
): ImportDocument {
  const title = normalizeImportedTitle(amazonProduct.title, asin);
  const slug = slugify(title || asin) || asin.toLowerCase();
  const amazonLink = amazonProduct.url ?? "";
  const excerpt = `Imported from Amazon. Add your editorial summary for ${title}.`;
  const descriptionBlocks = buildPortableTextFromFeatures(amazonProduct.features);

  const amazonData = {
    asin,
    title: amazonProduct.title,
    detailPageUrl: amazonProduct.url,
    imageUrl: amazonProduct.imageUrl,
    price: amazonProduct.price,
    rating: amazonProduct.rating,
    syncStatus: "synced" as const,
    lastSyncedAt: now,
    lastError: undefined,
    source: "creatorsapi" as const,
  };

  if (documentType === "productReview") {
    return {
      _id: buildDraftId(documentType, asin),
      _type: documentType,
      title,
      slug: { _type: "slug", current: slug },
      amazonLink,
      excerpt,
      pros: [],
      cons: [],
      review: [],
      featured: false,
      publishedAt: now,
      amazon: amazonData,
    };
  }

  return {
    _id: buildDraftId(documentType, asin),
    _type: documentType,
    title,
    slug: { _type: "slug", current: slug },
    amazonLink,
    excerpt,
    description: descriptionBlocks,
    featured: false,
    publishedAt: now,
    amazon: amazonData,
  };
}

function buildUpdatePatch(
  existing: ExistingProductDocument,
  asin: string,
  amazonProduct: NonNullable<Awaited<ReturnType<typeof getProductByAsin>>>,
  now: string,
) {
  const normalizedTitle = normalizeImportedTitle(amazonProduct.title, asin);
  const descriptionBlocks = buildPortableTextFromFeatures(amazonProduct.features);
  const shouldRefreshImportedTitle =
    !existing.title || existing.title === existing.amazon?.title;
  const nextTitle = shouldRefreshImportedTitle
    ? normalizedTitle
    : existing.title ?? normalizedTitle;

  return {
    title: nextTitle,
    slug:
      existing.slug?.current
        ? existing.slug
        : {
            _type: "slug",
            current: slugify(normalizedTitle || asin) || asin.toLowerCase(),
          },
    amazonLink: amazonProduct.url ?? existing.amazonLink ?? "",
    excerpt:
      existing.excerpt ||
      `Imported from Amazon. Add your editorial summary for ${normalizedTitle || asin}.`,
    ...(
      existing._type === "productRecommendation" &&
      (!Array.isArray(existing.description) || existing.description.length === 0) &&
      descriptionBlocks.length > 0
        ? { description: descriptionBlocks }
        : {}
    ),
    publishedAt: existing.publishedAt || now,
    featured: existing.featured ?? false,
    amazon: {
      asin,
      title: amazonProduct.title,
      detailPageUrl: amazonProduct.url,
      imageUrl: amazonProduct.imageUrl,
      price: amazonProduct.price,
      rating: amazonProduct.rating,
      syncStatus: "synced" as const,
      lastSyncedAt: now,
      lastError: undefined,
      source: "creatorsapi" as const,
    },
  };
}

export async function importAmazonProductToSanity(input: {
  asin: string;
  documentType?: ProductDocumentType;
}): Promise<AmazonImportResult> {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new AmazonSanityImportError(
      "Missing SANITY_API_WRITE_TOKEN for Amazon imports.",
      500,
      "CONFIG_ERROR",
    );
  }

  const asin = input.asin.trim().toUpperCase();
  if (!asin) {
    throw new AmazonSanityImportError(
      "ASIN is required.",
      400,
      "VALIDATION_ERROR",
    );
  }

  let amazonProduct;

  try {
    amazonProduct = await getProductByAsin(asin);
  } catch (error) {
    if (error instanceof AmazonCreatorsError) {
      throw new AmazonSanityImportError(
        error.message,
        error.status,
        error.code,
      );
    }

    throw error;
  }

  if (!amazonProduct) {
    throw new AmazonSanityImportError(
      `No Amazon product found for ASIN ${asin}.`,
      404,
      "NOT_FOUND",
    );
  }

  const now = new Date().toISOString();
  const existingDocuments = await findExistingProductsByAsin(asin);
  const existing = pickExistingDocument(existingDocuments);

  if (existing) {
    const patch = buildUpdatePatch(existing, asin, amazonProduct, now);
    const targetId = getDraftDocumentId(existing._id);
    const baseDocument = {
      ...stripSystemFields(existing),
      ...patch,
      _id: targetId,
      _type: existing._type,
    };

    await writeClient.createOrReplace(baseDocument);

    return {
      documentId: targetId,
      mode: "updated",
      documentType: existing._type,
      asin,
      title: patch.title,
      syncStatus: "synced",
      lastSyncedAt: now,
    };
  }

  const documentType = input.documentType ?? "productRecommendation";
  const document: ImportDocument = createBaseDocument(
    asin,
    documentType,
    amazonProduct,
    now,
  );
  const created = await writeClient.create(document);

  return {
    documentId: created._id,
    mode: "created",
    documentType,
    asin,
    title: document.title,
    syncStatus: "synced",
    lastSyncedAt: now,
  };
}
