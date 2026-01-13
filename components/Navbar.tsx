"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Bath,
  Shield,
  Gamepad2,
  LayoutGrid,
  Search,
  Shirt,
  UtensilsCrossed,
  Lamp,
  Package,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import SearchComponent from "./Search";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const categories = [
    {
      name: "All Products",
      href: "/products",
      icon: LayoutGrid,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      name: "Baby Clothing",
      href: "/category/baby-clothing",
      icon: Shirt,
      color: "bg-pink-50 text-pink-600",
    },
    {
      name: "Baby Essentials",
      href: "/category/baby-essentials",
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      name: "Bath Care & Accessories",
      href: "/category/bath-care-accessories",
      icon: Bath,
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      name: "Feeding & Mealtime",
      href: "/category/feeding-mealtime",
      icon: UtensilsCrossed,
      color: "bg-green-50 text-green-600",
    },
    {
      name: "Nursery & Lighting",
      href: "/category/nursery-lighting",
      icon: Lamp,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      name: "Safety & Comfort",
      href: "/category/safety-comfort",
      icon: Shield,
      color: "bg-red-50 text-red-600",
    },
    {
      name: "Toys & Games",
      href: "/category/toys-plush-games",
      icon: Gamepad2,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" as const },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" as const },
    },
  };

  const navLinkStyles =
    "text-[15px] font-medium text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors";

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo & Desktop Menu */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {/* CATEGORIES DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 text-[15px] font-medium text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Categories
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* The Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-2">
                        {categories.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                          >
                            <div
                              className={`${item.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}
                            >
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                              {item.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* NEW LINKS */}
              <Link href="/reviews" className={navLinkStyles}>
                Products Review
              </Link>
              <Link href="/blog" className={navLinkStyles}>
                Blog
              </Link>
              <Link href="/about" className={navLinkStyles}>
                About Us
              </Link>
            </div>
          </div>

          {/* Center/Right: Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-sm mx-8">
            <SearchComponent />
          </div>

          {/* Theme Toggle */}
          <div className="hidden lg:flex">
            <ThemeToggle />
          </div>

          {/* Right Side: Mobile Icons */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Search Icon */}
            <button
              onClick={() => {
                setShowMobileSearch(!showMobileSearch);
                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
              }}
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                if (showMobileSearch) setShowMobileSearch(false);
              }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Slide Panel */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-gray-100 dark:border-gray-700"
            >
              <div className="py-4 max-h-[80vh] overflow-y-auto">
                <SearchComponent onClose={() => setShowMobileSearch(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-gray-100 dark:border-gray-700"
            >
              <div className="py-4 space-y-2 max-h-[70vh] overflow-y-auto">
                {/* Categories Section */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
                    Categories
                  </div>
                  {categories.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className={`${item.color} p-2 rounded-lg`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Mobile Separator and New Links */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-2 space-y-1">
                  <Link
                    href="/reviews"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 font-medium text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    <FileText className="w-4 h-4" />
                    Products Review
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2 font-medium text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2 font-medium text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    About Us
                  </Link>
                  <div className="flex items-center justify-center p-2">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
