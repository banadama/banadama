"use client";

import { AffiliateStats } from "@/types/affiliate";
import { formatCurrency } from "@/config/affiliate";

interface AffiliateStatsCardsProps {
    stats: AffiliateStats;
    loading?: boolean;
}

export function AffiliateStatsCards({ stats, loading }: AffiliateStatsCardsProps) {
    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse rounded-xl border border-slate-800 bg-slate-900/60 p-6"
                    >
                        <div className="h-4 w-20 rounded bg-slate-700"></div>
                        <div className="mt-2 h-8 w-32 rounded bg-slate-700"></div>
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            label: "Total Clicks",
            value: stats.totalClicks.toLocaleString(),
            icon: "👆",
            color: "text-blue-400",
        },
        {
            label: "Signups",
            value: stats.totalSignups.toLocaleString(),
            icon: "👥",
            color: "text-emerald-400",
        },
        {
            label: "Sales",
            value: stats.totalSales.toLocaleString(),
            icon: "💰",
            color: "text-purple-400",
        },
        {
            label: "Total Commission",
            value: formatCurrency(stats.totalCommission),
            icon: "🎯",
            color: "text-yellow-400",
            subtitle: `Pending: ${formatCurrency(stats.pendingCommission)}`,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-slate-700"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-400">{card.label}</p>
                            <p className={`mt-2 text-2xl font-semibold ${card.color}`}>
                                {card.value}
                            </p>
                            {card.subtitle && (
                                <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
                            )}
                        </div>
                        <span className="text-2xl">{card.icon}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface StatsMetricsProps {
    stats: AffiliateStats;
}

export function StatsMetrics({ stats }: StatsMetricsProps) {
    return (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                <p className="text-xs text-slate-400">Conversion Rate</p>
                <p className="mt-1 text-xl font-semibold text-slate-100">
                    {stats.conversionRate.toFixed(2)}%
                </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                <p className="text-xs text-slate-400">Avg Commission/Sale</p>
                <p className="mt-1 text-xl font-semibold text-slate-100">
                    {formatCurrency(stats.averageCommissionPerSale)}
                </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                <p className="text-xs text-slate-400">Paid Out</p>
                <p className="mt-1 text-xl font-semibold text-emerald-400">
                    {formatCurrency(stats.paidCommission)}
                </p>
            </div>
        </div>
    );
}
