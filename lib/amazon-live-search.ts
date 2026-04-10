import "server-only";

import {
  AmazonCreatorsError,
  searchProducts as searchAmazonCreatorsProducts,
  type AmazonCreatorsProduct,
} from "@/lib/amazon-creators";

export type LiveAmazonProduct = AmazonCreatorsProduct;

export type LiveAmazonSearchResult = {
  query: string;
  itemCount: number;
  fetchedAt: string;
  products: LiveAmazonProduct[];
};

const DEFAULT_ITEM_COUNT = 12;
const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 80;

function normalizeQuery(query: string) {
  return query.replace(/\s+/g, " ").trim();
}

export function validateLiveAmazonQuery(query: string) {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    throw new AmazonCreatorsError(
      "Enter a product keyword to search Amazon.",
      400,
      "VALIDATION_ERROR",
    );
  }

  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    throw new AmazonCreatorsError(
      `Search must be at least ${MIN_QUERY_LENGTH} characters.`,
      400,
      "VALIDATION_ERROR",
    );
  }

  if (normalizedQuery.length > MAX_QUERY_LENGTH) {
    throw new AmazonCreatorsError(
      `Search must be ${MAX_QUERY_LENGTH} characters or less.`,
      400,
      "VALIDATION_ERROR",
    );
  }

  return normalizedQuery;
}

export function normalizeLiveAmazonItemCount(itemCount?: number) {
  if (!itemCount || Number.isNaN(itemCount)) {
    return DEFAULT_ITEM_COUNT;
  }

  return Math.min(Math.max(Math.floor(itemCount), 1), DEFAULT_ITEM_COUNT);
}

export async function searchLiveAmazonProducts(input: {
  query: string;
  itemCount?: number;
}): Promise<LiveAmazonSearchResult> {
  const query = validateLiveAmazonQuery(input.query);
  const itemCount = normalizeLiveAmazonItemCount(input.itemCount);
  const products = await searchAmazonCreatorsProducts({
    keywords: query,
    itemCount,
  });

  return {
    query,
    itemCount,
    fetchedAt: new Date().toISOString(),
    products,
  };
}
