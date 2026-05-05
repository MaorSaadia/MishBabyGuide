"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, Mail, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatDateTime,
  formatWeekLabel,
  type NewsletterRecipient,
  type NewsletterRecipientSummary,
} from "@/lib/newsletter-shared";

interface NewsletterAdminDashboardProps {
  initialRecipients: NewsletterRecipient[];
  initialSummary: NewsletterRecipientSummary;
  adminEmail: string;
}

interface RecipientsApiResponse {
  recipients: NewsletterRecipient[];
  summary: NewsletterRecipientSummary;
}

interface SendRecipientApiResponse {
  success?: boolean;
  skipped?: boolean;
  email?: string;
  status?: NewsletterRecipient["weekSendStatus"];
  sentAt?: string;
  deliveryId?: string;
  message?: string;
  error?: string;
}

function SendStatusBadge({
  status,
}: {
  status: NewsletterRecipient["weekSendStatus"];
}) {
  if (status === "sent") {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
        Sent
      </Badge>
    );
  }

  if (status === "failed") {
    return (
      <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
        Failed
      </Badge>
    );
  }

  if (status === "pending") {
    return (
      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
        Pending
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
    >
      Not sent
    </Badge>
  );
}

function OpenStatusBadge({
  opened,
  openCount,
}: {
  opened: boolean;
  openCount: number;
}) {
  if (!opened) {
    return (
      <Badge
        variant="outline"
        className="border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
      >
        Not opened
      </Badge>
    );
  }

  return (
    <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300">
      Opened {openCount > 1 ? `${openCount}x` : ""}
    </Badge>
  );
}

