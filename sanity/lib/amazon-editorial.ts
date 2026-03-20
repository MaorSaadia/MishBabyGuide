export const PRODUCT_DOCUMENT_TYPES = [
  "productRecommendation",
  "productReview",
] as const;

export type ProductDocumentType = (typeof PRODUCT_DOCUMENT_TYPES)[number];

type ProductDocument = {
  _id?: string;
  _type?: string;
  title?: string;
  slug?: { current?: string };
  mainImage?: unknown;
  category?: unknown;
  excerpt?: string;
  description?: unknown[];
  review?: unknown[];
  pros?: string[];
  amazon?: {
    asin?: string;
    syncStatus?: "pending" | "synced" | "error";
    lastSyncedAt?: string;
    lastError?: string;
    source?: string;
  };
};

const PRODUCT_LABELS: Record<ProductDocumentType, string> = {
  productRecommendation: "Product recommendation",
  productReview: "Product review",
};

const EDITORIAL_FIELDS: Record<
  ProductDocumentType,
  Array<{ path: keyof ProductDocument; label: string }>
> = {
  productRecommendation: [
    { path: "slug", label: "Slug" },
    { path: "mainImage", label: "Main image" },
    { path: "category", label: "Category" },
    { path: "excerpt", label: "Short summary" },
    { path: "description", label: "Description" },
  ],
  productReview: [
    { path: "slug", label: "Slug" },
    { path: "mainImage", label: "Main image" },
    { path: "category", label: "Category" },
    { path: "excerpt", label: "Short summary" },
    { path: "pros", label: "Pros" },
    { path: "review", label: "Full review" },
  ],
};

export function isProductDocumentType(
  value: string | undefined,
): value is ProductDocumentType {
  return PRODUCT_DOCUMENT_TYPES.includes(value as ProductDocumentType);
}

export function isAmazonImportedDocument(document: ProductDocument | null | undefined) {
  return Boolean(document?.amazon?.asin);
}

function hasValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return Boolean(value);
}

export function getEditorialMissingFieldLabels(
  document: ProductDocument | null | undefined,
) {
  if (!document?._type || !isProductDocumentType(document._type)) {
    return [];
  }

  return EDITORIAL_FIELDS[document._type]
    .filter(({ path }) => !hasValue(document[path]))
    .map((field) => field.label);
}

export function getProductDocumentLabel(documentType: ProductDocumentType) {
  return PRODUCT_LABELS[documentType];
}

export function buildEditorialWarning(fieldTitle: string) {
  return `${fieldTitle} is still required before this Amazon import can be published.`;
}
