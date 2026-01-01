"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X, Clock, TrendingUp } from "lucide-react";

interface SearchProps {
  onClose?: () => void;
}

const Search: React.FC<SearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentSearches(JSON.parse(saved));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Navigate to search results
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery("");
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const popularSearches = [
    "baby stroller",
    "car seat",
    "baby monitor",
    "high chair",
    "baby carrier",
  ];

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products and articles..."
            className="w-full pl-12 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
              ⌘K
            </kbd>
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Backdrop for desktop only */}
      {isOpen && (
        <div
          className="hidden lg:block fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Search Dropdown - Now displays inline on mobile instead of absolute */}
      {isOpen && (
        <div className="mt-3 bg-white rounded-lg shadow-lg border border-gray-200 lg:absolute lg:top-full lg:left-0 lg:right-0 lg:mt-2 lg:shadow-xl lg:z-50">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <TrendingUp className="h-4 w-4" />
              Popular Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-gray-50 text-xs text-gray-500 rounded-b-lg">
            <p>
              💡 Tip: Press{" "}
              <kbd className="px-1 py-0.5 bg-white border rounded">Enter</kbd>{" "}
              to search or{" "}
              <kbd className="px-1 py-0.5 bg-white border rounded">Esc</kbd> to
              close
            </p>
          </div>
        </div>
      )}

      {/* Backdrop for desktop only */}
      {isOpen && (
        <div
          className="hidden lg:block fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Search;
