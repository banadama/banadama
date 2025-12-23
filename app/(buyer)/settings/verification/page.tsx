// app/(buyer)/settings/verification/page.tsx
"use client";

import { useVerification } from "@/hooks/useVerification";

export default function BuyerVerificationPage() {
    const { data, loading, error, submitVerification, submitting } = useVerification();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-slate-400">Loading verification…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
                <p className="text-rose-400">{error}</p>
            </div>
        );
    }

    const status = data?.status ?? "UNVERIFIED";

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-semibold">Account Verification</h1>
                <p className="text-sm text-slate-400">
                    Verify your identity to increase limits and build trust with Banadama.
                </p>
            </header>

            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-400">Current status</p>
                        <p className="text-lg font-medium">
                            {status === "UNVERIFIED" && "Unverified"}
                            {status === "PENDING" && "Pending review"}
                            {status === "APPROVED" && "Verified"}
                            {status === "REJECTED" && "Rejected"}
                        </p>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status === "APPROVED"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40"
                                : status === "PENDING"
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/40"
                                    : status === "REJECTED"
                                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/40"
                                        : "bg-slate-700 text-slate-200 border border-slate-600"
                            }`}
                    >
                        {status}
                    </span>
                </div>

                {status === "REJECTED" && data?.verification?.rejectionReason && (
                    <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3">
                        <p className="text-xs font-semibold text-rose-400">Rejection Reason:</p>
                        <p className="mt-1 text-sm text-rose-300">{data.verification.rejectionReason}</p>
                    </div>
                )}
            </section>

            {status !== "APPROVED" && (
                <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                    <h2 className="text-lg font-semibold">Submit verification</h2>
                    <p className="text-sm text-slate-400">
                        Upload a valid ID document and basic KYC information. Our team will review within 24–72 hours.
                    </p>

                    {/* later: replace with real upload + form */}
                    <div className="grid gap-3 md:grid-cols-2">
                        <button className="rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-left hover:border-slate-500 transition">
                            📄 Upload ID document
                        </button>
                        <button className="rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-left hover:border-slate-500 transition">
                            📋 Upload address / utility bill
                        </button>
                    </div>

                    <button
                        onClick={() =>
                            submitVerification({
                                // Example payload - replace with real form data
                                idType: "NIN",
                                idNumber: "123456789",
                                address: "123 Main St, Lagos",
                            })
                        }
                        disabled={submitting}
                        className="mt-2 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {submitting ? "Submitting..." : "Submit for review"}
                    </button>
                </section>
            )}

            {status === "APPROVED" && (
                <section className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">✓</span>
                        <div>
                            <h3 className="font-semibold text-emerald-400">Account Verified!</h3>
                            <p className="mt-1 text-sm text-emerald-300">
                                Your account has been verified. You now have access to increased limits and premium features.
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
