"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, Mail, RefreshCw } from "lucide-react";
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

function SendStatusBadge({
  status,
}: {
  status: NewsletterRecipient["weekSendStatus"];
}) {
  if (status === "sent") {
    return <Badge className="bg-emerald-100 text-emerald-800">Sent</Badge>;
  }

  if (status === "failed") {
    return <Badge className="bg-rose-100 text-rose-700">Failed</Badge>;
  }

  if (status === "pending") {
    return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
  }

  return (
    <Badge variant="outline" className="border-slate-300 text-slate-600">
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
      <Badge variant="outline" className="border-slate-300 text-slate-600">
        Not opened
      </Badge>
    );
  }

  return (
    <Badge className="bg-cyan-100 text-cyan-800">
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
  const [isSending, startSending] = useTransition();
  const [previewSendingEmail, setPreviewSendingEmail] = useState<string | null>(
    null,
  );

  const weekLabel = useMemo(
    () => formatWeekLabel(summary.weekKey),
    [summary.weekKey],
  );

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

  function handleSendWeeklyNewsletter() {
    startSending(async () => {
      try {
        const response = await fetch("/api/admin/newsletter/send-weekly-manual", {
          method: "POST",
        });
        const data = (await response.json()) as {
          success?: boolean;
          message?: string;
          error?: string;
          sent?: number;
          failed?: number;
        };

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to send newsletter");
        }

        toast.success(data.message || "Newsletter sent successfully.", {
          description: `Sent: ${data.sent ?? 0}, Failed: ${data.failed ?? 0}`,
        });

        await refreshRecipients();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to send newsletter",
        );
      }
    });
  }

  function handleSendPreview(email: string) {
    setPreviewSendingEmail(email);

    startSending(async () => {
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
    });
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
              disabled={isRefreshing || isSending}
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
              disabled={isSending || summary.allSentThisWeek}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {summary.allSentThisWeek
                ? "Already sent this week"
                : "Send This Week's Newsletter"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p>
            The manual sender uses Supabase Auth users as the recipient list and
            skips anyone already marked as sent for this week.
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
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">User ID</th>
                  <th className="px-3 py-3 font-medium">Joined</th>
                  <th className="px-3 py-3 font-medium">This week</th>
                  <th className="px-3 py-3 font-medium">Opened</th>
                  <th className="px-3 py-3 font-medium">Last sent</th>
                  <th className="px-3 py-3 font-medium">Last opened</th>
                  <th className="px-3 py-3 font-medium">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recipients.map((recipient) => (
                  <tr key={recipient.userId} className="align-top">
                    <td className="px-3 py-3 font-medium text-slate-900">
                      {recipient.email}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-600">
                      {recipient.userId}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {formatDateTime(recipient.createdAt)}
                    </td>
                    <td className="space-y-2 px-3 py-3 text-slate-600">
                      <SendStatusBadge status={recipient.weekSendStatus} />
                      <div>{formatDateTime(recipient.weekSentAt)}</div>
                    </td>
                    <td className="space-y-2 px-3 py-3 text-slate-600">
                      <OpenStatusBadge
                        opened={recipient.weekOpened}
                        openCount={recipient.weekOpenCount}
                      />
                      <div>{formatDateTime(recipient.weekOpenedAt)}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {formatDateTime(recipient.lastSentAt)}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {formatDateTime(recipient.lastOpenedAt)}
                    </td>
                    <td className="px-3 py-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendPreview(recipient.email)}
                        disabled={Boolean(previewSendingEmail) || isSending}
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
