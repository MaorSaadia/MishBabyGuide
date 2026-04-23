"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { flushPendingSavedProduct } from "@/components/PendingSavedProductSync";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
    >
      <path
        d="M21.805 12.23c0-.79-.071-1.549-.203-2.277H12v4.313h5.488a4.695 4.695 0 0 1-2.035 3.082v2.555h3.293c1.928-1.775 3.059-4.395 3.059-7.673Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.076-.916 6.768-2.482l-3.293-2.555c-.916.614-2.087.977-3.475.977-2.672 0-4.938-1.804-5.747-4.23H2.848v2.635A9.998 9.998 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.253 13.71A5.996 5.996 0 0 1 5.931 12c0-.594.102-1.17.322-1.71V7.655H2.848A9.998 9.998 0 0 0 2 12c0 1.614.387 3.142 1.068 4.345l3.185-2.635Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.06c1.502 0 2.85.516 3.912 1.529l2.935-2.935C17.07 2.998 14.754 2 12 2a9.998 9.998 0 0 0-9.152 5.655l3.405 2.635C7.062 7.864 9.328 6.06 12 6.06Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/saved";
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function subscribeToNewsletter() {
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        source: "signup",
      }),
    });

    if (!response.ok && response.status !== 409) {
      console.warn("Newsletter signup did not complete.");
    }
  }

  async function finishSignedInFlow() {
    await flushPendingSavedProduct().catch(() => false);
    router.push(next);
    router.refresh();
  }

  async function handleEmailPasswordSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setIsSubmittingForm(true);
    setMessage(null);

    try {
      if (mode === "sign-up") {
        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: name ? { name } : undefined,
          },
        });

        if (error) throw error;

        if (newsletter) {
          await subscribeToNewsletter();
        }

        if (data.session) {
          toast.success("Account created.");
          await finishSignedInFlow();
          return;
        }

        setMessage("Check your email to confirm your account, then sign in.");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Signed in.");
      await finishSignedInFlow();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    } finally {
      setIsSubmittingForm(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsGoogleLoading(false);
    }
  }

  const isSignUp = mode === "sign-up";

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-950 dark:text-white">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Save baby products and pick up where you left off.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isSubmittingForm}
        className="mb-4 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-800"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>

      <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-gray-400">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        or
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
        {isSignUp && (
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              autoComplete="name"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            autoComplete="email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
        </div>

        {isSignUp && (
          <label className="flex items-start gap-3 rounded-lg bg-cyan-50 p-3 text-sm text-gray-700 dark:bg-cyan-950/30 dark:text-gray-200">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(event) => setNewsletter(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
            />
            Send me baby product finds, review updates, and practical guides.
          </label>
        )}

        {message && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmittingForm || isGoogleLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:opacity-60"
        >
          {isSubmittingForm && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
        {isSignUp ? "Already have an account?" : "New here?"}{" "}
        <Link
          href={isSignUp ? `/sign-in?next=${encodeURIComponent(next)}` : `/sign-up?next=${encodeURIComponent(next)}`}
          className="font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
