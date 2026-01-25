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

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name = "there" }: WelcomeEmailProps) => {
  const baseUrl = "https://www.mishbabyguide.com";

  return (
    <Html>
      <Head />
      <Preview>Welcome to MishBabyGuide Newsletter!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="60"
              height="60"
              alt="MishBabyGuide"
              style={logo}
            />
            <Heading style={h1}>Welcome to MishBabyGuide! 👶</Heading>
          </Section>

          <Section style={section}>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Thanks for subscribing to our newsletter! We&apos;re thrilled to
              have you join our community of parents.
            </Text>
            <Text style={text}>
              <strong>Here&apos;s what you&apos;ll get every week:</strong>
            </Text>
            <ul style={list}>
              <li style={listItem}>📦 10 new baby products from Amazon</li>
              <li style={listItem}>⭐ 2 in-depth product reviews</li>
              <li style={listItem}>📝 1 helpful parenting article</li>
            </ul>
            <Text style={text}>
              We carefully curate each recommendation to help you find the best
              products for your little one.
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={baseUrl}>
              Explore Our Website
            </Button>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              If you didn&apos;t subscribe, you can safely ignore this email.
            </Text>
            <Text style={footerLinks}>
              <Link
                href={`${baseUrl}/newsletter/unsubscribe`}
                style={footerLink}
              >
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
  borderRadius: "8px",
};

const header = {
  padding: "40px 24px",
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
  margin: "16px 0 0",
};

const section = {
  padding: "24px",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const list = {
  paddingLeft: "20px",
  margin: "16px 0",
};

const listItem = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "28px",
  margin: "8px 0",
};

const buttonContainer = {
  padding: "0 24px 24px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#06b6d4",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
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
  margin: "0",
};

const footerLink = {
  color: "#06b6d4",
  textDecoration: "none",
};
