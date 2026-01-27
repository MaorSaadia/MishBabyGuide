// lib/unsubscribe.ts
import crypto from "crypto";

/**
 * Generate a secure unsubscribe token for an email address
 * @param email - The subscriber's email address
 * @returns A base64-encoded token
 */
export function generateUnsubscribeToken(email: string): string {
  const timestamp = Date.now().toString();
  const secret = process.env.UNSUBSCRIBE_SECRET || "your-secret-key";

  // Create HMAC hash
  const hash = crypto
    .createHmac("sha256", secret)
    .update(`${email}:${timestamp}`)
    .digest("hex");

  // Combine email, timestamp, and hash
  const tokenData = `${email}:${timestamp}:${hash}`;

  // Encode to base64
  return Buffer.from(tokenData).toString("base64");
}

/**
 * Generate an unsubscribe URL with token
 * @param email - The subscriber's email address
 * @param baseUrl - The base URL of your site (optional, defaults to env var)
 * @returns Complete unsubscribe URL
 */
export function generateUnsubscribeUrl(
  email: string,
  baseUrl?: string,
): string {
  const token = generateUnsubscribeToken(email);
  const siteUrl =
    baseUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.mishbabyguide.com";

  return `${siteUrl}/unsubscribe?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
}

/**
 * Verify an unsubscribe token
 * @param token - The base64-encoded token
 * @param email - The email to verify against
 * @returns true if valid, false otherwise
 */
export function verifyUnsubscribeToken(token: string, email: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [tokenEmail, timestamp, hash] = decoded.split(":");

    if (tokenEmail !== email) {
      return false;
    }

    // Check expiry (30 days)
    const tokenDate = parseInt(timestamp);
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (now - tokenDate > thirtyDays) {
      return false;
    }

    // Verify hash
    const secret = process.env.UNSUBSCRIBE_SECRET || "your-secret-key";
    const expectedHash = crypto
      .createHmac("sha256", secret)
      .update(`${tokenEmail}:${timestamp}`)
      .digest("hex");

    return hash === expectedHash;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}
