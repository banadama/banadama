// app/(affiliate)/links/page.tsx
"use client";

export default function AffiliateLinksPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-slate-50">
                    Referral Links
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                    Create and manage your affiliate referral links
                </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
                <p className="text-sm text-slate-400">
                    Link management coming soon
                </p>
                <p className="mt-2 text-xs text-slate-500">
                    You'll be able to create custom affiliate links, track performance, and manage campaigns
                </p>
            </div>
        </div>
    );
}
