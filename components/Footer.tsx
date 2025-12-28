import { Mail, Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Amazon Disclaimer - Most Important */}
      <div className="bg-yellow-50 border-t-2 border-yellow-400 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-800 text-center">
            <strong>Amazon Affiliate Disclosure:</strong> MishBabyGuide.com is a
            participant in the Amazon Services LLC Associates Program, an
            affiliate advertising program designed to provide a means for sites
            to earn advertising fees by advertising and linking to Amazon.com.
            As an Amazon Associate, we earn from qualifying purchases at no
            additional cost to you.
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.png"
                  alt="MishBabyGuide"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-white text-lg font-semibold">
                <span className="text-cyan-400">Mish</span>BabyGuide
              </h3>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted source for honest baby product reviews and buying
              guides. Helping parents make informed decisions for their little
              ones.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-sm hover:text-blue-400 transition"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/guides"
                  className="text-sm hover:text-blue-400 transition"
                >
                  Buying Guides
                </a>
              </li>
              <li>
                <a
                  href="/reviews"
                  className="text-sm hover:text-blue-400 transition"
                >
                  Product Reviews
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-sm hover:text-blue-400 transition"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/category/nursery"
                  className="text-sm hover:text-blue-400 transition"
                >
                  Nursery Essentials
                </a>
              </li>
              <li>
                <a
                  href="/category/feeding"
                  className="text-sm hover:text-blue-400 transition"
                >
                  Feeding & Nutrition
                </a>
              </li>
              <li>
                <a
                  href="/category/gear"
                  className="text-sm hover:text-blue-400 transition"
                >
                  Baby Gear
                </a>
              </li>
              <li>
                <a
                  href="/category/toys"
                  className="text-sm hover:text-blue-400 transition"
                >
                  Toys & Development
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Legal & Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-sm hover:text-blue-400 transition font-medium"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm hover:text-blue-400 transition"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  className="text-sm hover:text-blue-400 transition"
                >
                  Affiliate Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm hover:text-blue-400 transition flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social Links */}
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a
                href="#"
                className="hover:text-blue-400 transition"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {currentYear} MishBabyGuide.com. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Legal Notice */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500 text-center">
            The information provided on this website is for general
            informational purposes only. We make every effort to ensure
            accuracy, but product specifications and prices may change. Always
            verify details on the retailer&apos;s site before making a purchase.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
