// app/(affiliate)/payouts/page.tsx
"use client";

export default function AffiliatePayoutsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-slate-50">
                    Payout Requests
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                    Request withdrawals and track payout status
                </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
                <p className="text-sm text-slate-400">
                    Payout management coming soon
                </p>
                <p className="mt-2 text-xs text-slate-500">
                    Minimum payout: ₦5,000 • Processing time: 7 business days
                </p>
            </div>
        </div>
    );
}
