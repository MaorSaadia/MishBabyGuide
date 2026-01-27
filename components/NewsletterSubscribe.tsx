// components/NewsletterSubscribe.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Sparkles, CheckCircle2 } from "lucide-react";

interface NewsletterSubscribeProps {
  variant?: "default" | "compact";
  className?: string;
}

export default function NewsletterSubscribe({
  variant = "default",
  className = "",
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      toast.success("Successfully subscribed! 🎉", {
        description: "Check your email to confirm your subscription",
        duration: 5000,
      });
      setEmail("");
      setIsSubscribed(true);

      // Reset success state after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe", {
        description:
          error instanceof Error ? error.message : "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (variant === "compact") {
    return (
      <div
        className={`bg-linear-to-r from-sky-50 to-cyan-50 dark:from-sky-900/30 dark:to-cyan-900/30 rounded-xl p-6 border border-sky-200 dark:border-sky-800 ${className}`}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-sky-100 dark:bg-sky-800 rounded-full">
            <Mail className="h-6 w-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Weekly Newsletter
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Get 10 product picks + 2 reviews in your inbox every week
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isSubscribing || isSubscribed}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
              <button
                type="submit"
                disabled={isSubscribing || isSubscribed}
                className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubscribing ? "..." : isSubscribed ? "✓" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-linear-to-br from-sky-50 via-cyan-50 to-blue-50 dark:from-sky-900 dark:via-cyan-900 dark:to-blue-900 rounded-2xl p-8 md:p-12 border border-sky-200 dark:border-sky-700 shadow-lg ${className}`}
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 dark:bg-sky-800 rounded-full mb-6">
          <Mail className="h-8 w-8 text-sky-600 dark:text-sky-400" />
        </div>

        {/* Heading */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full mb-4 shadow-sm">
            <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
              Free Weekly Newsletter
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get the Best Baby Products in Your Inbox
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Every week, we curate the top 10 baby products, share 2 detailed
            reviews, and include 1 helpful parenting article - all delivered to
            your inbox.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shadow-sm">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              10 Product Picks
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Curated recommendations
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shadow-sm">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              2 In-Depth Reviews
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Honest & detailed
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shadow-sm">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              1 Parenting Article
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Expert tips & guides
            </p>
          </div>
        </div>

        {/* Subscription Form */}
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isSubscribing || isSubscribed}
              className="flex-1 px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700 shadow-sm"
            />
            <button
              type="submit"
              disabled={isSubscribing || isSubscribed}
              className="px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isSubscribing ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Subscribing...
                </>
              ) : isSubscribed ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Subscribed!
                </>
              ) : (
                "Subscribe Free"
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </form>
      </div>
    </div>
  );
}
