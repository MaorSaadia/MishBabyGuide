import { NextRequest, NextResponse } from "next/server";

import {
  AmazonCreatorsError,
  assertAmazonTestSecret,
} from "@/lib/amazon-creators";

export const dynamic = "force-dynamic";

function getRequestSecret(request: NextRequest) {
  return (
    request.headers.get("x-amazon-test-secret") ??
    request.nextUrl.searchParams.get("secret")
  );
}

function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function maskValue(value: string | undefined, visible = 4) {
  if (!value) {
    return null;
  }

  if (value.length <= visible * 2) {
    return `${value.slice(0, 1)}***${value.slice(-1)}`;
  }

  return `${value.slice(0, visible)}***${value.slice(-visible)}`;
}

async function fetchAmazonToken() {
  const clientId = readEnv("AMAZON_CREATORS_CLIENT_ID") ?? readEnv("CREDENTIAL_ID");
  const clientSecret =
    readEnv("AMAZON_CREATORS_CLIENT_SECRET") ?? readEnv("SECRET_AMAZON_KEY");
  const version = readEnv("AMAZON_CREATORS_API_VERSION") ?? readEnv("VERSION");

  if (!clientId || !clientSecret || !version) {
    throw new AmazonCreatorsError(
      "Missing Amazon credential environment variables.",
      500,
      "CONFIG_ERROR",
    );
  }

  const tokenEndpoint =
    version === "3.2"
      ? "https://api.amazon.co.uk/auth/o2/token"
      : version === "3.3"
        ? "https://api.amazon.co.jp/auth/o2/token"
        : "https://api.amazon.com/auth/o2/token";

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: version.startsWith("3.") ? "creatorsapi::default" : "creatorsapi/default",
    }),
  });

  const body = (await response.json().catch(() => null)) as
    | {
        access_token?: string;
        token_type?: string;
        expires_in?: number;
        [key: string]: unknown;
      }
    | null;

  return {
    ok: response.ok,
    status: response.status,
    tokenEndpoint,
    body,
  };
}

async function fetchAmazonItem(input: { asin: string; token: string }) {
  const marketplace = readEnv("AMAZON_CREATORS_MARKETPLACE");
  const partnerTag = readEnv("AMAZON_CREATORS_PARTNER_TAG");
  const apiBasePath =
    readEnv("AMAZON_CREATORS_API_BASE_PATH") ?? "https://creatorsapi.amazon";

  if (!marketplace || !partnerTag) {
    throw new AmazonCreatorsError(
      "Missing Amazon marketplace or partner tag environment variables.",
      500,
      "CONFIG_ERROR",
    );
  }

  const response = await fetch(`${apiBasePath.replace(/\/+$/, "")}/catalog/v1/getItems`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${input.token}`,
      "x-marketplace": marketplace,
    },
    body: JSON.stringify({
      partnerTag,
      itemIds: [input.asin],
      resources: [
        "images.primary.large",
        "images.primary.medium",
        "itemInfo.title",
        "offersV2.listings.price",
        "customerReviews.starRating",
      ],
    }),
  });

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  return {
    ok: response.ok,
    status: response.status,
    apiBasePath,
    marketplace,
    partnerTag,
    body,
  };
}

export async function GET(request: NextRequest) {
  try {
    assertAmazonTestSecret(getRequestSecret(request));

    const asin = request.nextUrl.searchParams.get("asin") ?? "B087JHJ997";
    const tokenResult = await fetchAmazonToken();
    const accessToken =
      tokenResult.body && "access_token" in tokenResult.body
        ? tokenResult.body.access_token
        : undefined;

    const itemResult = accessToken
      ? await fetchAmazonItem({ asin, token: accessToken })
      : null;

    return NextResponse.json(
      {
        success: true,
        asin,
        env: {
          clientId: maskValue(
            readEnv("AMAZON_CREATORS_CLIENT_ID") ?? readEnv("CREDENTIAL_ID"),
          ),
          clientSecret: maskValue(
            readEnv("AMAZON_CREATORS_CLIENT_SECRET") ?? readEnv("SECRET_AMAZON_KEY"),
          ),
          version: readEnv("AMAZON_CREATORS_API_VERSION") ?? readEnv("VERSION") ?? null,
          marketplace: readEnv("AMAZON_CREATORS_MARKETPLACE") ?? null,
          partnerTag: readEnv("AMAZON_CREATORS_PARTNER_TAG") ?? null,
          apiBasePath:
            readEnv("AMAZON_CREATORS_API_BASE_PATH") ?? "https://creatorsapi.amazon",
        },
        tokenCheck: {
          ok: tokenResult.ok,
          status: tokenResult.status,
          tokenEndpoint: tokenResult.tokenEndpoint,
          body: tokenResult.body
            ? {
                ...tokenResult.body,
                access_token:
                  typeof tokenResult.body.access_token === "string"
                    ? maskValue(tokenResult.body.access_token, 8)
                    : null,
              }
            : null,
        },
        itemCheck: itemResult
          ? {
              ok: itemResult.ok,
              status: itemResult.status,
              apiBasePath: itemResult.apiBasePath,
              marketplace: itemResult.marketplace,
              partnerTag: itemResult.partnerTag,
              body: itemResult.body,
            }
          : null,
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
        error:
          error instanceof Error ? error.message : "Unexpected Amazon debug error.",
      },
      { status: 500 },
    );
  }
}
