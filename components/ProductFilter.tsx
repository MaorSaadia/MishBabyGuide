/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
"use client";

import { useState, useEffect } from "react";
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Product } from "@/lib/sanity.client";

interface ProductFilterProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
}

export default function ProductFilter({
  products,
  onFilterChange,
}: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [showSubcategories, setShowSubcategories] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showRating, setShowRating] = useState(true);

  // Extract unique subcategories
  const subcategories = Array.from(
    new Set(
      products
        .map((p) => p.subcategory)
        .filter((s): s is string => s !== undefined && s !== null)
    )
  ).sort();

  // Extract price range from products
  useEffect(() => {
    const prices = products
      .map((p) => {
        const price = p.price.replace(/[^0-9.]/g, "");
        return parseFloat(price) || 0;
      })
      .filter((p) => p > 0);

    if (prices.length > 0) {
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Filter by subcategory
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(
        (p) => p.subcategory && selectedSubcategories.includes(p.subcategory)
      );
    }

    // Filter by price range
    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter((p) => (p.rating || 0) >= minRating);
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "price-low":
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, "")) || 0;
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, "")) || 0;
          return priceA - priceB;
        case "price-high":
          const priceA2 = parseFloat(a.price.replace(/[^0-9.]/g, "")) || 0;
          const priceB2 = parseFloat(b.price.replace(/[^0-9.]/g, "")) || 0;
          return priceB2 - priceA2;
        case "popular":
          // Featured products first, then by rating
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    onFilterChange(sorted);
  }, [
    products,
    selectedSubcategories,
    priceRange,
    minRating,
    sortBy,
    onFilterChange,
  ]);

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const clearFilters = () => {
    setSelectedSubcategories([]);
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSortBy("newest");
  };

  const activeFiltersCount =
    selectedSubcategories.length +
    (minRating > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Subcategory Filter */}
      {subcategories.length > 0 && (
        <div className="border-t pt-6">
          <button
            onClick={() => setShowSubcategories(!showSubcategories)}
            className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 mb-3"
          >
            <span>Subcategory</span>
            {showSubcategories ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {showSubcategories && (
            <div className="space-y-2">
              {subcategories.map((subcategory) => (
                <label
                  key={subcategory}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedSubcategories.includes(subcategory)}
                    onChange={() => toggleSubcategory(subcategory)}
                    className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <span className="ml-2 text-gray-700 group-hover:text-cyan-600">
                    {subcategory}
                  </span>
                  <span className="ml-auto text-sm text-gray-500">
                    (
                    {
                      products.filter((p) => p.subcategory === subcategory)
                        .length
                    }
                    )
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range Filter */}
      <div className="border-t pt-6">
        <button
          onClick={() => setShowPrice(!showPrice)}
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 mb-3"
        >
          <span>Price Range</span>
          {showPrice ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {showPrice && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Min"
                min="0"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    parseInt(e.target.value) || 1000,
                  ])
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Max"
                min="0"
              />
            </div>
            <div className="text-sm text-gray-600 text-center">
              ${priceRange[0]} - ${priceRange[1]}
            </div>
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="border-t pt-6">
        <button
          onClick={() => setShowRating(!showRating)}
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 mb-3"
        >
          <span>Minimum Rating</span>
          {showRating ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {showRating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => setMinRating(rating)}
                  className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
                />
                <span className="ml-2 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  ))}
                  <span className="ml-1 text-gray-700 group-hover:text-cyan-600">
                    & up
                  </span>
                </span>
              </label>
            ))}
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={minRating === 0}
                onChange={() => setMinRating(0)}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="ml-2 text-gray-700 group-hover:text-cyan-600">
                All Ratings
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          Clear All Filters ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-full shadow-lg transition-colors flex items-center gap-2"
      >
        <SlidersHorizontal className="w-5 h-5" />
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Sidebar */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b z-10">
              <div className="flex items-center justify-between p-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </>
      )}

      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block bg-white rounded-xl shadow-lg p-6 sticky top-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </h2>
        </div>
        <FilterContent />
      </div>
    </>
  );
}
