"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

// Extract the component that uses useSearchParams
function UnsubscribeContent() {
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
    <div
      className="
        min-h-screen 
        bg-linear-to-br from-gray-50 to-gray-100 
        dark:from-gray-900 dark:to-gray-950 
        flex items-center justify-center p-4
      "
    >
      <div
        className="
          max-w-md w-full 
          bg-white dark:bg-gray-900 
          rounded-2xl shadow-xl p-8 space-y-6
          text-gray-900 dark:text-gray-100
        "
      >
        {/* Icon */}
        <div className="flex justify-center">
          {status === "success" ? (
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          ) : status === "error" ? (
            <XCircle className="w-16 h-16 text-red-500" />
          ) : (
            <Mail className="w-16 h-16 text-blue-500" />
          )}
        </div>

        {/* Content based on status */}
        {status === "idle" && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Unsubscribe from Newsletter
              </h1>
              {email && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Email: {email}
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-300">
                We&apos;re sorry to see you go! Click the button below to
                unsubscribe from our weekly newsletter.
              </p>
            </div>

            <button
              onClick={handleUnsubscribe}
              disabled={isUnsubscribing || !token}
              className="
                w-full 
                bg-red-500 hover:bg-red-600 
                disabled:bg-gray-300 disabled:cursor-not-allowed 
                text-white font-semibold py-3 px-6 rounded-lg 
                transition-colors duration-200 flex items-center justify-center gap-2
              "
            >
              {isUnsubscribing && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUnsubscribing ? "Unsubscribing..." : "Confirm Unsubscribe"}
            </button>

            <div className="text-center">
              <Link
                href="/"
                className="
                  text-sm 
                  text-blue-600 hover:text-blue-700 
                  dark:text-blue-400 dark:hover:text-blue-300 
                  hover:underline
                "
              >
                Changed your mind? Go back to homepage
              </Link>
            </div>
          </>
        )}

        {status === "loading" && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Processing...
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we unsubscribe you from our newsletter.
              </p>
            </div>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Successfully Unsubscribed
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                You&apos;ve been unsubscribed from our newsletter. You
                won&apos;t receive any more emails from us.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Changed your mind? You can always resubscribe on our website.
              </p>
            </div>

            <Link
              href="/"
              className="
                block w-full 
                bg-blue-500 hover:bg-blue-600 
                text-white font-semibold py-3 px-6 rounded-lg 
                transition-colors duration-200 text-center
              "
            >
              Return to Homepage
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Unsubscribe Failed
              </h1>
              <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
            </div>

            <div className="space-y-3">
              {token && (
                <button
                  onClick={handleUnsubscribe}
                  disabled={isUnsubscribing}
                  className="
                    w-full 
                    bg-red-500 hover:bg-red-600 
                    disabled:bg-gray-300 
                    text-white font-semibold py-3 px-6 rounded-lg 
                    transition-colors duration-200
                  "
                >
                  Try Again
                </button>
              )}

              <Link
                href="/"
                className="
                  block w-full 
                  bg-gray-200 hover:bg-gray-300 
                  dark:bg-gray-800 dark:hover:bg-gray-700 
                  text-gray-800 dark:text-gray-100 
                  font-semibold py-3 px-6 rounded-lg 
                  transition-colors duration-200 text-center
                "
              >
                Return to Homepage
              </Link>
            </div>
          </>
        )}

        {/* Feedback Section */}
        {status === "success" && (
          <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
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
                  onClick={() => {
                    toast.success("Thank you for your feedback!");
                    // You can send this to an analytics endpoint
                  }}
                  className="
                    px-4 py-2 text-sm 
                    bg-gray-100 hover:bg-gray-200 
                    dark:bg-gray-800 dark:hover:bg-gray-700 
                    text-gray-700 dark:text-gray-200 
                    rounded-full transition-colors duration-200
                  "
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap the content in Suspense
export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div
          className="
            min-h-screen 
            bg-linear-to-br from-gray-50 to-gray-100 
            dark:from-gray-900 dark:to-gray-950 
            flex items-center justify-center
          "
        >
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
