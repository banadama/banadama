"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            const { error } = await supabaseBrowser.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) {
                setErrorMsg(error.message);
            } else {
                setSent(true);
            }
        } catch (err) {
            setErrorMsg("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center">
                <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center">
                    <div className="text-5xl mb-4">📧</div>
                    <h1 className="text-xl font-semibold text-slate-50">Check Your Email</h1>
                    <p className="mt-3 text-sm text-slate-400">
                        We&apos;ve sent a password reset link to <strong className="text-slate-200">{email}</strong>
                    </p>
                    <p className="mt-4 text-xs text-slate-500">
                        Didn&apos;t receive the email? Check your spam folder or{" "}
                        <button
                            onClick={() => setSent(false)}
                            className="text-emerald-400 hover:text-emerald-300"
                        >
                            try again
                        </button>
                    </p>
                    <Link
                        href="/auth/login"
                        className="mt-6 inline-block text-sm text-emerald-400 hover:text-emerald-300"
                    >
                        ← Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
                <h1 className="text-xl font-semibold text-slate-50 text-center">
                    Forgot Password?
                </h1>
                <p className="mt-2 text-sm text-slate-400 text-center">
                    Enter your email and we&apos;ll send you a reset link
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {errorMsg && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
                            {errorMsg}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs text-slate-300">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
