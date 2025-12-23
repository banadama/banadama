"use client";

import { useState } from "react";
import { AffiliateLink } from "@/types/affiliate";
import { generateAffiliateUrl } from "@/config/affiliate";

interface AffiliateLinksTableProps {
    links: AffiliateLink[];
    loading?: boolean;
    onRefresh?: () => void;
}

export function AffiliateLinksTable({
    links,
    loading,
    onRefresh,
}: AffiliateLinksTableProps) {
    const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

    const copyToClipboard = async (slug: string) => {
        const url = generateAffiliateUrl(slug);
        try {
            await navigator.clipboard.writeText(url);
            setCopiedSlug(slug);
            setTimeout(() => setCopiedSlug(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="h-6 w-32 animate-pulse rounded bg-slate-700"></div>
                <div className="mt-4 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded bg-slate-800"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (links.length === 0) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
                <p className="text-sm text-slate-400">No affiliate links yet</p>
                <p className="mt-1 text-xs text-slate-500">
                    Create your first link to start earning commissions
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
                <h3 className="font-semibold text-slate-100">Your Affiliate Links</h3>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Refresh
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-slate-800 bg-slate-900/80">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                                Link / Campaign
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                Clicks
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                Signups
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                Sales
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                Conv. Rate
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {links.map((link) => {
                            const conversionRate =
                                link.clicks > 0
                                    ? ((link.signups + link.sales) / link.clicks) * 100
                                    : 0;

                            return (
                                <tr
                                    key={link.id}
                                    className="hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-100">
                                                {link.slug}
                                            </p>
                                            {link.campaign && (
                                                <p className="text-xs text-slate-500">{link.campaign}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-slate-300">
                                        {link.clicks.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-emerald-400">
                                        {link.signups.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-purple-400">
                                        {link.sales.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-slate-300">
                                        {conversionRate.toFixed(1)}%
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${link.active
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-slate-500/10 text-slate-400"
                                                }`}
                                        >
                                            {link.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => copyToClipboard(link.slug)}
                                            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                                        >
                                            {copiedSlug === link.slug ? "Copied!" : "Copy Link"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
