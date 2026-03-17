"use client";

import { useState } from "react";
import { SyncIcon } from "@sanity/icons";
import type { DocumentActionComponent } from "sanity";

import { isAmazonImportedDocument } from "@/sanity/lib/amazon-editorial";

export const AmazonReSyncAction: DocumentActionComponent = (props) => {
  const [isSyncing, setIsSyncing] = useState(false);

  if (
    !(
      props.type === "productRecommendation" || props.type === "productReview"
    ) ||
    !isAmazonImportedDocument(props.draft ?? props.published)
  ) {
    return null;
  }

  return {
    label: isSyncing ? "Syncing Amazon..." : "Re-sync Amazon",
    icon: SyncIcon,
    tone: "primary",
    disabled: isSyncing,
    onHandle: async () => {
      setIsSyncing(true);

      try {
        const response = await fetch("/api/studio/amazon/import", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            documentId: props.id,
          }),
        });

        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(data.error || "Amazon sync failed.");
        }
      } catch (error) {
        window.alert(
          error instanceof Error ? error.message : "Amazon sync failed.",
        );
      } finally {
        setIsSyncing(false);
        props.onComplete();
      }
    },
  };
};

export const amazonReSyncAction = AmazonReSyncAction;
