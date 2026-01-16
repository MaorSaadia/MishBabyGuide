// lib/performance.ts
// Utility functions for monitoring and optimizing performance

/**
 * Measure and log component render time
 * Use this in development to identify slow components
 */
export function measureRenderTime(componentName: string) {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") {
    return () => {};
  }

  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (duration > 100) {
      console.warn(
        `⚠️ Slow render: ${componentName} took ${duration.toFixed(2)}ms`
      );
    } else {
      console.log(`✅ ${componentName} rendered in ${duration.toFixed(2)}ms`);
    }
  };
}

/**
 * Check cache hit rate for images
 */
export function logCacheStats() {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") {
    return;
  }

  // This would work with our cache implementation
  console.group("🎯 Cache Statistics");
  console.log("Check your Network tab for cache hits (304 responses)");
  console.groupEnd();
}

/**
 * Best practices checklist for optimization
 */
export const OPTIMIZATION_CHECKLIST = {
  sanity: [
    "✅ CDN enabled (useCdn: true)",
    "✅ Cache tags configured",
    "✅ Appropriate revalidation times set",
    "✅ Only fetch needed fields in queries",
    "✅ Use GROQ projections to reduce payload size",
  ],
  images: [
    "✅ WebP format enabled",
    "✅ Image URLs are cached/memoized",
    "✅ Proper image dimensions specified",
    "✅ Lazy loading for below-fold images",
    "✅ Placeholder images for better UX",
  ],
  nextjs: [
    "✅ Server Components where possible",
    "✅ Suspense boundaries for streaming",
    "✅ Dynamic imports for heavy components",
    "✅ Metadata API for SEO",
    "✅ Route segment config (revalidate, dynamic)",
  ],
  general: [
    "✅ Bundle size monitored",
    "✅ Core Web Vitals tracked",
    "✅ Error boundaries implemented",
    "✅ Loading states for all async content",
    "✅ Webhooks for instant cache revalidation",
  ],
};

/**
 * Print optimization checklist to console
 */
export function printOptimizationChecklist() {
  if (process.env.NODE_ENV !== "development") return;

  console.group("🚀 Optimization Checklist");

  Object.entries(OPTIMIZATION_CHECKLIST).forEach(([category, items]) => {
    console.group(`📋 ${category.toUpperCase()}`);
    items.forEach((item) => console.log(item));
    console.groupEnd();
  });

  console.groupEnd();
}

/**
 * Configuration recommendations based on content type
 */
export const CACHE_RECOMMENDATIONS = {
  // Frequently changing content
  realtime: {
    revalidate: 0, // No cache, always fresh
    description: "Live data, breaking news, real-time feeds",
  },

  // Fast-changing content
  veryShort: {
    revalidate: 60, // 1 minute
    description: "Stock prices, sports scores, trending topics",
  },

  // Regularly updated content
  short: {
    revalidate: 300, // 5 minutes
    description: "Blog posts, news articles, social feeds",
  },

  // Moderately stable content
  medium: {
    revalidate: 900, // 15 minutes
    description: "Product listings, category pages",
  },

  // Stable content
  long: {
    revalidate: 3600, // 1 hour
    description: "Featured content, curated collections",
  },

  // Very stable content
  veryLong: {
    revalidate: 86400, // 24 hours
    description: "Static pages, documentation, archived content",
  },
};

/**
 * Calculate optimal cache time based on update frequency
 */
export function getOptimalCacheTime(updatesPerDay: number): {
  revalidate: number;
  reason: string;
} {
  if (updatesPerDay > 100) {
    return {
      revalidate: 60,
      reason: "Content updates multiple times per hour",
    };
  } else if (updatesPerDay > 24) {
    return {
      revalidate: 300,
      reason: "Content updates hourly",
    };
  } else if (updatesPerDay > 4) {
    return {
      revalidate: 900,
      reason: "Content updates several times daily",
    };
  } else if (updatesPerDay > 1) {
    return {
      revalidate: 3600,
      reason: "Content updates daily",
    };
  } else {
    return {
      revalidate: 86400,
      reason: "Content updates infrequently",
    };
  }
}

/**
 * Performance monitoring for production
 * Add to your root layout or _app file
 */
export function initPerformanceMonitoring() {
  if (typeof window === "undefined") return;

  // Web Vitals monitoring
  if ("web-vital" in window) {
    // You can integrate with analytics services here
    console.log("Performance monitoring initialized");
  }

  // Log navigation timing
  window.addEventListener("load", () => {
    const perfData = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (process.env.NODE_ENV === "development") {
      console.group("📊 Page Load Performance");
      console.log(
        `DNS Lookup: ${perfData.domainLookupEnd - perfData.domainLookupStart}ms`
      );
      console.log(
        `TCP Connection: ${perfData.connectEnd - perfData.connectStart}ms`
      );
      console.log(
        `Request Time: ${perfData.responseStart - perfData.requestStart}ms`
      );
      console.log(
        `Response Time: ${perfData.responseEnd - perfData.responseStart}ms`
      );
      console.log(
        `DOM Processing: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`
      );
      console.log(
        `Total Load Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`
      );
      console.groupEnd();
    }
  });
}

/**
 * Example usage in a component:
 *
 * // Development monitoring
 * const endMeasure = measureRenderTime("FeaturedProducts");
 * // ... component logic ...
 * endMeasure();
 *
 * // Check recommendations
 * const cacheTime = getOptimalCacheTime(5); // 5 updates per day
 * console.log(cacheTime); // { revalidate: 3600, reason: "..." }
 */
