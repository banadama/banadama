// app/(affiliate)/earnings/page.tsx
"use client";

export default function AffiliateEarningsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-slate-50">
                    Earnings History
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                    View detailed breakdown of all your commissions and conversions
                </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
                <p className="text-sm text-slate-400">
                    Earnings history coming soon
                </p>
                <p className="mt-2 text-xs text-slate-500">
                    Track signups (₦50 each), sales commissions (1-3%), and verified supplier bonuses (₦100 each)
                </p>
            </div>
        </div>
    );
}
