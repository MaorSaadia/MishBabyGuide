// components/FooterNewsletter.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, ArrowRight } from "lucide-react";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source: "footer" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      toast.success("Subscribed! 🎉", {
        description: "Check your email for a welcome message",
      });
      setEmail("");
    } catch (error) {
      toast.error("Subscription failed", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-linear-to-r from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30 -mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Text */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-full items-center justify-center shrink-0">
              <Mail className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Sign To Our Weekly Newsletter
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0 -mb-2">
                Get parenting tips, new product recommendations updates every
                week - Sign up now!
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <form onSubmit={handleSubscribe} className="w-full md:w-auto">
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isSubscribing}
                className="flex-1 md:w-64 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 text-sm"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                {isSubscribing ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Subscribe</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
