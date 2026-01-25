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
  Row,
  Column,
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

          {/* New Products Section */}
          <Section style={section}>
            <Heading style={h2}>📦 New Products This Week</Heading>
            <Text style={sectionSubtitle}>
              10 hand-picked products we think you&apos;ll love
            </Text>

            {/* First 2 products - Featured (larger) */}
            {products.slice(0, 2).map((product, index) => (
              <Section key={index} style={productCard}>
                <Img
                  src={product.image}
                  alt={product.title}
                  style={productImageLarge}
                />
                <Heading style={productTitle}>{product.title}</Heading>
                <Text style={productExcerpt}>{product.excerpt}</Text>
                <Button style={button} href={product.url}>
                  View Product →
                </Button>
              </Section>
            ))}

            {/* Remaining 8 products - Grid (smaller) */}
            <Row style={gridRow}>
              {products.slice(2, 10).map((product, index) => (
                <Column key={index} style={gridColumn}>
                  <Link href={product.url} style={gridLink}>
                    <Img
                      src={product.image}
                      alt={product.title}
                      style={productImageSmall}
                    />
                    <Text style={gridProductTitle}>{product.title}</Text>
                  </Link>
                </Column>
              ))}
            </Row>
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
              <Section key={index} style={reviewCard}>
                <Row>
                  <Column style={reviewImageColumn}>
                    <Img
                      src={review.image}
                      alt={review.title}
                      style={reviewImage}
                    />
                  </Column>
                  <Column style={reviewContent}>
                    <Heading style={reviewTitle}>{review.title}</Heading>
                    <Text style={reviewExcerpt}>{review.excerpt}</Text>
                    <Link href={review.url} style={linkButton}>
                      Read Review →
                    </Link>
                  </Column>
                </Row>
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
              <Link
                href={`${baseUrl}/newsletter/unsubscribe`}
                style={footerLink}
              >
                Unsubscribe
              </Link>
              {" | "}
              <Link
                href={`${baseUrl}/newsletter/preferences`}
                style={footerLink}
              >
                Preferences
              </Link>
              {" | "}
              <Link href={`${baseUrl}`} style={footerLink}>
                Visit Website
              </Link>
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} MishBabyGuide. All rights reserved.
            </Text>
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
};

const h2 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 8px",
};

const sectionSubtitle = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 24px",
};

const productCard = {
  marginBottom: "24px",
  padding: "20px",
  backgroundColor: "#f9fafb",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const productImageLarge = {
  width: "100%",
  height: "auto",
  borderRadius: "8px",
  marginBottom: "16px",
};

const productTitle = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 8px",
};

const productExcerpt = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 16px",
};

const button = {
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
};

const gridRow = {
  marginTop: "16px",
};

const gridColumn = {
  width: "48%",
  verticalAlign: "top" as const,
  padding: "8px",
};

const gridLink = {
  textDecoration: "none",
  display: "block",
};

const productImageSmall = {
  width: "100%",
  height: "auto",
  borderRadius: "8px",
  marginBottom: "8px",
};

const gridProductTitle = {
  color: "#1f2937",
  fontSize: "13px",
  fontWeight: "500",
  margin: "0",
  lineHeight: "18px",
};

const reviewCard = {
  marginBottom: "20px",
  padding: "20px",
  backgroundColor: "#fef3c7",
  borderRadius: "12px",
  border: "1px solid #fde68a",
};

const reviewImageColumn = {
  width: "140px",
  verticalAlign: "top" as const,
};

const reviewImage = {
  width: "120px",
  height: "120px",
  borderRadius: "8px",
  objectFit: "cover" as const,
};

const reviewContent = {
  verticalAlign: "top" as const,
  paddingLeft: "16px",
};

const reviewTitle = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 8px",
};

const reviewExcerpt = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "18px",
  margin: "0 0 12px",
};

const linkButton = {
  color: "#06b6d4",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
};

const blogCard = {
  marginTop: "16px",
  padding: "20px",
  backgroundColor: "#f0f9ff",
  borderRadius: "12px",
  border: "1px solid #bae6fd",
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
  margin: "0",
};
