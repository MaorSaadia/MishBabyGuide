"use client";

import { useState } from "react";
import { toast } from "sonner";

interface NewsletterContent {
  products: Array<{ title: string }>;
  reviews: Array<{ title: string }>;
  blogPost: { title: string } | null;
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

      toast.success("Test email sent successfully! 📧", {
        description: `Sent to ${email}`,
        duration: 4000,
      });
      setEmail(""); // Clear input on success
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Newsletter Preview</h1>
          <p className="text-gray-600 mb-4">
            This is how your newsletter will look when sent.
          </p>

          {/* Content Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h2 className="font-semibold mb-2">Content Summary:</h2>
            <ul className="space-y-1 text-sm">
              <li>📦 Products: {content.products.length}</li>
              <li>⭐ Reviews: {content.reviews.length}</li>
              <li>📝 Blog Post: {content.blogPost ? "✓" : "✗"}</li>
              <li>📅 Date: {content.date}</li>
            </ul>
          </div>

          {/* Send Test Email Form */}
          <form onSubmit={handleSendTest} className="mb-4">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isSending}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSending ? "Sending..." : "Send Test Email"}
              </button>
            </div>
          </form>
        </div>

        {/* Email Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
        </div>
      </div>
    </div>
  );
}
