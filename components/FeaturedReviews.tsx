"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Star } from "lucide-react";

import { getProductCardImage } from "@/lib/sanity.image";
import { getProductReviews, ProductReview } from "@/lib/sanity.client";
import ProductReviewCard from "./ProductReviewCard";

const FeaturedReviews = () => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getProductReviews();
      // Get featured reviews or latest 3
      const featuredReviews = data
        .filter((review) => review.featured)
        .slice(0, 3);

      if (featuredReviews.length > 0) {
        setReviews(featuredReviews);
      } else {
        setReviews(data.slice(0, 3));
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl h-125 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no reviews found
  if (reviews.length === 0) {
    return (
      <section className="py-16 md:py-20 bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-gray-800 text-cyan-600 rounded-full mb-4">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-semibold">In-Depth Reviews</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Product Reviews
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive reviews with pros, cons, and expert analysis to help
              you make informed decisions.
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No product reviews yet. Add some reviews in Sanity Studio!
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white dark:text-gray-800 font-semibold rounded-lg hover:bg-cyan-700 transition-all"
            >
              Go to Studio
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-gray-700 text-cyan-600 rounded-full mb-4">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-semibold">In-Depth Reviews</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Featured Product Reviews
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive reviews with pros, cons, and expert analysis to help
            you make informed decisions.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ProductReviewCard
              key={review._id}
              title={review.title}
              slug={review.slug.current}
              image={
                review.mainImage
                  ? getProductCardImage(review.mainImage)
                  : "/placeholder.jpg"
              }
              excerpt={review.excerpt}
              amazonLink={review.amazonLink}
              category={review.category?.title}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all group"
          >
            View All Reviews
            <svg
              className="h-5 w-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Info Banner */}
        <div className="mt-16 bg-linear-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="shrink-0">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-cyan-600 fill-cyan-600" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Why Trust Our Reviews?
              </h3>
              <p className="text-gray-600">
                Every product is personally tested and evaluated. We provide
                honest, detailed reviews covering pros, cons, and real-world
                performance to help you choose the best for your baby.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;
