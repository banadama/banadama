'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { AffiliateStats } from '@/types/affiliate';
import { calculateEarnings } from '@/lib/affiliate-utils';

/**
 * Default/loading state
 */
const DEFAULT_STATS: AffiliateStats = {
    totalClicks: 0,
    totalSignups: 0,
    totalSalesValue: 0,
    avgCommissionRate: 0.02,
    suppliersVerified: 0,
    period: '30d',
};

export default function AffiliateDashboardPage() {
    const [stats, setStats] = useState<AffiliateStats>(DEFAULT_STATS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/affiliate/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch affiliate stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    // Calculate earnings breakdown
    const earnings = calculateEarnings(stats);

    return (
        <div className="relative overflow-hidden">
            {/* Kinetic typography background */}
            <KineticBackground />

            {/* Foreground content */}
            <section className="relative z-10 space-y-6">
                {/* Title + summary row */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                            Affiliate Earnings Overview
                        </h2>
                        <p className="mt-1 max-w-xl text-sm text-slate-400">
                            Earn from{' '}
                            <span className="text-orange-300 font-medium">clicks → signups → sales</span>{' '}
                            with no-regret trade. You get{' '}
                            <span className="text-orange-300">₦50 per signup</span>,{' '}
                            <span className="text-orange-300">1–3% per sale</span>, and{' '}
                            <span className="text-orange-300">₦100 per verified supplier</span>.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <SmallBadge label="Today status" value={loading ? 'Loading...' : 'Live'} tone="success" />
                        <SmallBadge
                            label="Commission rate"
                            value={`${Math.round(stats.avgCommissionRate * 100)}%`}
                        />
                    </div>
                </div>

                {/* Top metrics row */}
                <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard label="Total clicks" value={stats.totalClicks.toLocaleString()} />
                    <MetricCard label="Signups" value={stats.totalSignups.toLocaleString()} />
                    <MetricCard
                        label="Sales volume"
                        value={`₦${Math.round(stats.totalSalesValue).toLocaleString()}`}
                        subtle="All orders from your referrals"
                    />
                    <MetricCard
                        label="Total earnings"
                        value={`₦${earnings.totalEarnings.toLocaleString()}`}
                        highlight
                    />
                </div>

                {/* Earnings breakdown + quick actions */}
                <div className="grid gap-4 lg:grid-cols-[3fr,2fr]">
                    {/* Breakdown card */}
                    <div className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div>
                                <h3 className="text-sm font-semibold">Earnings breakdown</h3>
                                <p className="text-xs text-slate-400">
                                    How your current total of{' '}
                                    <span className="text-orange-300 font- semibold">
                                        ₦{earnings.totalEarnings.toLocaleString()}
                                    </span>{' '}
                                    is calculated.
                                </p>
                            </div>
                            <span className="rounded-full border border-orange-400/60 bg-orange-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-orange-300">
                                {loading ? 'Loading...' : 'Live Formula'}
                            </span>
                        </div>

                        <div className="space-y-3 text-xs">
                            <BreakdownRow
                                label="Signup earnings"
                                description={`₦50 × ${stats.totalSignups} signups`}
                                value={`₦${earnings.signupEarnings.toLocaleString()}`}
                            />
                            <BreakdownRow
                                label="Sales commission"
                                description={`${Math.round(
                                    stats.avgCommissionRate * 100,
                                )}% × ₦${Math.round(stats.totalSalesValue).toLocaleString()} sales`}
                                value={`₦${earnings.salesCommission.toLocaleString()}`}
                            />
                            <BreakdownRow
                                label="Supplier bonus"
                                description={`₦100 × ${stats.suppliersVerified} verified suppliers`}
                                value={`₦${earnings.supplierBonus.toLocaleString()}`}
                            />

                            <div className="mt-3 border-t border-white/10 pt-3 flex items-center justify-between text-xs">
                                <div className="text-slate-400">
                                    <span className="text-slate-200">Total affiliate earnings</span>
                                    <span className="mx-1 text-slate-500">=</span>
                                    <span className="text-slate-300">
                                        (Signups + Sales + Supplier bonus)
                                    </span>
                                </div>
                                <div className="text-sm font-semibold text-orange-300">
                                    ₦{earnings.totalEarnings.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions / links */}
                    <div className="space-y-3">
                        <QuickActionCard
                            title="Share your main affiliate link"
                            description="Use this link in WhatsApp groups, TikTok bio, YouTube descriptions and more."
                            ctaLabel="Copy link"
                        />
                        <QuickActionCard
                            title="Invite factories & wholesalers"
                            description="Get ₦100 for every verified supplier that signs up through you."
                            ctaLabel="Generate supplier invite link"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ---------------- KINETIC BACKGROUND ---------------- */

function KineticBackground() {
    const words = ['EARN', 'CLICK', 'SALE', 'SHARE'];

    return (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-25">
            <div className="relative h-full w-full">
                {words.map((word, index) => (
                    <motion.div
                        key={word}
                        initial={{ x: -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                            delay: index * 0.4,
                            duration: 1.4,
                            repeat: Infinity,
                            repeatType: 'mirror',
                        }}
                        className="absolute text-[64px] sm:text-[80px] md:text-[110px] font-black tracking-[0.35em] text-orange-500/10"
                        style={{
                            top: `${10 + index * 20}%`,
                            left: index % 2 === 0 ? '5%' : '20%',
                        }}
                    >
                        {word}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/* ---------------- SMALL UI PIECES ---------------- */

function MetricCard({
    label,
    value,
    subtle,
    highlight,
}: {
    label: string;
    value: string;
    subtle?: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`rounded-3xl border px-4 py-3 backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.35)] ${highlight
                    ? 'border-orange-400/70 bg-orange-500/10'
                    : 'border-white/15 bg-white/5'
                }`}
        >
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                {label}
            </div>
            <div
                className={`mt-1 text-lg font-semibold ${highlight ? 'text-orange-300' : 'text-slate-50'
                    }`}
            >
                {value}
            </div>
            {subtle && <div className="mt-1 text-[11px] text-slate-500">{subtle}</div>}
        </div>
    );
}

function SmallBadge({
    label,
    value,
    tone = 'neutral',
}: {
    label: string;
    value: string;
    tone?: 'neutral' | 'success';
}) {
    const toneClasses =
        tone === 'success'
            ? 'border-emerald-400/70 bg-emerald-500/10 text-emerald-200'
            : 'border-white/15 bg-white/5 text-slate-200';

    return (
        <div
            className={`flex flex-col rounded-2xl border px-3 py-2 text-[11px] backdrop-blur-xl ${toneClasses}`}
        >
            <span className="uppercase tracking-[0.18em] text-[10px] text-slate-400">
                {label}
            </span>
            <span className="mt-0.5 text-xs font-semibold">{value}</span>
        </div>
    );
}

function BreakdownRow({
    label,
    description,
    value,
}: {
    label: string;
    description: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
                <div className="text-xs font-medium text-slate-100">{label}</div>
                <div className="text-[11px] text-slate-500">{description}</div>
            </div>
            <div className="text-xs font-semibold text-orange-300 whitespace-nowrap">
                {value}
            </div>
        </div>
    );
}

function QuickActionCard({
    title,
    description,
    ctaLabel,
}: {
    title: string;
    description: string;
    ctaLabel: string;
}) {
    return (
        <div className="rounded-3xl border border-white/15 bg-white/5 p-4 backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
            <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
            <p className="mt-1 text-xs text-slate-400">{description}</p>
            <button className="mt-3 inline-flex items-center gap-1 rounded-full bg-orange-500/90 px-3 py-1 text-[11px] font-semibold text-black shadow-[0_0_18px_rgba(248,153,72,0.7)] hover:bg-orange-400 transition">
                {ctaLabel}
                <span>↗</span>
            </button>
        </div>
    );
}
