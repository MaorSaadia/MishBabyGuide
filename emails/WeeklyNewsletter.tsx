// emails/WeeklyNewsletter.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Product {
  title: string;
  excerpt: string;
  image: string;
  url: string;
}

interface Review {
  title: string;
  excerpt: string;
  image: string;
  url: string;
}

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  url: string;
}

interface WeeklyNewsletterProps {
  products: Product[];
  reviews: Review[];
  blogPost: BlogPost;
  date: string;
  unsubscribeUrl?: string;
}

export const WeeklyNewsletter = ({
  products = [],
  reviews = [],
  blogPost,
  date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  unsubscribeUrl = "",
}: WeeklyNewsletterProps) => {
  const baseUrl = "https://www.mishbabyguide.com";

  return (
    <Html>
      <Head />
      <Preview>Your weekly baby product picks and parenting tips</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="50"
              height="50"
              alt="MishBabyGuide"
              style={logo}
            />
            <Heading style={h1}>MishBabyGuide</Heading>
            <Text style={subtitle}>Your Weekly Baby Product Picks</Text>
            <Text style={dateText}>{date}</Text>
          </Section>

          {/* Introduction */}
          <Section style={section}>
            <Text style={text}>
              Hi there! 👋
              <br />
              <br />
              Here&apos;s your weekly roundup of the best baby products on
              Amazon, our latest reviews, and helpful parenting articles.
            </Text>
          </Section>

          {/* New Products Section - ALL 10 in uniform grid */}
          <Section style={section}>
            <Heading style={h2}>📦 New Products This Week</Heading>
            <Text style={sectionSubtitle}>
              10 hand-picked products we think you&apos;ll love
            </Text>

            {/* Product Grid - mobile-friendly single column */}
            {products.slice(0, 10).map((product, index) => (
              <Section key={index} style={productCardMobile}>
                <Link href={product.url} style={productLink}>
                  <Img
                    src={product.image}
                    alt={product.title}
                    style={productImageMobile}
                  />
                  <Heading style={productTitleMobile}>{product.title}</Heading>
                  <Text style={productExcerptMobile}>
                    {product.excerpt.length > 100
                      ? `${product.excerpt.substring(0, 100)}...`
                      : product.excerpt}
                  </Text>
                </Link>
                <Button style={button} href={product.url}>
                  View Product →
                </Button>
              </Section>
            ))}
          </Section>

          {/* Divider */}
          <Section style={divider} />

          {/* Reviews Section */}
          <Section style={section}>
            <Heading style={h2}>⭐ Featured Reviews</Heading>
            <Text style={sectionSubtitle}>
              In-depth analysis with pros & cons
            </Text>

            {reviews.slice(0, 2).map((review, index) => (
              <Section key={index} style={reviewCardMobile}>
                <Link href={review.url} style={productLink}>
                  <Img
                    src={review.image}
                    alt={review.title}
                    style={reviewImageMobile}
                  />
                  <Heading style={reviewTitleMobile}>{review.title}</Heading>
                  <Text style={reviewExcerptMobile}>{review.excerpt}</Text>
                </Link>
                <Link href={review.url} style={reviewButton}>
                  Read Review →
                </Link>
              </Section>
            ))}
          </Section>

          {/* Divider */}
          <Section style={divider} />

          {/* Blog Post Section */}
          {blogPost && (
            <Section style={section}>
              <Heading style={h2}>📝 Latest Article</Heading>
              <Section style={blogCard}>
                <Img
                  src={blogPost.image}
                  alt={blogPost.title}
                  style={blogImage}
                />
                <Heading style={blogTitle}>{blogPost.title}</Heading>
                <Text style={blogExcerpt}>{blogPost.excerpt}</Text>
                <Button style={button} href={blogPost.url}>
                  Read Article →
                </Button>
              </Section>
            </Section>
          )}

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because you subscribed to
              MishBabyGuide newsletter.
            </Text>
            <Text style={footerLinks}>
              <Link href={`${baseUrl}`} style={footerLink}>
                Visit Website
              </Link>
              {" | "}
              {unsubscribeUrl ? (
                <>
                  <Link href={unsubscribeUrl} style={footerLink}>
                    Unsubscribe
                  </Link>
                </>
              ) : null}
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} MishBabyGuide. All rights reserved.
            </Text>
            {unsubscribeUrl && (
              <Text style={footerTextSmall}>
                MishBabyGuide • Your trusted source for baby product
                recommendations
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WeeklyNewsletter;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 24px",
  textAlign: "center" as const,
  backgroundColor: "#06b6d4",
  borderRadius: "8px 8px 0 0",
};

const logo = {
  margin: "0 auto",
  borderRadius: "50%",
};

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "16px 0 8px",
};

const subtitle = {
  color: "#e0f2fe",
  fontSize: "16px",
  margin: "0",
};

const dateText = {
  color: "#cffafe",
  fontSize: "14px",
  margin: "8px 0 0",
};

const section = {
  padding: "24px",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  paddingLeft: "8px",
};

const h2 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 8px",
  paddingLeft: "8px",
};

const sectionSubtitle = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 24px",
  paddingLeft: "8px",
};

// New product styles - mobile-friendly single column
const productCardMobile = {
  marginBottom: "20px",
  padding: "16px",
  backgroundColor: "#f9fafb",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  width: "100%",
  boxSizing: "border-box" as const,
};

const productLink = {
  textDecoration: "none",
  display: "block",
};

const productImageMobile = {
  width: "100%",
  maxWidth: "400px",
  height: "auto",
  borderRadius: "8px",
  marginBottom: "12px",
  display: "block",
};

const productTitleMobile = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 8px",
  lineHeight: "22px",
};

const productExcerptMobile = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 12px",
};

const button = {
  backgroundColor: "#06b6d4",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  width: "auto",
  maxWidth: "100%",
  boxSizing: "border-box" as const,
};

// Review styles - mobile-friendly single column
const reviewCardMobile = {
  marginBottom: "20px",
  padding: "16px",
  backgroundColor: "#fef3c7",
  borderRadius: "12px",
  border: "1px solid #fde68a",
  width: "100%",
};

const reviewImageMobile = {
  width: "100%",
  maxWidth: "300px",
  height: "auto",
  borderRadius: "8px",
  marginBottom: "12px",
  display: "block",
};

const reviewTitleMobile = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 8px",
  lineHeight: "24px",
};

const reviewExcerptMobile = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 12px",
};

const reviewButton = {
  backgroundColor: "#06b6d4",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  width: "100%",
  boxSizing: "border-box" as const,
};

const blogCard = {
  marginTop: "16px",
  padding: "20px",
  backgroundColor: "#f0f9ff",
  borderRadius: "12px",
  border: "1px solid #bae6fd",
  boxSizing: "border-box" as const,
};

const blogImage = {
  width: "100%",
  height: "auto",
  borderRadius: "8px",
  marginBottom: "16px",
};

const blogTitle = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const blogExcerpt = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 16px",
};

const divider = {
  borderTop: "1px solid #e5e7eb",
  margin: "32px 0",
};

const footer = {
  padding: "24px",
  textAlign: "center" as const,
  backgroundColor: "#f9fafb",
  borderRadius: "0 0 8px 8px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 12px",
};

const footerLinks = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "0 0 8px",
};

const footerLink = {
  color: "#06b6d4",
  textDecoration: "none",
};

const footerCopyright = {
  color: "#9ca3af",
  fontSize: "11px",
  margin: "8px 0 4px",
};

const footerTextSmall = {
  color: "#9ca3af",
  fontSize: "10px",
  margin: "4px 0 0",
  lineHeight: "14px",
};
