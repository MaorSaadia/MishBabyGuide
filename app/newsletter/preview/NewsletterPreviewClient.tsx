"use client";

import { useState } from "react";
import { toast } from "sonner";

interface NewsletterContent {
  products: Array<{ title: string }>;
  date: string;
}

interface NewsletterPreviewClientProps {
  content: NewsletterContent;
  emailHtml: string;
}

export default function NewsletterPreviewClient({
  content,
  emailHtml,
}: NewsletterPreviewClientProps) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/newsletter/send-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send test email");
      }

      toast.success("Test email sent successfully!", {
        description: `Sent to ${email}`,
        duration: 4000,
      });
      setEmail("");
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email", {
        description:
          error instanceof Error ? error.message : "Please try again",
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">Newsletter Preview</h1>
          <p className="mb-4 text-gray-600">
            This is how your product-focused weekly newsletter will look when
            sent.
          </p>

          <div className="mb-4 rounded-lg bg-gray-50 p-4">
            <h2 className="mb-2 font-semibold">Content Summary:</h2>
            <ul className="space-y-1 text-sm">
              <li>Products: {content.products.length}</li>
              <li>Date: {content.date}</li>
            </ul>
          </div>

          <form onSubmit={handleSendTest} className="mb-4">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isSending}
                className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSending}
                className="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSending ? "Sending..." : "Send Test Email"}
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
        </div>
      </div>
    </div>
  );
}
