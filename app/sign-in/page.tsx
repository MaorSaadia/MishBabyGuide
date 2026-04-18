import { Suspense } from "react";

import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Sign In",
  description: "Sign in to save baby products across devices.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <Suspense>
        <AuthForm mode="sign-in" />
      </Suspense>
    </div>
  );
}
