// app/unsubscribe/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUnsubscribe = async () => {
    if (!token) {
      toast.error("Invalid unsubscribe link");
      return;
    }

    setIsUnsubscribing(true);
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to unsubscribe");
      }

      setStatus("success");
      toast.success("Successfully unsubscribed", {
        description: "You won't receive any more newsletters from us.",
      });
    } catch (error) {
      console.error("Unsubscribe error:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to unsubscribe. Please try again.",
      );
      toast.error("Failed to unsubscribe", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsUnsubscribing(false);
    }
  };

  // Check if token is missing
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid or missing unsubscribe token");
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {status === "success" ? (
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            ) : status === "error" ? (
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              </div>
            )}
          </div>

          {/* Content based on status */}
          {status === "idle" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                Unsubscribe from Newsletter
              </h1>
              {email && (
                <p className="text-gray-600 dark:text-gray-300 text-center mb-2">
                  Email: <span className="font-semibold">{email}</span>
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                We&apos;re sorry to see you go! Click the button below to
                unsubscribe from our weekly newsletter.
              </p>
              <button
                onClick={handleUnsubscribe}
                disabled={isUnsubscribing || !token}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              >
                {isUnsubscribing ? "Unsubscribing..." : "Confirm Unsubscribe"}
              </button>
              <Link
                href="/"
                className="block text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mt-4"
              >
                Changed your mind? Go back to homepage
              </Link>
            </>
          )}

          {status === "loading" && (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-sky-600 dark:text-sky-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                Processing...
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Please wait while we unsubscribe you from our newsletter.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                Successfully Unsubscribed
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                You&apos;ve been unsubscribed from our newsletter. You
                won&apos;t receive any more emails from us.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                  Changed your mind? You can always resubscribe on our website.
                </p>
              </div>
              <Link
                href="/"
                className="block w-full px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg text-center transition-colors shadow-md hover:shadow-lg"
              >
                Return to Homepage
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                Unsubscribe Failed
              </h1>
              <p className="text-red-600 dark:text-red-400 text-center mb-6">
                {errorMessage}
              </p>
              <div className="space-y-3">
                {token && (
                  <button
                    onClick={handleUnsubscribe}
                    disabled={isUnsubscribing}
                    className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Try Again
                  </button>
                )}
                <Link
                  href="/"
                  className="block w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg text-center transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </>
          )}

          {/* Feedback Section */}
          {status === "success" && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
                We&apos;d love to know why you&apos;re leaving (optional)
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Too many emails",
                  "Not relevant",
                  "Never signed up",
                  "Other",
                ].map((reason) => (
                  <button
                    key={reason}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      toast.success("Thank you for your feedback!");
                      // You can send this to an analytics endpoint
                    }}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help text */}
        {/* <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Need help?{" "}
          <Link
            href="/contact"
            className="text-sky-600 dark:text-sky-400 hover:underline"
          >
            Contact us
          </Link>
        </p> */}
      </div>
    </div>
  );
}
