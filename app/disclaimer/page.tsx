import {
  DollarSign,
  ExternalLink,
  Info,
  CheckCircle,
  AlertCircle,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function DisclaimerPage() {
  const lastUpdated = "December 29, 2025";

  return (
    <div className="min-h-screen bg-linear-to-b from-cyan-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-r from-cyan-100 to-sky-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Info className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Affiliate Disclaimer
            </h1>
            <p className="text-lg text-gray-700">
              Transparency in Our Recommendations
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* FTC Disclosure - Highlighted */}
            <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-10 h-10 text-sky-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    FTC Disclosure Requirement
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In accordance with the Federal Trade Commission&apos;s (FTC)
                    16 CFR Part 255, &quot;Guides Concerning the Use of
                    Endorsements and Testimonials in Advertising,&quot; we are
                    required to disclose our affiliate relationships.
                  </p>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-sky-500">
                    <p className="text-gray-700 font-semibold">
                      This website contains affiliate links. When you click on
                      these links and make a purchase, we may earn a commission
                      at no additional cost to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amazon Associates Disclosure */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <DollarSign className="w-8 h-8 text-cyan-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Amazon Associates Program Participation
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Mish Baby Guide is a participant in the Amazon Services LLC
                    Associates Program, an affiliate advertising program
                    designed to provide a means for sites to earn advertising
                    fees by advertising and linking to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                    <li>Amazon.com</li>
                    <li>Amazon.ca (Canada)</li>
                    <li>Amazon.co.uk (United Kingdom)</li>
                    <li>Amazon.de (Germany)</li>
                    <li>Amazon.fr (France)</li>
                    <li>Amazon.it (Italy)</li>
                    <li>Amazon.es (Spain)</li>
                    <li>Amazon.co.jp (Japan)</li>
                    <li>And other international Amazon stores</li>
                  </ul>

                  <div className="bg-cyan-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Official Amazon Associates Disclosure:
                    </h3>
                    <p className="text-gray-700 italic leading-relaxed">
                      &quot;As an Amazon Associate, I earn from qualifying
                      purchases.&quot;
                    </p>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    This means that when you click on a product link on our
                    website and make a purchase on Amazon, we receive a small
                    commission from Amazon. This commission comes at absolutely
                    no additional cost to you—the price you pay remains exactly
                    the same whether you use our affiliate link or navigate to
                    Amazon directly.
                  </p>
                </div>
              </div>
            </div>

            {/* How Affiliate Links Work */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <ExternalLink className="w-8 h-8 text-cyan-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    How Affiliate Links Work
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We want to be completely transparent about how our affiliate
                    program works. Here&apos;s a step-by-step breakdown:
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          You Click a Product Link
                        </h3>
                        <p className="text-gray-700">
                          When you click on a product link or recommendation on
                          our website, you&apos;re taken to Amazon&apos;s
                          website through our unique affiliate link.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          You Shop on Amazon
                        </h3>
                        <p className="text-gray-700">
                          You browse and shop on Amazon as you normally would.
                          You can purchase the recommended product or any other
                          items during your shopping session.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          You Complete Your Purchase
                        </h3>
                        <p className="text-gray-700">
                          When you complete a purchase, Amazon pays us a small
                          commission (typically 1-10% of the purchase price,
                          depending on the product category).
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-bold">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          No Extra Cost to You
                        </h3>
                        <p className="text-gray-700">
                          You pay the exact same price as you would if you went
                          directly to Amazon. The commission comes from
                          Amazon&apos;s marketing budget, not from your pocket.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Important Information About Affiliate Commissions
              </h2>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Zero Additional Cost
                  </h3>
                  <p className="text-gray-700">
                    Using our affiliate links will never increase the price you
                    pay. Amazon&apos;s prices remain the same whether you use
                    our link or not.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    You&apos;re Not Obligated
                  </h3>
                  <p className="text-gray-700">
                    You are never obligated to use our affiliate links. You can
                    always search for products directly on Amazon if you prefer.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    24-Hour Cookie Window
                  </h3>
                  <p className="text-gray-700">
                    Amazon&apos;s affiliate program uses cookies. If you click
                    our link but don&apos;t purchase immediately, we may still
                    earn a commission if you complete your purchase within 24
                    hours (or longer for items added to cart).
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Any Qualifying Purchase
                  </h3>
                  <p className="text-gray-700">
                    We earn a commission on any qualifying purchase you make
                    during your Amazon session, not just the specific product we
                    linked to.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Commitment to Honesty */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <Award className="w-8 h-8 text-cyan-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Our Commitment to Honest Reviews
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    While we do earn commissions from affiliate links, we want
                    to assure you that:
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          We Only Recommend Quality Products
                        </h3>
                        <p className="text-gray-700">
                          We only recommend products that we genuinely believe
                          will be helpful to parents and safe for children. We
                          would never recommend a product solely because it
                          offers a higher commission.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Honest Reviews and Opinions
                        </h3>
                        <p className="text-gray-700">
                          Our reviews reflect our honest opinions based on
                          research, customer feedback, and real parent
                          experiences. We include both pros and cons of
                          products.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Your Trust is Our Priority
                        </h3>
                        <p className="text-gray-700">
                          We&apos;ve built a community of over 200,000 parents
                          across social media. This trust is far more valuable
                          to us than any commission.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Alternative Options
                        </h3>
                        <p className="text-gray-700">
                          When relevant, we mention alternative products and
                          options, even if they don&apos;t generate affiliate
                          income for us.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Research-Based Recommendations
                        </h3>
                        <p className="text-gray-700">
                          Our product recommendations are based on thorough
                          research, safety standards, customer reviews, and
                          expert opinions—not commission rates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* No Guarantees */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Product Performance and Safety Disclaimer
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                While we carefully research and recommend products, we must
                emphasize:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>We do not manufacture, sell, or ship any products</li>
                <li>
                  We are not responsible for product quality, safety, or
                  performance
                </li>
                <li>
                  We do not provide warranties or guarantees for any products
                </li>
                <li>
                  Product availability, pricing, and specifications may change
                  without notice
                </li>
                <li>
                  Always check current product information, reviews, and safety
                  ratings on Amazon before purchasing
                </li>
                <li>
                  Consult with healthcare professionals for medical or safety
                  concerns
                </li>
              </ul>
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500 mt-4">
                <p className="text-gray-700 font-semibold">
                  Important: You are solely responsible for evaluating whether
                  any product is appropriate for your child. Every child is
                  different, and what works for one family may not work for
                  another.
                </p>
              </div>
            </div>

            {/* Relationship with Amazon */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Relationship with Amazon
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                It&apos;s important to understand our relationship with Amazon:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold">•</span>
                  <p className="text-gray-700">
                    We are <strong>independent affiliates</strong>—we are not
                    employed by Amazon nor do we represent Amazon
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold">•</span>
                  <p className="text-gray-700">
                    Amazon does not review, approve, or endorse our content
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold">•</span>
                  <p className="text-gray-700">
                    All customer service, returns, and shipping are handled by
                    Amazon, not by us
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold">•</span>
                  <p className="text-gray-700">
                    Amazon&apos;s terms of service, return policy, and privacy
                    policy apply to all purchases
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold">•</span>
                  <p className="text-gray-700">
                    We have no control over Amazon&apos;s pricing, inventory, or
                    shipping
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Note:</strong> Amazon and the Amazon logo are
                  trademarks of Amazon.com, Inc. or its affiliates.
                </p>
              </div>
            </div>

            {/* Why We Use Affiliate Links */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why We Use Affiliate Marketing
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We believe in being transparent about why we use affiliate
                links:
              </p>
              <div className="space-y-4">
                <div className="bg-cyan-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Sustaining Our Website
                  </h3>
                  <p className="text-gray-700">
                    Affiliate commissions help us cover the costs of running
                    this website, including hosting, domain fees, content
                    creation, and maintenance.
                  </p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Creating Quality Content
                  </h3>
                  <p className="text-gray-700">
                    The income allows us to invest time in researching products,
                    writing detailed reviews, and creating helpful guides for
                    parents.
                  </p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Expanding Our Reach
                  </h3>
                  <p className="text-gray-700">
                    Through our partnership with Amazon, we can help parents
                    worldwide access quality products, even in countries where
                    our main store doesn&apos;t ship.
                  </p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Supporting Our Mission
                  </h3>
                  <p className="text-gray-700">
                    Affiliate income enables us to continue providing free
                    content and resources to our community of parents.
                  </p>
                </div>
              </div>
            </div>

            {/* Other Affiliate Programs */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Other Affiliate Relationships
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                While Amazon Associates is our primary affiliate program, we may
                occasionally participate in other affiliate programs with baby
                product retailers and brands. We will always disclose these
                relationships clearly when they apply.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The same principles apply to all our affiliate relationships: we
                only recommend products we believe in, and our honest opinions
                are never compromised by potential commissions.
              </p>
            </div>

            {/* Updates to Disclosure */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Updates to This Disclosure
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this affiliate disclaimer from time to time to
                reflect changes in our affiliate relationships or legal
                requirements. The &quot;Last Updated&quot; date at the top of
                this page will be revised accordingly. We encourage you to
                review this page periodically.
              </p>
            </div>

            {/* Questions Section */}
            <div className="bg-linear-to-r from-cyan-500 to-sky-600 rounded-2xl p-8 md:p-12 text-white mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Questions About Our Affiliate Relationships?
              </h2>
              <p className="leading-relaxed mb-4">
                We believe in complete transparency. If you have any questions
                about our affiliate relationships, how we choose products to
                recommend, or our review process, please don&apos;t hesitate to
                reach out.
              </p>
              <div className="space-y-2">
                <p className="font-semibold">Contact Mish Baby Guide:</p>
                <p>Website: mishbaby-guide.vercel.app</p>
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
                <p className="mt-4 text-sm opacity-90">
                  Follow us on social media for daily parenting tips and product
                  updates!
                </p>
              </div>
            </div>

            {/* Thank You Note */}
            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Thank You for Your Support
              </h2>
              <p className="text-gray-700 leading-relaxed text-center mb-4">
                By using our affiliate links, you&apos;re helping us continue to
                provide valuable content and resources to parents everywhere—at
                no extra cost to you.
              </p>
              <p className="text-gray-700 leading-relaxed text-center font-semibold">
                We truly appreciate your trust and support! ❤️
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
