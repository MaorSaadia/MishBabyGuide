"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ShoppingBag,
  Baby,
  Bath,
  Utensils,
  Bed,
  ShieldCheck,
  Gamepad2,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // I've added distinct colors to these icons to simulate the "Images" from your screenshot.
  // You can easily replace the icon component with an <Image /> tag later.
  const categories = [
    {
      name: "All Products",
      href: "/all-products",
      icon: LayoutGrid,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      name: "Baby Clothing",
      href: "/category/baby-clothing",
      icon: Baby,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Baby Essentials",
      href: "/category/baby-essentials",
      icon: ShoppingBag,
      color: "bg-orange-100 text-orange-600",
    },
    {
      name: "Bath Care",
      href: "/category/bath-care",
      icon: Bath,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Feeding & Mealtime",
      href: "/category/feeding-mealtime",
      icon: Utensils,
      color: "bg-red-100 text-red-600",
    },
    {
      name: "Nursery & Lighting",
      href: "/category/nursery-lighting",
      icon: Bed,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      name: "Safety & Comfort",
      href: "/category/safety-comfort",
      icon: ShieldCheck,
      color: "bg-pink-100 text-pink-600",
    },
    {
      name: "Toys & Games",
      href: "/category/toys-games",
      icon: Gamepad2,
      color: "bg-yellow-100 text-yellow-600",
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

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Side: Logo & Desktop Menu */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <div className="shrink-0 cursor-pointer">
              <Logo size="md" />
            </div>

            {/* Desktop Navigation - Matches Screenshot Layout */}
            <div className="hidden lg:flex items-center gap-8">
              {/* CATEGORIES DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 text-[15px] font-semibold transition-colors py-8 ${
                    isDropdownOpen
                      ? "text-cyan-600"
                      : "text-gray-700 hover:text-cyan-600"
                  }`}
                >
                  Categories
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>

                {/* The Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-[80%] left-0 w-70 bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden z-50"
                    >
                      {/* Scrollable area if list gets too long */}
                      <div className="max-h-[80vh] overflow-y-auto py-2">
                        {categories.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group"
                          >
                            {/* Circle Image Placeholder */}
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${item.color} group-hover:brightness-95 transition-all`}
                            >
                              {/* Replace this Icon with <Image src={item.img} /> for real photos */}
                              <item.icon className="h-5 w-5" />
                            </div>

                            {/* Text */}
                            <span className="text-gray-700 font-medium text-[15px] group-hover:text-cyan-700">
                              {item.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Standard Links (from screenshot) */}
              <Link
                href="/bundles"
                className="text-[15px] font-medium text-gray-700 hover:text-cyan-600 transition-colors"
              >
                Bundle Deals
              </Link>
              <Link
                href="/deals"
                className="text-[15px] font-medium text-gray-700 hover:text-cyan-600 transition-colors"
              >
                Deals
              </Link>
            </div>
          </div>

          {/* Right Side: (Search, Cart, etc - simplified for now) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* You can add Search / Cart icons here later */}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-cyan-600"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Simplified Vertical List) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Categories
              </div>
              {categories.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${item.color}`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <Link
                href="/bundles"
                className="block p-2 font-medium text-gray-700"
              >
                Bundle Deals
              </Link>
              <Link
                href="/deals"
                className="block p-2 font-medium text-gray-700"
              >
                Deals
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
