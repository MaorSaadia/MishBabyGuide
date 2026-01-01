import Link from "next/link";
import { Search, Shield, Heart, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-linear-to-b from-cyan-50 to-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 rounded-full filter blur-3xl opacity-30 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full filter blur-3xl opacity-20 -ml-48 -mb-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center md:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-cyan-100">
              <Star className="h-4 w-4 text-cyan-600 fill-cyan-600" />
              <span className="text-sm font-medium text-gray-700">
                Trusted by 10,000+ Parents
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find the Best <span className="text-cyan-600">Baby Products</span>
              , Trusted by Parents
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Honest, detailed reviews and buying guides to help you make
              confident decisions for your little one. From nursery essentials
              to feeding gear, we&apos;ve tested it all.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="#featured-products"
                className="inline-flex items-center justify-center px-8 py-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Browse Top Picks
                <svg
                  className="ml-2 h-5 w-5"
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

              <Link
                href="#categories-grid"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-cyan-600 font-semibold rounded-lg border-2 border-cyan-600 hover:bg-cyan-50 transition-all"
              >
                View All Categories
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-600" />
                <span className="text-sm text-gray-600">Honest Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-cyan-600" />
                <span className="text-sm text-gray-600">Parent Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-cyan-600" />
                <span className="text-sm text-gray-600">Expert Research</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image/Illustration */}
          <div className="relative hidden md:block">
            <div className="relative w-full aspect-square">
              {/* Placeholder for hero image - Replace with actual image */}
              <div className="absolute inset-0 bg-linear-to-br from-cyan-100 to-cyan-50 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-center h-full">
                  {/* Baby Products Illustration */}
                  <div className="grid grid-cols-2 gap-4 p-8">
                    {/* Product Card 1 */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-cyan-200 rounded-xl mb-3 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-cyan-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-gray-600">
                        Baby Care
                      </p>
                    </div>

                    {/* Product Card 2 */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-pink-200 rounded-xl mb-3 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-pink-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-gray-600">
                        Nursery
                      </p>
                    </div>

                    {/* Product Card 3 */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-purple-200 rounded-xl mb-3 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-gray-600">Toys</p>
                    </div>

                    {/* Product Card 4 */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-green-200 rounded-xl mb-3 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-gray-600">
                        Feeding
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              {/* <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-xl animate-bounce">
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-600">50+</p>
                  <p className="text-xs text-gray-600">Reviews</p>
                </div>
              </div> */}

              {/* <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-xl">
                <div className="flex items-center gap-1">
                  <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  <div>
                    <p className="text-lg font-bold text-gray-900">4.9</p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
