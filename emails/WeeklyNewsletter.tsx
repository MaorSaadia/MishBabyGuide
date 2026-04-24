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

interface WeeklyNewsletterProps {
  products: Product[];
  date: string;
  weekKey?: string;
  trackingPixelUrl?: string;
  unsubscribeUrl?: string;
}

export const WeeklyNewsletter = ({
  products = [],
  date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  weekKey,
  trackingPixelUrl = "",
  unsubscribeUrl = "",
}: WeeklyNewsletterProps) => {
  const baseUrl = "https://www.mishbabyguide.com";

  return (
    <Html>
      <Head />
      <Preview>Your weekly baby product recommendations are ready</Preview>
      <Body style={main}>
        <Container style={container}>
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

          <Section style={section}>
            <Text style={text}>
              Hi there!
              <br />
              <br />
              Here&apos;s this week&apos;s product-focused roundup from
              MishBabyGuide. We picked practical baby finds worth checking this
              week so you can get straight to the recommendations.
            </Text>
          </Section>

          {weekKey ? (
            <Section style={weekKeySection}>
              <Text style={weekKeyText}>Weekly send: {weekKey}</Text>
            </Section>
          ) : null}

          <Section style={section}>
            <Heading style={h2}>This Week&apos;s Product Picks</Heading>
            <Text style={sectionSubtitle}>
              Fresh baby recommendations curated for this week
            </Text>

            {products.slice(0, 10).map((product, index) => (
              <Section key={index} style={productCard}>
                <Link href={product.url} style={productLink}>
                  <Img
                    src={product.image}
                    alt={product.title}
                    style={productImage}
                  />
                  <Heading style={productTitle}>{product.title}</Heading>
                  <Text style={productExcerpt}>
                    {product.excerpt.length > 120
                      ? `${product.excerpt.substring(0, 120)}...`
                      : product.excerpt}
                  </Text>
                </Link>
                <Button style={button} href={product.url}>
                  View Product
                </Button>
              </Section>
            ))}
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because you subscribed to
              MishBabyGuide updates or created an account with us.
            </Text>
            <Text style={footerLinks}>
              <Link href={baseUrl} style={footerLink}>
                Visit Website
              </Link>
              {unsubscribeUrl ? (
                <>
                  {" | "}
                  <Link href={unsubscribeUrl} style={footerLink}>
                    Unsubscribe
                  </Link>
                </>
              ) : null}
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} MishBabyGuide. All rights reserved.
            </Text>
          </Section>

          {trackingPixelUrl ? (
            <Img
              src={trackingPixelUrl}
              alt=""
              width="1"
              height="1"
              style={trackingPixel}
            />
          ) : null}
        </Container>
      </Body>
    </Html>
  );
};

export default WeeklyNewsletter;

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

const weekKeySection = {
  padding: "0 24px",
};

const weekKeyText = {
  color: "#64748b",
  fontSize: "12px",
  margin: "0",
  paddingLeft: "8px",
};

const productCard = {
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

const productImage = {
  width: "100%",
  maxWidth: "400px",
  height: "auto",
  borderRadius: "8px",
  marginBottom: "12px",
  display: "block",
};

const productTitle = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 8px",
  lineHeight: "22px",
};

const productExcerpt = {
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

const trackingPixel = {
  display: "block",
  width: "1px",
  height: "1px",
};
