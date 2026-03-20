"use client";

import { useState } from "react";
import { DownloadIcon, EditIcon } from "@sanity/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  Flex,
  Heading,
  Select,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
import { getPublishedId } from "sanity";
import { useRouter } from "sanity/router";

import {
  getProductDocumentLabel,
  type ProductDocumentType,
} from "@/sanity/lib/amazon-editorial";

type ImportResult = {
  success: true;
  documentId: string;
  asin: string;
  mode: "created" | "updated";
  documentType: ProductDocumentType;
  title: string;
  syncStatus: "synced";
  lastSyncedAt: string;
};

type ImportError = {
  error: string;
};

function isImportError(data: ImportResult | ImportError): data is ImportError {
  return "error" in data;
}

const DOCUMENT_TYPE_OPTIONS: ProductDocumentType[] = [
  "productRecommendation",
  "productReview",
];

export default function AmazonImportTool() {
  const router = useRouter();
  const [asin, setAsin] = useState("");
  const [documentType, setDocumentType] =
    useState<ProductDocumentType>("productRecommendation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleImport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/studio/amazon/import", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          asin: asin.trim().toUpperCase(),
          documentType,
        }),
      });

      const data = (await response.json()) as ImportResult | ImportError;

      if (!response.ok || isImportError(data)) {
        throw new Error(isImportError(data) ? data.error : "Amazon import failed.");
      }

      setResult(data);
      setAsin("");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Amazon import failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function openImportedDocument() {
    if (!result) {
      return;
    }

    router.navigateIntent("edit", {
      id: getPublishedId(result.documentId),
      type: result.documentType,
    });
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1} tone="transparent">
          <Stack space={3}>
            <Flex align="center" gap={3}>
              <DownloadIcon />
              <Heading size={1}>Amazon Product Import</Heading>
            </Flex>
            <Text muted size={1}>
              Import a single Amazon product as a draft, then finish the
              editorial fields before publishing.
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} shadow={1}>
          <form onSubmit={handleImport}>
            <Stack space={4}>
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  Product type
                </Text>
                <Select
                  value={documentType}
                  onChange={(event) =>
                    setDocumentType(event.currentTarget.value as ProductDocumentType)
                  }
                >
                  {DOCUMENT_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {getProductDocumentLabel(option)}
                    </option>
                  ))}
                </Select>
              </Stack>

              <Stack space={2}>
                <Text size={1} weight="semibold">
                  Amazon ASIN
                </Text>
                <TextInput
                  value={asin}
                  onChange={(event) => setAsin(event.currentTarget.value)}
                  placeholder="B000123456"
                />
                <Text muted size={1}>
                  Amazon-backed fields stay machine-managed in the Amazon Sync
                  tab after import.
                </Text>
              </Stack>

              <Button
                disabled={isSubmitting || asin.trim().length === 0}
                icon={DownloadIcon}
                text={isSubmitting ? "Importing..." : "Import draft"}
                tone="primary"
                type="submit"
              />
            </Stack>
          </form>
        </Card>

        {error ? (
          <Card padding={4} radius={3} shadow={1} tone="critical">
            <Text size={1}>{error}</Text>
          </Card>
        ) : null}

        {result ? (
          <Card padding={4} radius={3} shadow={1} tone="positive">
            <Stack space={3}>
              <Flex align="center" gap={3} wrap="wrap">
                <Badge tone="positive">
                  {result.mode === "created" ? "Draft created" : "Draft refreshed"}
                </Badge>
                <Badge>{result.asin}</Badge>
                <Badge>{getProductDocumentLabel(result.documentType)}</Badge>
              </Flex>
              <Text size={1}>{result.title}</Text>
              <Code size={1}>{result.documentId}</Code>
              <Button
                icon={EditIcon}
                mode="ghost"
                text="Open document"
                onClick={openImportedDocument}
              />
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </Box>
  );
}
