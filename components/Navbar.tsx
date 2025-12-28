"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const categories = [
    {
      name: "Baby Clothing",
      subcategories: [
        "Bodysuits & Onesies",
        "Sleepwear",
        "Outerwear",
        "Shoes & Socks",
      ],
    },
    {
      name: "Baby Essentials",
      subcategories: [
        "Diapers & Wipes",
        "Baby Care",
        "Health & Safety",
        "Nursery Storage",
      ],
    },
    {
      name: "Bath Care & Accessories",
      subcategories: [
        "Bath Tubs",
        "Towels & Washcloths",
        "Bath Toys",
        "Baby Toiletries",
      ],
    },
    {
      name: "Feeding & Mealtime",
      subcategories: [
        "Bottles & Nipples",
        "Breast Pumps",
        "High Chairs",
        "Feeding Accessories",
      ],
    },
    {
      name: "Nursery & Lighting",
      subcategories: [
        "Cribs & Bassinets",
        "Nursery Furniture",
        "Night Lights",
        "Monitors",
      ],
    },
    {
      name: "Safety & Comfort",
      subcategories: [
        "Baby Gates",
        "Car Seats",
        "Baby Monitors",
        "Sleep Safety",
      ],
    },
    {
      name: "Toys Plush & Games",
      subcategories: [
        "Plush Toys",
        "Educational Toys",
        "Activity Centers",
        "Teething Toys",
      ],
    },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-cyan-600">Mish</span>
              <span className="text-2xl font-bold text-gray-800">Baby</span>
              <span className="text-sm font-normal text-gray-600 ml-2">
                Guide
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-cyan-600 font-medium transition"
            >
              Home
            </Link>

            {categories.map((category) => (
              <div
                key={category.name}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(category.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center text-gray-700 hover:text-cyan-600 font-medium transition">
                  {category.name}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {openDropdown === category.name && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/category/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/guides"
              className="text-gray-700 hover:text-cyan-600 font-medium transition"
            >
              Buying Guides
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-cyan-600 font-medium transition"
            >
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-cyan-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 hover:bg-cyan-50 rounded-md"
            >
              Home
            </Link>

            {categories.map((category) => (
              <div key={category.name}>
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === category.name ? null : category.name
                    )
                  }
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-cyan-50 rounded-md flex justify-between items-center"
                >
                  {category.name}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openDropdown === category.name ? "rotate-180" : ""}`}
                  />
                </button>

                {openDropdown === category.name && (
                  <div className="pl-6 space-y-1">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/category/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-3 py-2 text-sm text-gray-600 hover:bg-cyan-50 rounded-md"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/guides"
              className="block px-3 py-2 text-gray-700 hover:bg-cyan-50 rounded-md"
            >
              Buying Guides
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-700 hover:bg-cyan-50 rounded-md"
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
