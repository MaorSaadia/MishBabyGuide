import { NextResponse } from "next/server";

import { getAuthenticatedAdminUser, getNewsletterRecipientsOverview } from "@/lib/newsletter-admin";

export async function GET() {
  try {
    const adminUser = await getAuthenticatedAdminUser();

    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const overview = await getNewsletterRecipientsOverview();

    return NextResponse.json(overview);
  } catch (error) {
    console.error("Newsletter recipients error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load newsletter recipients",
      },
      { status: 500 },
    );
  }
}
