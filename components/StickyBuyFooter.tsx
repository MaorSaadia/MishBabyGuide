"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, ShoppingCart, X } from "lucide-react";

interface StickyBuyFooterProps {
  amazonLink: string;
  productTitle: string;
  price?: string;
}

export default function StickyBuyFooter({
  amazonLink,
  productTitle,
  price,
}: StickyBuyFooterProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Desktop Footer */}
      <div className="hidden md:block bg-linear-to-r from-cyan-600 to-cyan-700 shadow-2xl border-t-4 border-cyan-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg truncate mb-1">
                {productTitle}
              </h3>
              <p className="text-cyan-100 text-sm">
                Ready to buy? Get it now on Amazon
              </p>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center gap-4">
              {price && (
                <div className="text-right">
                  <p className="text-cyan-100 text-sm">Price</p>
                  <p className="text-white font-bold text-2xl">{price}</p>
                </div>
              )}

              <Link
                href={amazonLink}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="group relative px-8 py-4 bg-white text-cyan-600 font-bold text-lg rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-linear-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Button content */}
                <div className="relative flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6" />
                  <span>Buy on Amazon</span>
                  <ExternalLink className="h-5 w-5" />
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/30 to-transparent" />
              </Link>

              {/* Dismiss Button */}
              <button
                onClick={() => setIsDismissed(true)}
                className="p-2 text-cyan-100 hover:text-white hover:bg-cyan-700/50 rounded-lg transition-all"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="md:hidden bg-white border-t-2 border-cyan-500 shadow-2xl">
        <div className="px-4 py-3">
          {/* Dismiss Button - Top Right */}
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="space-y-2 mb-3">
            <h4 className="text-sm font-semibold text-gray-900 pr-6 line-clamp-1">
              {productTitle}
            </h4>
            {price && (
              <p className="text-xl font-bold text-cyan-600">{price}</p>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href={amazonLink}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-linear-to-r from-cyan-600 to-cyan-700 text-white font-bold rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-lg active:scale-95"
          >
            <ShoppingCart className="h-5 w-5" />
            Buy on Amazon
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
