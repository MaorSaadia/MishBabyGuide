"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import Logo from "./Logo";

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

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -10,
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: easeOut },
    },
  };

  const mobileSubMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.25, ease: easeOut },
    },
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo + Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="shrink-0">
              <Logo size="md" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "categories" ? null : "categories"
                  )
                }
                onMouseEnter={() => setOpenDropdown("categories")}
                className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-cyan-600 font-medium transition-colors"
              >
                Categories
                <motion.div
                  animate={{ rotate: openDropdown === "categories" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openDropdown === "categories" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => setOpenDropdown(null)}
                    className="absolute left-0 right-0 top-16 bg-white border-t border-b border-gray-200 shadow-lg"
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <div className="grid grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                          <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.3 }}
                            className="space-y-3"
                          >
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {category.name}
                            </h3>
                            <ul className="space-y-2">
                              {category.subcategories.map((sub) => (
                                <li key={sub}>
                                  <Link
                                    href={`/category/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                                    className="text-sm text-gray-600 hover:text-cyan-600 transition-colors block"
                                  >
                                    {sub}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Link
                href="/guides"
                className="px-4 py-2 text-gray-700 hover:text-cyan-600 font-medium transition-colors"
              >
                Buying Guides
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <motion.div className="lg:hidden" whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-cyan-600 focus:outline-none p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="lg:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "categories" ? null : "categories"
                  )
                }
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg flex justify-between items-center transition-colors font-medium"
              >
                Categories
                <motion.div
                  animate={{ rotate: openDropdown === "categories" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openDropdown === "categories" && (
                  <motion.div
                    variants={mobileSubMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="pl-4 space-y-4 overflow-hidden py-2"
                  >
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-2"
                      >
                        <h4 className="font-semibold text-gray-900 text-sm px-4">
                          {category.name}
                        </h4>
                        <ul className="space-y-1">
                          {category.subcategories.map((sub) => (
                            <li key={sub}>
                              <Link
                                href={`/category/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-cyan-600 rounded-lg transition-colors"
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <Link
                href="/guides"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-cyan-600 rounded-lg transition-colors font-medium"
              >
                Buying Guides
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
