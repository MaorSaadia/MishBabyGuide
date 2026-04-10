import Link from "next/link";
import { Search, Sparkles } from "lucide-react";

type LiveAmazonSearchFormProps = {
  defaultValue?: string;
};

const popularSearches = [
  "baby monitor",
  "stroller",
  "diaper bag",
  "high chair",
];

export default function LiveAmazonSearchForm({
  defaultValue = "",
}: LiveAmazonSearchFormProps) {
  return (
    <div className="w-full">
      <form action="/shop" method="GET" className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-700 dark:text-cyan-300" />
          <input
            type="search"
            name="q"
            defaultValue={defaultValue}
            placeholder="Search Amazon baby products"
            minLength={2}
            maxLength={80}
            className="w-full rounded-2xl border border-cyan-200 bg-white/90 py-4 pl-12 pr-32 text-base text-gray-900 shadow-lg shadow-cyan-950/5 outline-none ring-0 transition focus:border-cyan-400 dark:border-cyan-900 dark:bg-gray-900/90 dark:text-white dark:focus:border-cyan-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <Sparkles className="h-4 w-4" />
            Search
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-800/80 dark:text-cyan-200/80">
          Try
        </span>
        {popularSearches.map((term) => (
          <Link
            key={term}
            href={`/shop?q=${encodeURIComponent(term)}`}
            className="rounded-full border border-cyan-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-cyan-800 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-cyan-900 dark:bg-gray-900/80 dark:text-cyan-100 dark:hover:bg-cyan-950/40"
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  );
}
