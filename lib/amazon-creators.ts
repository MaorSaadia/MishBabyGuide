import "server-only";

import { ApiClient, DefaultApi } from "creatorsapi-nodejs-sdk";

export type AmazonCreatorsProduct = {
  asin: string | null;
  title: string | null;
  url: string | null;
  imageUrl: string | null;
  price: string | null;
  rating: number | null;
  features: string[];
};

type SearchProductsOptions = {
  keywords: string;
  searchIndex?: string;
  itemCount?: number;
};

type AmazonCreatorsConfig = {
  clientId: string;
  clientSecret: string;
  version: string;
  marketplace: string;
  partnerTag: string;
  searchIndex: string;
  apiBasePath?: string;
  authEndpoint?: string;
  testSecret: string;
  defaultTestKeywords?: string;
};

type AmazonCreatorsItem = {
  asin?: string;
  detailPageURL?: string;
  itemInfo?: {
    title?: {
      displayValue?: string;
    };
    features?: {
      displayValues?: string[];
    };
  };
  images?: {
    primary?: {
      large?: { url?: string };
      medium?: { url?: string };
      small?: { url?: string };
      hiRes?: { url?: string };
    };
  };
  offersV2?: {
    listings?: Array<{
      price?: {
        money?: {
          displayAmount?: string;
        };
      };
    }>;
  };
  customerReviews?: {
    starRating?: {
      value?: number;
    };
  };
};

type AmazonErrorPayload = Array<{
  code?: string;
  message?: string;
}>;

type SearchItemsResponse = {
  searchResult?: {
    items?: AmazonCreatorsItem[];
  };
  errors?: AmazonErrorPayload;
};

type GetItemsResponse = {
  itemsResult?: {
    items?: AmazonCreatorsItem[];
  };
  errors?: AmazonErrorPayload;
};

const DEFAULT_ITEM_RESOURCES = [
  "images.primary.large",
  "images.primary.medium",
  "itemInfo.title",
  "itemInfo.features",
  "offersV2.listings.price",
  "customerReviews.starRating",
] as const;

export class AmazonCreatorsError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.name = "AmazonCreatorsError";
    this.status = status;
    this.code = code;
  }
}

function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function getEnvWithFallback(name: string, fallbackNames: string[] = []): string | undefined {
  return getEnv(name) ?? fallbackNames.map(getEnv).find(Boolean);
}

function assertValue(value: string | undefined, errorMessage: string): string {
  if (!value) {
    throw new AmazonCreatorsError(errorMessage, 500, "CONFIG_ERROR");
  }

  return value;
}

function getConfig(): AmazonCreatorsConfig {
  return {
    clientId: assertValue(
      getEnvWithFallback("AMAZON_CREATORS_CLIENT_ID", ["CREDENTIAL_ID"]),
      "Missing Amazon credential ID. Set AMAZON_CREATORS_CLIENT_ID.",
    ),
    clientSecret: assertValue(
      getEnvWithFallback("AMAZON_CREATORS_CLIENT_SECRET", ["SECRET_AMAZON_KEY"]),
      "Missing Amazon credential secret. Set AMAZON_CREATORS_CLIENT_SECRET.",
    ),
    version: assertValue(
      getEnvWithFallback("AMAZON_CREATORS_API_VERSION", ["VERSION"]),
      "Missing Amazon credential version. Set AMAZON_CREATORS_API_VERSION.",
    ),
    marketplace: assertValue(
      getEnv("AMAZON_CREATORS_MARKETPLACE"),
      "Missing Amazon marketplace. Set AMAZON_CREATORS_MARKETPLACE.",
    ),
    partnerTag: assertValue(
      getEnv("AMAZON_CREATORS_PARTNER_TAG"),
      "Missing Amazon partner tag. Set AMAZON_CREATORS_PARTNER_TAG.",
    ),
    searchIndex: getEnv("AMAZON_CREATORS_SEARCH_INDEX") ?? "All",
    apiBasePath: getEnv("AMAZON_CREATORS_API_BASE_PATH"),
    authEndpoint: getEnv("AMAZON_CREATORS_AUTH_ENDPOINT"),
    testSecret: assertValue(
      getEnv("AMAZON_CREATORS_TEST_SECRET"),
      "Missing Amazon test route secret. Set AMAZON_CREATORS_TEST_SECRET.",
    ),
    defaultTestKeywords: getEnv("AMAZON_CREATORS_TEST_KEYWORDS"),
  };
}

