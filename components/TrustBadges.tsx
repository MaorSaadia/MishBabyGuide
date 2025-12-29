import React from "react";
import {
  Shield,
  Award,
  Heart,
  CheckCircle,
  Users,
  ThumbsUp,
} from "lucide-react";

interface Badge {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const TrustBadges = () => {
  const badges: Badge[] = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Honest Reviews",
      description: "Unbiased, transparent product reviews you can trust",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Amazon Verified",
      description: "Official Amazon Associates partner with verified links",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Parent Tested",
      description: "Real parents testing real products for real results",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Driven",
      description: "Trusted by thousands of parents worldwide",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Expert Research",
      description: "Thorough testing and detailed analysis on every product",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: <ThumbsUp className="h-8 w-8" />,
      title: "Quality Approved",
      description: "Only recommend products that meet our high standards",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Parents Trust Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re committed to providing honest, reliable information to
            help you make the best decisions for your family
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-cyan-200"
            >
              {/* Icon Container */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${badge.bgColor} ${badge.color} mb-4 transition-all duration-300 group-hover:scale-110`}
              >
                {badge.icon}
              </div>

              {/* Badge Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {badge.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {badge.description}
              </p>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-linear-to-br from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-linear-to-r from-cyan-600 to-cyan-700 rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold">50+</p>
              <p className="text-cyan-100">Products Reviewed</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold">10K+</p>
              <p className="text-cyan-100">Happy Parents</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold">4.9★</p>
              <p className="text-cyan-100">Average Rating</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6 text-lg">
            Join thousands of parents making confident choices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#featured-products"
              className="inline-flex items-center justify-center px-8 py-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all shadow-md hover:shadow-lg"
            >
              Start Exploring
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-cyan-600 font-semibold rounded-lg border-2 border-cyan-600 hover:bg-cyan-50 transition-all"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
