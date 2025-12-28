import Link from "next/link";
import { Mail, Facebook, Instagram, Youtube } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Buying Guides", href: "/guides" },
    { name: "Product Reviews", href: "/reviews" },
    { name: "Blog", href: "/blog" },
  ];

  const categories = [
    { name: "Baby Clothing", href: "/category/baby-clothing" },
    { name: "Baby Essentials", href: "/category/baby-essentials" },
    { name: "Feeding & Mealtime", href: "/category/feeding-mealtime" },
    { name: "Toys & Games", href: "/category/toys-games" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Affiliate Disclaimer", href: "/disclaimer" },
    { name: "Contact Us", href: "/contact", icon: Mail },
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "Youtube", href: "#", icon: Youtube },
  ];

  return (
    <footer className="bg-linear-to-b from-gray-50 to-white border-t border-gray-200">
      {/* Amazon Disclaimer */}
      <div className="bg-linear-to-r from-cyan-50 to-blue-50 border-t-2 border-cyan-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Amazon Affiliate Disclosure
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                MishBabyGuide.com participates in the Amazon Services LLC
                Associates Program, an affiliate advertising program designed to
                provide a means for sites to earn advertising fees by
                advertising and linking to Amazon.com. As an Amazon Associate,
                we earn from qualifying purchases at no additional cost to you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Your trusted source for honest baby product reviews and buying
              guides. Helping parents make informed decisions for their little
              ones.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-100 hover:bg-cyan-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-cyan-600 transition-all duration-200 group"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-cyan-600 transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-600 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm text-gray-600 hover:text-cyan-600 transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-600 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-4">
              Legal & Contact
            </h3>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-cyan-600 transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-600 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {currentYear} MishBabyGuide.com. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 text-center md:text-right max-w-2xl">
              The information provided on this website is for general
              informational purposes only. We make every effort to ensure
              accuracy, but product specifications and prices may change. Always
              verify details on the retailer&apos;s site before making a
              purchase.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
