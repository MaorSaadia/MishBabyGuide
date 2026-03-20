import type { DocumentBadgeComponent } from "sanity";

import {
  getEditorialMissingFieldLabels,
  isAmazonImportedDocument,
  isProductDocumentType,
} from "@/sanity/lib/amazon-editorial";

type ProductBadgeDocument = {
  _type?: string;
  amazon?: {
    syncStatus?: "pending" | "synced" | "error";
    lastError?: string;
    lastSyncedAt?: string;
  };
};

export const amazonSourceBadge: DocumentBadgeComponent = ({ draft, published }) => {
  const document = (draft ?? published) as ProductBadgeDocument | null;

  if (!isProductDocumentType(document?._type)) {
    return null;
  }

  return {
    label: isAmazonImportedDocument(document) ? "Amazon import" : "Manual entry",
    color: isAmazonImportedDocument(document) ? "success" : "primary",
    title: isAmazonImportedDocument(document)
      ? "This document was created from Amazon product data."
      : "This document was created manually in Studio.",
  };
};

export const editorialReadinessBadge: DocumentBadgeComponent = ({
  draft,
  published,
}) => {
  const document = (draft ?? published) as ProductBadgeDocument | null;

  if (!isAmazonImportedDocument(document)) {
    return null;
  }

  const missingFields = getEditorialMissingFieldLabels(document);

  if (missingFields.length === 0) {
    return {
      label: "Editorial ready",
      color: "success",
      title: "Required editorial fields are complete.",
    };
  }

  return {
    label: `Needs editorial work (${missingFields.length})`,
    color: "warning",
    title: `Missing: ${missingFields.join(", ")}`,
  };
};

export const amazonSyncBadge: DocumentBadgeComponent = ({ draft, published }) => {
  const document = (draft ?? published) as ProductBadgeDocument | null;
  const status = document?.amazon?.syncStatus;

  if (!isAmazonImportedDocument(document) || !status) {
    return null;
  }

  if (status === "error") {
    return {
      label: "Sync error",
      color: "danger",
      title: document?.amazon?.lastError || "The last Amazon sync failed.",
    };
  }

  if (status === "pending") {
    return {
      label: "Syncing Amazon",
      color: "warning",
      title: "Amazon data refresh is in progress.",
    };
  }

  return {
    label: "Amazon synced",
    color: "success",
    title: document?.amazon?.lastSyncedAt
      ? `Last synced ${document.amazon.lastSyncedAt}`
      : "Amazon data is up to date.",
  };
};
