import {
  Scale,
  AlertTriangle,
  ShieldCheck,
  FileCheck,
  Link2,
  Ban,
} from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "December 29, 2025";

  return (
    <div className="min-h-screen bg-linear-to-b from-cyan-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-r from-cyan-100 to-sky-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Scale className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-700">Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <FileCheck className="w-8 h-8 text-cyan-600 shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Agreement to Terms
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to Mish Baby Guide. These Terms of Service
                    (&quot;Terms&quot;) govern your access to and use of our
                    website located at{" "}
                    <span className="font-semibold">
                      mishbaby-guide.vercel.app
                    </span>{" "}
                    (the &quot;Website&quot;), operated by Mish Baby Guide
                    (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By accessing or using our Website, you agree to be bound by
                    these Terms and our Privacy Policy. If you do not agree to
                    these Terms, please do not use our Website.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these Terms at any time. Your
                    continued use of the Website after any changes constitutes
                    acceptance of the new Terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Disclaimer - Highlighted */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="w-10 h-10 text-amber-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Product Recommendations Disclaimer
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>IMPORTANT:</strong> The product recommendations,
                    reviews, and information provided on this Website are for
                    informational purposes only and should not be considered as
                    professional advice.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        No Guarantees
                      </h3>
                      <p className="text-gray-700">
                        We make no representations or warranties about the
                        suitability, reliability, availability, or accuracy of
                        the products we recommend. Every child is different, and
                        what works for one family may not work for another.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Personal Responsibility
                      </h3>
                      <p className="text-gray-700">
                        You are solely responsible for evaluating the
                        appropriateness of any product for your child. Always
                        check product safety ratings, age recommendations, and
                        consult with healthcare professionals when necessary.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Not Professional Advice
                      </h3>
                      <p className="text-gray-700">
                        Our content does not constitute medical, safety, or
                        professional parenting advice. Always consult with
                        qualified professionals regarding your child&apos;s
                        health, safety, and wellbeing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Affiliate Relationships */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <Link2 className="w-8 h-8 text-cyan-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Affiliate Relationships and Commissions
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Mish Baby Guide participates in the Amazon Services LLC
                    Associates Program and other affiliate advertising programs.
                    This means:
                  </p>

                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
                    <li>
                      We earn commissions when you purchase products through our
                      affiliate links
                    </li>
                    <li>These commissions come at no additional cost to you</li>
                    <li>
                      We only recommend products we believe will benefit our
                      readers
                    </li>
                    <li>
                      Our affiliate relationships do not influence our honest
                      reviews and opinions
                    </li>
                  </ul>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    When you click on an affiliate link and make a purchase on
                    Amazon or other partner sites, we may receive a commission.
                    The price you pay remains the same whether you use our link
                    or go directly to the retailer.
                  </p>

                  <div className="bg-cyan-50 rounded-lg p-4 border-l-4 border-cyan-500">
                    <p className="text-gray-700 font-semibold">
                      Transparency Commitment: We will always disclose our
                      affiliate relationships and strive to provide honest,
                      unbiased recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Use of Website */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Use of Our Website
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Permitted Use
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may use our Website for lawful purposes only. You agree to
                use the Website in accordance with these Terms and all
                applicable laws and regulations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Prohibited Activities
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree NOT to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>Use the Website for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>
                  Infringe upon our intellectual property rights or those of
                  others
                </li>
                <li>Transmit viruses, malware, or any harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>
                  Scrape, copy, or reproduce our content without permission
                </li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with the proper functioning of the Website</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Intellectual Property Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All content on this Website, including but not limited to text,
                images, logos, graphics, videos, and software, is the property
                of Mish Baby Guide or our content suppliers and is protected by
                copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Limited License
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We grant you a limited, non-exclusive, non-transferable license
                to access and use our Website for personal, non-commercial
                purposes. You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  Reproduce, distribute, or display our content without written
                  permission
                </li>
                <li>Modify or create derivative works from our content</li>
                <li>
                  Use our content for commercial purposes without authorization
                </li>
                <li>Remove any copyright or proprietary notices</li>
              </ul>
            </div>

            {/* Third-Party Links */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Third-Party Links and Content
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our Website contains links to third-party websites and services,
                including Amazon and our social media platforms. These links are
                provided for your convenience and information.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not control, endorse, or assume responsibility for any
                third-party websites, products, or services. When you access
                third-party websites, you do so at your own risk and are subject
                to their terms and policies.
              </p>
              <div className="bg-sky-50 rounded-lg p-4 border-l-4 border-sky-500">
                <p className="text-gray-700">
                  <strong>Amazon Notice:</strong> While we link to Amazon
                  products, we are not Amazon and have no control over
                  Amazon&apos;s policies, shipping, returns, or customer
                  service. All purchases are subject to Amazon&apos;s terms of
                  service.
                </p>
              </div>
            </div>

            {/* Product Availability and Pricing */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Product Availability and Pricing
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Product information, availability, and pricing on our Website
                are subject to change without notice. We make every effort to
                provide accurate information, but:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  We cannot guarantee that all product information is complete
                  or error-free
                </li>
                <li>
                  Prices and availability on Amazon may differ from what&apos;s
                  shown on our site
                </li>
                <li>Products may be discontinued or out of stock</li>
                <li>
                  We reserve the right to update product recommendations at any
                  time
                </li>
              </ul>
            </div>

            {/* User Content */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                User-Generated Content
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you submit comments, reviews, or other content to our
                Website, you grant us a non-exclusive, worldwide, royalty-free
                license to use, reproduce, modify, and display that content in
                connection with our services.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                You represent that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>You own or have the right to submit the content</li>
                <li>
                  Your content does not violate any laws or third-party rights
                </li>
                <li>Your content is not defamatory, obscene, or offensive</li>
              </ul>
            </div>

            {/* Disclaimers */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <ShieldCheck className="w-8 h-8 text-cyan-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Disclaimers and Limitation of Liability
                  </h2>

                  <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500 mb-6">
                    <p className="text-gray-700 font-semibold mb-2">
                      WEBSITE PROVIDED &quot;AS IS&quot;
                    </p>
                    <p className="text-gray-700">
                      Our Website and all content are provided &quot;as is&quot;
                      and &quot;as available&quot; without warranties of any
                      kind, either express or implied, including but not limited
                      to implied warranties of merchantability, fitness for a
                      particular purpose, or non-infringement.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    No Liability for Damages
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To the maximum extent permitted by law, Mish Baby Guide
                    shall not be liable for any indirect, incidental, special,
                    consequential, or punitive damages, including but not
                    limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                    <li>Loss of profits, data, or use</li>
                    <li>Product defects or safety issues</li>
                    <li>Personal injury or property damage</li>
                    <li>Errors or omissions in our content</li>
                    <li>Unauthorized access to your information</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Product Safety Disclaimer
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We are not responsible for the safety, quality, or
                    performance of any products purchased through our affiliate
                    links. Always check product recalls, safety ratings, and
                    follow manufacturer instructions. If you have concerns about
                    product safety, contact the manufacturer or relevant
                    authorities.
                  </p>
                </div>
              </div>
            </div>

            {/* Indemnification */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Indemnification
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Mish Baby
                Guide, its affiliates, and their respective officers, directors,
                employees, and agents from any claims, damages, losses,
                liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                <li>Your use of the Website</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Content you submit to the Website</li>
              </ul>
            </div>

            {/* Termination */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <Ban className="w-8 h-8 text-cyan-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Termination
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We reserve the right to terminate or suspend your access to
                    our Website immediately, without prior notice or liability,
                    for any reason, including if you breach these Terms.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Upon termination, your right to use the Website will
                    immediately cease. All provisions of these Terms that by
                    their nature should survive termination shall survive,
                    including ownership provisions, warranty disclaimers, and
                    limitations of liability.
                  </p>
                </div>
              </div>
            </div>

            {/* Governing Law */}
            {/* <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Governing Law and Jurisdiction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance
                with the laws of Israel, without regard to its conflict of law
                provisions.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Any disputes arising from these Terms or your use of the Website
                shall be subject to the exclusive jurisdiction of the courts of
                Israel.
              </p>
            </div> */}

            {/* Severability */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Severability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms is found to be invalid or
                unenforceable, the remaining provisions will remain in full
                force and effect. The invalid provision will be modified to the
                minimum extent necessary to make it valid and enforceable.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Changes to These Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify or replace these Terms at any
                time at our sole discretion. We will provide notice of material
                changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>
                  Updating the &quot;Last Updated&quot; date at the top of this
                  page
                </li>
                <li>Posting a notice on our Website homepage</li>
                <li>
                  Sending an email notification (if you&apos;ve subscribed)
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of the Website after any changes constitutes
                acceptance of the new Terms. If you do not agree to the modified
                Terms, you must stop using the Website.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-linear-to-r from-cyan-500 to-sky-600 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="leading-relaxed mb-4">
                If you have any questions or concerns about these Terms of
                Service, please contact us:
              </p>
              <div className="space-y-2">
                <p className="font-semibold">Mish Baby Guide</p>
                <p>Website: mishbaby-guide.vercel.app</p>
                <p>
                  Main Store:{" "}
                  <a
                    href="https://mishbaby.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-cyan-100"
                  >
                    mishbaby.com
                  </a>
                </p>
                <p className="mt-4 text-sm opacity-90">
                  We typically respond to inquiries within 2-3 business days.
                </p>
              </div>
            </div>

            {/* Acknowledgment */}
            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-8 md:p-12 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Acknowledgment
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By using Mish Baby Guide, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service. You
                also acknowledge that you have read and understood our Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
