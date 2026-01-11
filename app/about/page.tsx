import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Users,
  Globe,
  Heart,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-cyan-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-r from-cyan-100 to-sky-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Welcome to Mish Baby Guide
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Helping parents worldwide find the perfect products for their
              little ones
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  At Mish Baby, we started with a simple mission: to provide
                  parents with the highest quality baby products through our
                  main store at{" "}
                  <Link
                    href="https://mishbaby.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    mishbaby.com
                  </Link>
                  . Over time, we&apos;ve built a community of over 300,000
                  parents across social media who trust us for honest advice and
                  quality recommendations.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  However, we realized that we couldn&apos;t reach every parent
                  who needed our help. Some countries faced shipping
                  limitations, and we couldn&apos;t stock every product that
                  parents were asking for. That&apos;s when we decided to expand
                  our reach.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  That&apos;s why we created{" "}
                  <span className="font-semibold">Mish Baby Guide</span> — a
                  comprehensive resource where we partner with Amazon to bring
                  you carefully curated product recommendations. This way,
                  parents from around the world can access the products we
                  recommend, regardless of location or availability constraints.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Why Parents Trust Us
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <Users className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      300K+ Community
                    </h3>
                    <p className="text-gray-700">
                      Over 300,000 parents trust us across all social media
                      platforms for honest reviews and recommendations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <Globe className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Global Reach
                    </h3>
                    <p className="text-gray-700">
                      Through Amazon, we help parents worldwide access quality
                      products, no matter where they are.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <CheckCircle2 className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Carefully Curated
                    </h3>
                    <p className="text-gray-700">
                      Every product we recommend is thoroughly researched and
                      tested to ensure it meets our high standards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <Heart className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Parent-Focused
                    </h3>
                    <p className="text-gray-700">
                      We&apos;re parents too. We understand what you need and
                      recommend only what we&apos;d use for our own children.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-linear-to-r from-cyan-500 to-sky-500 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg leading-relaxed mb-6">
                To empower parents everywhere with trusted product
                recommendations, honest reviews, and expert guidance — making
                parenting a little easier, one product at a time.
              </p>
              <p className="text-lg leading-relaxed">
                Whether you&apos;re shopping through our main store or exploring
                our Amazon recommendations here, you&apos;re getting the same
                commitment to quality and care that has earned the trust of
                hundreds of thousands of parents worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Join Our Community
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Follow us on social media for daily tips, product updates, and
              parenting advice
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="https://www.youtube.com/@MishBabyShop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
              >
                <Youtube className="w-5 h-5" />
                <span className="font-medium">YouTube</span>
              </Link>
              <Link
                href="https://www.facebook.com/profile.php?id=61567086625746"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
              >
                <Facebook className="w-5 h-5" />
                <span className="font-medium">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/mishbabystore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
              >
                <Instagram className="w-5 h-5" />
                <span className="font-medium">Instagram</span>
              </Link>
              <Link
                href="https://www.tiktok.com/@mishbaby_shop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                <span className="font-medium">TikTok</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Find the Perfect Products?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Explore our curated collection of baby products, backed by real
              parent reviews and expert recommendations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Browse Products
              </Link>
              <Link
                href="/blog"
                className="bg-white hover:bg-gray-50 text-cyan-600 border-2 border-cyan-600 px-8 py-3 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Read Our Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
