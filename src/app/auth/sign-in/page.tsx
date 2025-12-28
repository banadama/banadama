"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function SignInPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get("from") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    let finalRedirect = redirectTo;
    let role = "buyer";
    let isAdmin = false;
    let adminLevel = "none";

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, is_admin, admin_level")
        .eq("id", data.user.id)
        .single();

      if (profile?.role) role = profile.role;
      if (typeof profile?.is_admin === "boolean") isAdmin = profile.is_admin;
      if (profile?.admin_level) adminLevel = profile.admin_level;

      // Set cookies so middleware can read
      if (typeof document !== "undefined") {
        const maxAge = 60 * 60 * 24 * 7; // 7 days

        document.cookie = `banadama-role=${role}; path=/; max-age=${maxAge};`;
        document.cookie = `banadama-is-admin=${
          isAdmin ? "true" : "false"
        }; path=/; max-age=${maxAge};`;
        document.cookie = `banadama-admin-level=${adminLevel}; path=/; max-age=${maxAge};`;
      }

      // Redirect logic
      if (isAdmin) {
        // Admin – default goes to admin panel
        if (redirectTo.startsWith("/admin")) {
          finalRedirect = redirectTo;
        } else {
          finalRedirect = "/admin/verification";
        }
      } else {
        // Normal user – do not allow visiting /admin even if requested
        if (redirectTo.startsWith("/admin")) {
          finalRedirect = "/dashboard";
        }
      }
    }

    setLoading(false);
    router.push(finalRedirect);
  }

  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">Sign in to Banadama</h1>
      <p className="text-sm text-slate-600 mb-4">
        Enter your email and password to continue.
      </p>

      {error && (
        <div className="mb-3 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black text-white text-sm px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-600">
        Don&apos;t have an account yet?{" "}
        <a href="/auth/sign-up" className="underline">
          Sign up
        </a>
      </p>
    </main>
  );
}
