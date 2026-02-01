"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Sparkles, Check } from "lucide-react";

export default function HomePageNewsletter() {
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
        body: JSON.stringify({ email, source: "homepage" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      toast.success("Welcome aboard! 🎉", {
        description: "Check your email for a special welcome message",
      });
      setEmail("");
    } catch (error) {
      toast.error("Oops! Something went wrong", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const benefits = [
    { icon: "📦", text: "10 curated products weekly" },
    { icon: "⭐", text: "2 honest, detailed reviews" },
    { icon: "📝", text: "1 helpful parenting guide" },
    { icon: "🎯", text: "Expert recommendations" },
  ];

  return (
    <section className="py-16 md:py-24 bg-linear-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950/40 dark:via-sky-950/40 dark:to-blue-950/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-200 dark:bg-cyan-800 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-200 dark:bg-sky-800 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full mb-6 shadow-sm">
              <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                Join 1,000+ Parents
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Never Miss the Best{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-sky-600 dark:from-cyan-400 dark:to-sky-400">
                Baby Products
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Get our weekly newsletter delivered straight to your inbox.
              Handpicked products, honest reviews, and expert parenting tips -
              all in one place.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg"
                >
                  <span className="text-lg">{benefit.icon}</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Subscription Form */}
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isSubscribing}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 shadow-sm text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="px-8 py-4 bg-linear-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isSubscribing ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe Free
                      <Check className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                Free forever • Unsubscribe anytime • No spam, we promise
              </p>
            </form>

            {/* Social Proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-linear-to-br from-cyan-400 to-sky-400 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {i === 1 ? "👶" : i === 2 ? "🍼" : i === 3 ? "🧸" : "👪"}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Trusted by parents
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Over 1,000 subscribers
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Visual/Mockup */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Email preview mockup */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  {/* Email header mockup */}
                  <div className="bg-linear-to-r from-cyan-500 to-sky-500 rounded-lg p-6 text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-full mb-3"></div>
                    <h3 className="font-bold text-lg">MishBabyGuide</h3>
                    <p className="text-sm opacity-90">
                      Your Weekly Baby Product Picks
                    </p>
                  </div>

                  {/* Content preview */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded w-full"></div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded w-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Footer mockup */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                <span className="text-2xl">📧</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