export default function NewsletterAdminDashboard({
  initialRecipients,
  initialSummary,
  adminEmail,
}: NewsletterAdminDashboardProps) {
  const [recipients, setRecipients] = useState(initialRecipients);
  const [summary, setSummary] = useState(initialSummary);
  const [isRefreshing, startRefreshing] = useTransition();
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [previewSendingEmail, setPreviewSendingEmail] = useState<string | null>(
    null,
  );

  const weekLabel = useMemo(
    () => formatWeekLabel(summary.weekKey),
    [summary.weekKey],
  );
  const isSending = isBulkSending || Boolean(sendingEmail);
  const isBusy = isRefreshing || isSending || Boolean(previewSendingEmail);

  async function refreshRecipients() {
    const response = await fetch("/api/admin/newsletter/recipients", {
      method: "GET",
      cache: "no-store",
    });

    const data = (await response.json()) as
      | RecipientsApiResponse
      | { error?: string };

    if (!response.ok || !("recipients" in data) || !("summary" in data)) {
      throw new Error(
        "error" in data && data.error
          ? data.error
          : "Failed to refresh recipients",
      );
    }

    setRecipients(data.recipients);
    setSummary(data.summary);
  }

  function handleRefresh() {
    startRefreshing(async () => {
      try {
        await refreshRecipients();
        toast.success("Recipient list refreshed.");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to refresh data",
        );
      }
    });
  }

  async function sendRecipient(recipient: NewsletterRecipient) {
    const response = await fetch("/api/admin/newsletter/send-recipient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: recipient.email,
        userId: recipient.userId,
      }),
    });

    const data = (await response.json()) as SendRecipientApiResponse;

    if (!response.ok || !data.success) {
      throw new Error(data.error || `Failed to send to ${recipient.email}`);
    }

    setRecipients((currentRecipients) =>
      currentRecipients.map((currentRecipient) =>
        currentRecipient.userId === recipient.userId
          ? {
              ...currentRecipient,
              weekSendStatus: data.status ?? "sent",
              weekSentAt: data.sentAt ?? currentRecipient.weekSentAt,
              lastSentAt: data.sentAt ?? currentRecipient.lastSentAt,
              deliveryId: data.deliveryId ?? currentRecipient.deliveryId,
            }
          : currentRecipient,
      ),
    );

    return data;
  }

  async function handleSendRecipient(recipient: NewsletterRecipient) {
    setSendingEmail(recipient.email);

    try {
      const data = await sendRecipient(recipient);
      toast.success(data.message || `Newsletter sent to ${recipient.email}.`);
      await refreshRecipients();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send newsletter",
      );
      await refreshRecipients();
    } finally {
      setSendingEmail(null);
    }
  }

  async function handleSendWeeklyNewsletter() {
    const pendingRecipients = recipients.filter(
      (recipient) => recipient.weekSendStatus !== "sent",
    );

    if (pendingRecipients.length === 0) {
      toast.info("Everyone on the list has already been sent this week.");
      return;
    }

    setIsBulkSending(true);

    let sent = 0;
    let failed = 0;
    let skipped = 0;
    const toastId = toast.loading(
      `Sending 1 of ${pendingRecipients.length} newsletters...`,
    );

    try {
      for (let index = 0; index < pendingRecipients.length; index += 1) {
        const recipient = pendingRecipients[index];
        setSendingEmail(recipient.email);
        toast.loading(
          `Sending ${index + 1} of ${pendingRecipients.length} newsletters...`,
          {
            id: toastId,
            description: recipient.email,
          },
        );

        try {
          const data = await sendRecipient(recipient);

          if (data.skipped) {
            skipped += 1;
          } else {
            sent += 1;
          }
        } catch {
          failed += 1;
          setRecipients((currentRecipients) =>
            currentRecipients.map((currentRecipient) =>
              currentRecipient.userId === recipient.userId
                ? {
                    ...currentRecipient,
                    weekSendStatus: "failed",
                  }
                : currentRecipient,
            ),
          );
        }

        if (index < pendingRecipients.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 750));
        }
      }

      if (failed > 0) {
        toast.error("Newsletter send finished with some failures.", {
          id: toastId,
          description: `Sent: ${sent}, Failed: ${failed}, Skipped: ${skipped}`,
        });
      } else {
        toast.success("Newsletter send finished.", {
          id: toastId,
          description: `Sent: ${sent}, Skipped: ${skipped}`,
        });
      }
    } finally {
      setSendingEmail(null);
      setIsBulkSending(false);
      await refreshRecipients();
    }
  }

  function handleSendPreview(email: string) {
    setPreviewSendingEmail(email);

    void (async () => {
      try {
        const response = await fetch("/api/admin/newsletter/send-preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = (await response.json()) as {
          success?: boolean;
          message?: string;
          error?: string;
        };

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to send preview email");
        }

        toast.success(data.message || `Preview email sent to ${email}.`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to send preview",
        );
      } finally {
        setPreviewSendingEmail(null);
      }
    })();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="gap-1">
            <CardDescription>Total recipients</CardDescription>
            <CardTitle className="text-3xl">{summary.totalRecipients}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="gap-1">
            <CardDescription>Sent this week</CardDescription>
            <CardTitle className="text-3xl">{summary.sentThisWeek}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="gap-1">
            <CardDescription>Opened this week</CardDescription>
            <CardTitle className="text-3xl">{summary.openedThisWeek}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="gap-1">
            <CardDescription>Still unsent</CardDescription>
            <CardTitle className="text-3xl">{summary.unsentThisWeek}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle>Monday newsletter control</CardTitle>
            <CardDescription>
              Current week starts on {weekLabel}. Signed in as {adminEmail}.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleRefresh}
              disabled={isBusy}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
            <Button
              type="button"
              onClick={handleSendWeeklyNewsletter}
              disabled={isBusy || summary.allSentThisWeek}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {summary.allSentThisWeek
                ? "Already sent this week"
                : "Send Unsent One by One"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            The manual sender uses Supabase Auth users as the recipient list and
            skips anyone already marked as sent for this week.
          </p>
          <p>
            The bulk button sends one recipient at a time to reduce provider
            errors. You can also send or retry a single row from the table.
          </p>
          <p>
            Open tracking is counted when the email tracking pixel is loaded by
            the recipient&apos;s mail client.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recipients</CardTitle>
          <CardDescription>
            This table shows each Supabase user and the delivery state for the
            current week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">User ID</th>
                  <th className="px-3 py-3 font-medium">Joined</th>
                  <th className="px-3 py-3 font-medium">This week</th>
                  <th className="px-3 py-3 font-medium">Opened</th>
                  <th className="px-3 py-3 font-medium">Last sent</th>
                  <th className="px-3 py-3 font-medium">Last opened</th>
                  <th className="px-3 py-3 font-medium">Send</th>
                  <th className="px-3 py-3 font-medium">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {recipients.map((recipient) => (
                  <tr key={recipient.userId} className="align-top">
                    <td className="px-3 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {recipient.email}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                      {recipient.userId}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                      {formatDateTime(recipient.createdAt)}
                    </td>
                    <td className="space-y-2 px-3 py-3 text-slate-600 dark:text-slate-300">
                      <SendStatusBadge status={recipient.weekSendStatus} />
                      <div>{formatDateTime(recipient.weekSentAt)}</div>
                    </td>
                    <td className="space-y-2 px-3 py-3 text-slate-600 dark:text-slate-300">
                      <OpenStatusBadge
                        opened={recipient.weekOpened}
                        openCount={recipient.weekOpenCount}
                      />
                      <div>{formatDateTime(recipient.weekOpenedAt)}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                      {formatDateTime(recipient.lastSentAt)}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                      {formatDateTime(recipient.lastOpenedAt)}
                    </td>
                    <td className="px-3 py-3">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => void handleSendRecipient(recipient)}
                        disabled={
                          isBusy || recipient.weekSendStatus === "sent"
                        }
                      >
                        {sendingEmail === recipient.email ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        {recipient.weekSendStatus === "sent"
                          ? "Sent"
                          : "Send"}
                      </Button>
                    </td>
                    <td className="px-3 py-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendPreview(recipient.email)}
                        disabled={isBusy}
                      >
                        {previewSendingEmail === recipient.email ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                        Send Preview
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