function createApi() {
  const config = getConfig();
  const client = ApiClient.instance;

  client.setCredentialId(config.clientId);
  client.setCredentialSecret(config.clientSecret);
  client.setVersion(config.version);

  if (config.authEndpoint) {
    client.setAuthEndpoint(config.authEndpoint);
  }

  if (config.apiBasePath) {
    client.basePath = config.apiBasePath.replace(/\/+$/, "");
  }

  return new DefaultApi(client);
}

function normalizeItem(item: AmazonCreatorsItem): AmazonCreatorsProduct {
  return {
    asin: item.asin ?? null,
    title: item.itemInfo?.title?.displayValue ?? null,
    url: item.detailPageURL ?? null,
    imageUrl:
      item.images?.primary?.large?.url ??
      item.images?.primary?.medium?.url ??
      item.images?.primary?.small?.url ??
      item.images?.primary?.hiRes?.url ??
      null,
    price:
      item.offersV2?.listings?.[0]?.price?.money?.displayAmount ?? null,
    rating: item.customerReviews?.starRating?.value ?? null,
    features: item.itemInfo?.features?.displayValues ?? [],
  };
}

function throwIfAmazonErrors(errors: AmazonErrorPayload | undefined, fallback: string) {
  if (!errors?.length) {
    return;
  }

  const firstError = errors[0];
  throw new AmazonCreatorsError(
    firstError.message ?? fallback,
    502,
    firstError.code ?? "AMAZON_API_ERROR",
  );
}

function normalizeAmazonError(error: unknown, fallback: string) {
  if (error instanceof AmazonCreatorsError) {
    return error;
  }

  if (error && typeof error === "object") {
    const candidate = error as {
      status?: number;
      body?: {
        errors?: AmazonErrorPayload;
        message?: string;
        reason?: string;
        type?: string;
      };
      error?: {
        message?: string;
      };
      message?: string;
    };

    const apiError = candidate.body?.errors?.[0];

    return new AmazonCreatorsError(
      apiError?.message ??
        candidate.body?.message ??
        candidate.message ??
        candidate.error?.message ??
        fallback,
      candidate.status ?? 502,
      apiError?.code ?? candidate.body?.reason ?? candidate.body?.type ?? "AMAZON_API_ERROR",
    );
  }

  return new AmazonCreatorsError(fallback, 502, "AMAZON_API_ERROR");
}

export async function searchProducts(
  options: SearchProductsOptions,
): Promise<AmazonCreatorsProduct[]> {
  const config = getConfig();
  const api = createApi();

  try {
    const response = (await api.searchItems(config.marketplace, {
      searchItemsRequestContent: {
        partnerTag: config.partnerTag,
        keywords: options.keywords,
        searchIndex: options.searchIndex ?? config.searchIndex,
        itemCount: options.itemCount ?? 5,
        resources: [...DEFAULT_ITEM_RESOURCES],
      },
    })) as SearchItemsResponse;

    throwIfAmazonErrors(response.errors, "Amazon search request failed.");

    return (response.searchResult?.items ?? []).map(normalizeItem);
  } catch (error) {
    throw normalizeAmazonError(error, "Amazon search request failed.");
  }
}

export async function getProductByAsin(
  asin: string,
): Promise<AmazonCreatorsProduct | null> {
  const config = getConfig();
  const api = createApi();

  try {
    const response = (await api.getItems(config.marketplace, {
      partnerTag: config.partnerTag,
      itemIds: [asin],
      resources: [...DEFAULT_ITEM_RESOURCES],
    })) as GetItemsResponse;

    throwIfAmazonErrors(response.errors, "Amazon get item request failed.");

    const firstItem = response.itemsResult?.items?.[0];
    return firstItem ? normalizeItem(firstItem) : null;
  } catch (error) {
    throw normalizeAmazonError(error, "Amazon get item request failed.");
  }
}

export async function runAmazonCreatorsTest(input: {
  asin?: string;
  keywords?: string;
  searchIndex?: string;
  itemCount?: number;
}) {
  const config = getConfig();

  if (input.asin) {
    return {
      mode: "asin" as const,
      product: await getProductByAsin(input.asin),
    };
  }

  const keywords = input.keywords ?? config.defaultTestKeywords;

  if (!keywords) {
    throw new AmazonCreatorsError(
      "Provide an asin or keywords query, or set AMAZON_CREATORS_TEST_KEYWORDS.",
      400,
      "VALIDATION_ERROR",
    );
  }

  return {
    mode: "search" as const,
    products: await searchProducts({
      keywords,
      searchIndex: input.searchIndex,
      itemCount: input.itemCount,
    }),
  };
}

export function assertAmazonTestSecret(secret: string | null) {
  const config = getConfig();

  if (!secret || secret !== config.testSecret) {
    throw new AmazonCreatorsError("Unauthorized Amazon test request.", 401, "UNAUTHORIZED");
  }
}
