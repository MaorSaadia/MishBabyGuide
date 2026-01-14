import React from "react";
import Link from "next/link";
import {
  Shirt,
  Package,
  Bath,
  UtensilsCrossed,
  Lamp,
  Shield,
  Gamepad2,
  ArrowRight,
} from "lucide-react";

interface Category {
  title: string;
  slug: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
}

const CategoriesGrid = () => {
  const categories: Category[] = [
    {
      title: "Baby Clothing",
      slug: "baby-clothing",
      icon: <Shirt className="h-8 w-8" />,
      description: "Comfortable & stylish baby wear",
      color: "text-pink-600 dark:text-pink-400",
      bgColor:
        "bg-pink-50 dark:bg-pink-900 group-hover:bg-pink-100 dark:group-hover:bg-pink-800",
    },
    {
      title: "Baby Essentials",
      slug: "baby-essentials",
      icon: <Package className="h-8 w-8" />,
      description: "Must-have daily necessities",
      color: "text-blue-600 dark:text-blue-400",
      bgColor:
        "bg-blue-50 dark:bg-blue-900 group-hover:bg-blue-100 dark:group-hover:bg-blue-800",
    },
    {
      title: "Bath Care & Accessories",
      slug: "bath-care-accessories",
      icon: <Bath className="h-8 w-8" />,
      description: "Safe & gentle bath time products",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor:
        "bg-cyan-50 dark:bg-cyan-900 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-800",
    },
    {
      title: "Feeding & Mealtime",
      slug: "feeding-mealtime",
      icon: <UtensilsCrossed className="h-8 w-8" />,
      description: "Bottles, chairs & feeding gear",
      color: "text-green-600 dark:text-green-400",
      bgColor:
        "bg-green-50 dark:bg-green-900 group-hover:bg-green-100 dark:group-hover:bg-green-800",
    },
    {
      title: "Nursery & Lighting",
      slug: "nursery-lighting",
      icon: <Lamp className="h-8 w-8" />,
      description: "Create the perfect nursery",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor:
        "bg-yellow-50 dark:bg-yellow-900 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-800",
    },
    {
      title: "Safety & Comfort",
      slug: "safety-comfort",
      icon: <Shield className="h-8 w-8" />,
      description: "Keep your baby safe & secure",
      color: "text-red-600 dark:text-red-400",
      bgColor:
        "bg-red-50 dark:bg-red-900 group-hover:bg-red-100 dark:group-hover:bg-red-800",
    },
    {
      title: "Toys Plush & Games",
      slug: "toys-plush-games",
      icon: <Gamepad2 className="h-8 w-8" />,
      description: "Fun & educational playtime",
      color: "text-purple-600 dark:text-purple-400",
      bgColor:
        "bg-purple-50 dark:bg-purple-900 group-hover:bg-purple-100 dark:group-hover:bg-purple-800",
    },
  ];

  return (
    <section
      id="categories-grid"
      className="py-16 md:py-20 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our carefully curated selection of baby products organized
            by category
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-cyan-200 dark:hover:border-cyan-400 overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-linear-to-br from-cyan-50 dark:from-cyan-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${category.bgColor} ${category.color} mb-4 transition-all duration-300 group-hover:scale-110`}
                >
                  {category.icon}
                </div>

                {/* Category Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {category.description}
                </p>

                {/* Explore Link */}
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Explore</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-linear-to-br from-cyan-100 to-cyan-50 dark:from-cyan-800 dark:to-cyan-900 rounded-full opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 dark:bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all shadow-md hover:shadow-lg"
          >
            Browse All Products
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
