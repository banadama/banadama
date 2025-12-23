"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiPost } from "@/lib/api";
import type { Role } from "@prisma/client";

interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    role: Role;
    country?: string | null;
  };
  dashboardUrl: string;
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await apiPost<LoginResponse>("/api/auth/login", {
        email,
        password,
      });

      if (result.success) {
        // Redirect to role-based dashboard or specified redirect
        const targetUrl = redirect || result.dashboardUrl;
        router.push(targetUrl);
      } else {
        setErrorMsg("Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMsg(error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <h1 className="text-xl font-semibold text-slate-50">
          Sign in to Banadama
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Access your dashboard and manage your business.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
              <p className="text-xs text-red-400">{errorMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-emerald-500 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <Link
            href="/auth/forgot-password"
            className="hover:text-emerald-300 transition-colors"
          >
            Forgot password?
          </Link>
          <span>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Create one
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
