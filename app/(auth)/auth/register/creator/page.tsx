// app/(auth)/auth/register/creator/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getAllCreatorTypes, CreatorType } from "@/types/creator";

export default function CreatorRegisterPage() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [creatorType, setCreatorType] = useState<CreatorType | null>(null);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const creatorTypes = getAllCreatorTypes();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!creatorType) {
            setErrorMsg("Please select your creator specialization");
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            // 1. Create Supabase auth user
            const { data: authData, error: authError } = await supabaseBrowser.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: "CREATOR",
                    },
                },
            });

            if (authError) {
                setErrorMsg(authError.message);
                return;
            }

            if (!authData.user) {
                setErrorMsg("Failed to create account");
                return;
            }

            // 2. Create User record in database
            const userResponse = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    role: "CREATOR",
                    supabaseUserId: authData.user.id,
                }),
            });

            if (!userResponse.ok) {
                throw new Error("Failed to create user profile");
            }

            // 3. Setup creator profile with selected type
            const setupResponse = await fetch("/api/creator/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    creatorType,
                }),
            });

            if (!setupResponse.ok) {
                throw new Error("Failed to setup creator profile");
            }

            // 4. Redirect to type-specific dashboard
            const typeInfo = creatorTypes.find((t) => t.type === creatorType);
            if (typeInfo) {
                router.push(`/creator/${typeInfo.slug}/dashboard`);
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "Unexpected error while signing up.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
            <div className="w-full max-w-2xl">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-50">
                            Join as a Creator 🎨
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Showcase your work and connect with clients
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">Full name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500 transition-colors"
                                required
                            />
                        </div>

                        {/* Creator Type Selection */}
                        <div className="space-y-3">
                            <label className="text-xs font-medium text-slate-300">
                                Your Specialization *
                            </label>
                            <div className="grid gap-3 md:grid-cols-2">
                                {creatorTypes.map((type) => (
                                    <button
                                        key={type.type}
                                        type="button"
                                        onClick={() => setCreatorType(type.type)}
                                        className={`group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all ${creatorType === type.type
                                                ? `border-white/40 bg-gradient-to-br ${type.color}`
                                                : "border-white/10 bg-white/5 hover:border-white/20"
                                            }`}
                                    >
                                        <div
                                            className={`absolute inset-0 ${creatorType === type.type
                                                    ? "bg-slate-950/50"
                                                    : "bg-slate-950/70 group-hover:bg-slate-950/60"
                                                }`}
                                        ></div>

                                        <div className="relative flex items-start gap-3">
                                            <div className="text-2xl">{type.icon}</div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-white text-sm mb-1">
                                                    {type.label}
                                                </h3>
                                                <p className="text-xs text-slate-300 line-clamp-2">
                                                    {type.description}
                                                </p>
                                            </div>
                                            {creatorType === type.type && (
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white text-xs">
                                                    ✓
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Error Message */}
                        {errorMsg && (
                            <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-3">
                                <p className="text-xs text-red-400">{errorMsg}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02]"
                        >
                            {loading ? "Creating account..." : "Create Creator Account"}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 space-y-3 text-center">
                        <p className="text-xs text-slate-400">
                            Already have an account?{" "}
                            <Link
                                href="/auth/login"
                                className="font-medium text-orange-400 hover:text-orange-300 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                        <p className="text-xs text-slate-500">
                            Not a creator?{" "}
                            <Link
                                href="/auth/register"
                                className="font-medium text-slate-400 hover:text-slate-300 transition-colors"
                            >
                                Register as Buyer/Supplier
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
