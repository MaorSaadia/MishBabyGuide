import "server-only";

import {
  AmazonCreatorsError,
  searchProductsWithMetadata,
  type AmazonCreatorsProduct,
} from "@/lib/amazon-creators";

export type LiveAmazonProduct = AmazonCreatorsProduct;

export type LiveAmazonSearchResult = {
  query: string;
  itemCount: number;
  itemPage: number;
  totalResultCount: number | null;
  hasMore: boolean;
  fetchedAt: string;
  products: LiveAmazonProduct[];
};

const DEFAULT_ITEM_COUNT = 10;
const MAX_ITEM_COUNT = 10;
const MIN_ITEM_PAGE = 1;
const MAX_ITEM_PAGE = 10;
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

  return Math.min(Math.max(Math.floor(itemCount), 1), MAX_ITEM_COUNT);
}

export function normalizeLiveAmazonItemPage(itemPage?: number) {
  if (!itemPage || Number.isNaN(itemPage)) {
    return MIN_ITEM_PAGE;
  }

  return Math.min(Math.max(Math.floor(itemPage), MIN_ITEM_PAGE), MAX_ITEM_PAGE);
}

export async function searchLiveAmazonProducts(input: {
  query: string;
  itemCount?: number;
  itemPage?: number;
}): Promise<LiveAmazonSearchResult> {
  const query = validateLiveAmazonQuery(input.query);
  const itemCount = normalizeLiveAmazonItemCount(input.itemCount);
  const itemPage = normalizeLiveAmazonItemPage(input.itemPage);
  const result = await searchProductsWithMetadata({
    keywords: query,
    itemCount,
    itemPage,
  });
  const loadedCount = itemPage * itemCount;
  const hasKnownMore =
    typeof result.totalResultCount === "number" &&
    loadedCount < result.totalResultCount;
  const hasPossibleMore =
    result.totalResultCount === null &&
    result.products.length >= itemCount &&
    itemPage < MAX_ITEM_PAGE;

  return {
    query,
    itemCount,
    itemPage,
    totalResultCount: result.totalResultCount,
    hasMore: itemPage < MAX_ITEM_PAGE && (hasKnownMore || hasPossibleMore),
    fetchedAt: new Date().toISOString(),
    products: result.products,
  };
}
