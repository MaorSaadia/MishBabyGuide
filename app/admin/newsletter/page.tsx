import { redirect } from "next/navigation";

import NewsletterAdminDashboard from "@/components/admin/NewsletterAdminDashboard";
import {
  getNewsletterRecipientsOverview,
  isAdminEmail,
} from "@/lib/newsletter-admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Newsletter Admin",
  description: "Manage and send the weekly MishBabyGuide newsletter.",
};

export default async function AdminNewsletterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/sign-in?next=/admin/newsletter");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/");
  }

  const { recipients, summary } = await getNewsletterRecipientsOverview();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            Admin
          </p>
          <h1 className="text-4xl font-bold text-slate-950 dark:text-white">
            Newsletter Control Room
          </h1>
          <p className="max-w-3xl text-slate-600 dark:text-slate-300">
            Review the Supabase recipient list, check this week&apos;s delivery
            status, and send the Monday newsletter manually when you are ready.
          </p>
        </div>

        <NewsletterAdminDashboard
          initialRecipients={recipients}
          initialSummary={summary}
          adminEmail={user.email}
        />
      </div>
    </div>
  );
}
