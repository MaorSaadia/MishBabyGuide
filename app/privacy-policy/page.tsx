import { Shield, Lock, Eye, Cookie, FileText, Mail } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 29, 2025";

  return (
    <div className="min-h-screen bg-linear-to-b from-cyan-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-r from-cyan-100 to-sky-100 dark:from-gray-900 dark:to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <FileText className="w-8 h-8 text-cyan-600 dark:text-cyan-400 shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Introduction
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Welcome to Mish Baby Guide ( &quot;we, &quot; &quot;our,
                    &quot; or &quot;us&quot;). We are committed to protecting
                    your privacy and ensuring the security of your personal
                    information. This Privacy Policy explains how we collect,
                    use, disclose, and safeguard your information when you visit
                    our website{" "}
                    <span className="font-semibold">mishbabyguide.com</span> and
                    any related services.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    By using our website, you agree to the collection and use of
                    information in accordance with this policy. If you do not
                    agree with our policies and practices, please do not use our
                    website.
                  </p>
                </div>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <Eye className="w-8 h-8 text-cyan-600 dark:text-cyan-400 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Information We Collect
                  </h2>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Information You Provide to Us
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    We may collect information that you voluntarily provide to
                    us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6 ml-4">
                    <li>Subscribe to our newsletter or mailing list</li>
                    <li>Contact us through our contact form or email</li>
                    <li>Leave comments on our blog posts</li>
                    <li>Participate in surveys or promotions</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Information Automatically Collected
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    When you visit our website, we automatically collect certain
                    information about your device and browsing behavior,
                    including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>IP address and location data</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages viewed and time spent on pages</li>
                    <li>Referring website addresses</li>
                    <li>Device information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cookies and Tracking */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <Cookie className="w-8 h-8 text-cyan-600 dark:text-cyan-400 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Cookies and Tracking Technologies
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    We use cookies and similar tracking technologies to track
                    activity on our website and store certain information.
                    Cookies are files with a small amount of data that are sent
                    to your browser from a website and stored on your device.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Types of Cookies We Use
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="border-l-4 border-cyan-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Essential Cookies
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        Required for the website to function properly and cannot
                        be disabled.
                      </p>
                    </div>
                    <div className="border-l-4 border-cyan-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Analytics Cookies
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        Help us understand how visitors interact with our
                        website by collecting and reporting information
                        anonymously.
                      </p>
                    </div>
                    <div className="border-l-4 border-cyan-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Advertising Cookies
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        Used to deliver relevant advertisements and track ad
                        campaign performance.
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    You can instruct your browser to refuse all cookies or to
                    indicate when a cookie is being sent. However, if you do not
                    accept cookies, you may not be able to use some portions of
                    our website.
                  </p>
                </div>
              </div>
            </div>

            {/* Third-Party Services */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Third-Party Services and Analytics
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Google Analytics
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    We use Google Analytics to analyze how visitors use our
                    website. Google Analytics collects information such as how
                    often users visit the site, what pages they visit, and what
                    other sites they used prior to coming to our site.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    For more information on how Google uses data, please visit{" "}
                    <Link
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline"
                    >
                      Google&apos;s Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Social Media Widgets
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our website includes social media features, such as
                    Facebook, Instagram, YouTube, and TikTok buttons. These
                    features may collect your IP address and which page you are
                    visiting on our site, and may set a cookie to enable the
                    feature to function properly.
                  </p>
                </div>
              </div>
            </div>

            {/* Amazon Associates Disclosure */}
            <div className="bg-cyan-50 dark:bg-cyan-900/20 border-2 border-cyan-200 dark:border-cyan-700 rounded-2xl p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Amazon Associates Program Disclosure
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Mish Baby Guide is a participant in the Amazon Services LLC
                Associates Program, an affiliate advertising program designed to
                provide a means for sites to earn advertising fees by
                advertising and linking to Amazon.com and affiliated
                international Amazon sites.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                When you click on product links on our website and make a
                purchase, we may earn a commission at no additional cost to you.
                This helps us maintain and improve our website and continue
                providing valuable content to parents.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or
                its affiliates. We are independently owned and the opinions
                expressed here are our own.
              </p>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We use the information we collect for various purposes,
                including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Providing and maintaining our website</li>
                <li>Improving user experience and website functionality</li>
                <li>Analyzing website usage and trends</li>
                <li>
                  Sending newsletters and promotional materials (with your
                  consent)
                </li>
                <li>Responding to your comments, questions, and requests</li>
                <li>Detecting and preventing fraud and abuse</li>
                <li>Complying with legal obligations</li>
                <li>
                  Delivering relevant advertisements through affiliate programs
                </li>
              </ul>
            </div>

            {/* Data Security */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <Lock className="w-8 h-8 text-cyan-600 dark:text-cyan-400 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Data Security
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    We implement appropriate technical and organizational
                    security measures to protect your personal information
                    against unauthorized access, alteration, disclosure, or
                    destruction. However, no method of transmission over the
                    internet or electronic storage is 100% secure.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    While we strive to use commercially acceptable means to
                    protect your personal information, we cannot guarantee its
                    absolute security.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Retention */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Data Retention
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We retain your personal information only for as long as
                necessary to fulfill the purposes outlined in this Privacy
                Policy, unless a longer retention period is required or
                permitted by law. When we no longer need your information, we
                will securely delete or anonymize it.
              </p>
            </div>

            {/* Your Rights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your Privacy Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4 ml-4">
                <li>The right to access your personal information</li>
                <li>
                  The right to correct inaccurate or incomplete information
                </li>
                <li>The right to delete your personal information</li>
                <li>The right to restrict or object to processing</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To exercise any of these rights, please contact us using the
                contact information provided below.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Children&apos;s Privacy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Our website is intended for parents and guardians, not for
                children under the age of 13. We do not knowingly collect
                personal information from children under 13.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us
                immediately, and we will take steps to remove that information
                from our systems.
              </p>
            </div>

            {/* Third-Party Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Third-Party Links
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our website contains links to third-party websites, including
                Amazon and social media platforms. We are not responsible for
                the privacy practices or content of these third-party sites. We
                encourage you to read the privacy policies of any third-party
                sites you visit.
              </p>
            </div>

            {/* Changes to Privacy Policy */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;Last Updated&quot; date at the
                top of this policy.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We encourage you to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-linear-to-r from-cyan-500 to-sky-600 dark:from-cyan-600 dark:to-sky-700 rounded-2xl p-8 md:p-12 text-white">
              <div className="flex items-start gap-4 mb-6">
                <Mail className="w-8 h-8 text-cyan-200 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                  <p className="leading-relaxed mb-4">
                    If you have any questions, concerns, or requests regarding
                    this Privacy Policy or our privacy practices, please contact
                    us:
                  </p>
                  <div className="space-y-2">
                    <p className="font-semibold">Mish Baby Guide</p>
                    <p>Website: mishbabyguide.com</p>
                    <p>
                      Main Store:{" "}
                      <Link
                        href="https://mishbaby.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-cyan-100"
                      >
                        mishbaby.com
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* GDPR & CCPA Compliance Notice */}
            <div className="bg-sky-50 dark:bg-sky-900/20 border-2 border-sky-200 dark:border-sky-700 rounded-2xl p-8 md:p-12 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                GDPR & CCPA Compliance
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We are committed to complying with the General Data Protection
                Regulation (GDPR) for our European users and the California
                Consumer Privacy Act (CCPA) for our California users.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you are a resident of the European Union or California, you
                have additional rights regarding your personal information. For
                more information about these rights and how to exercise them,
                please contact us.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
