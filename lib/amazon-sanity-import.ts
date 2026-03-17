import "server-only";

import { getProductByAsin } from "@/lib/amazon-creators";
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

async function findExistingProductByAsin(asin: string) {
  return writeClient.fetch<ExistingProductDocument | null>(
    `*[_type in ["productReview", "productRecommendation"] && amazon.asin == $asin][0]{
      _id,
      _type,
      title,
      slug,
      excerpt,
      description,
      review,
      pros,
      cons,
      amazonLink,
      featured,
      publishedAt
    }`,
    { asin },
  );
}

function buildDraftId(documentType: ProductDocumentType, asin: string) {
  return `drafts.${documentType}-${asin.toLowerCase()}`;
}

function createBaseDocument(
  asin: string,
  documentType: ProductDocumentType,
  amazonProduct: NonNullable<Awaited<ReturnType<typeof getProductByAsin>>>,
  now: string,
): ImportDocument {
  const title = amazonProduct.title || `Amazon Product ${asin}`;
  const slug = slugify(title || asin) || asin.toLowerCase();
  const amazonLink = amazonProduct.url ?? "";
  const excerpt = `Imported from Amazon. Add your editorial summary for ${title}.`;

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
    description: [],
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
  return {
    title: existing.title || amazonProduct.title || `Amazon Product ${asin}`,
    slug:
      existing.slug?.current
        ? existing.slug
        : {
            _type: "slug",
            current: slugify(amazonProduct.title || asin) || asin.toLowerCase(),
          },
    amazonLink: amazonProduct.url ?? existing.amazonLink ?? "",
    excerpt:
      existing.excerpt ||
      `Imported from Amazon. Add your editorial summary for ${amazonProduct.title || asin}.`,
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

  const amazonProduct = await getProductByAsin(asin);

  if (!amazonProduct) {
    throw new AmazonSanityImportError(
      `No Amazon product found for ASIN ${asin}.`,
      404,
      "NOT_FOUND",
    );
  }

  const now = new Date().toISOString();
  const existing = await findExistingProductByAsin(asin);

  if (existing) {
    const patch = buildUpdatePatch(existing, asin, amazonProduct, now);
    await writeClient.patch(existing._id).set(patch).commit();

    return {
      documentId: existing._id,
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
