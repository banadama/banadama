'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardShell } from '@/components/shared/DashboardShell';

type BuyerType = 'FACTORY' | 'WHOLESALER';

interface MiniMarketDeal {
    id: string;
    buyerName: string;
    buyerType: BuyerType;
    country: string;
    productFocus: string;
    budgetRange: string;
    status: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
    messagePreview: string;
    createdAt: string;
}

const MOCK_DEALS: MiniMarketDeal[] = [
    {
        id: 'd1',
        buyerName: 'Lagos Textile Factory',
        buyerType: 'FACTORY',
        country: 'Nigeria',
        productFocus: 'T-shirts & Hoodies – new collection',
        budgetRange: '₦250k – ₦400k',
        status: 'NEW',
        messagePreview: 'We need 15 mockups + 1 model shoot for our Ramadan drop…',
        createdAt: '2h ago',
    },
    {
        id: 'd2',
        buyerName: 'Kumasi Wholesale Hub',
        buyerType: 'WHOLESALER',
        country: 'Ghana',
        productFocus: 'Bags & accessories catalog refresh',
        budgetRange: '₦150k – ₦220k',
        status: 'IN_PROGRESS',
        messagePreview: 'Approved first batch, need 5 more lifestyle shots…',
        createdAt: 'Yesterday',
    },
];

export default function CreatorMiniMarketPage() {
    const router = useRouter();

    const handleOpenChat = (dealId: string) => {
        // Creator → messages convention
        router.push(`/creator/messages?dealId=${dealId}`);
    };

    return (
        <DashboardShell variant="creatorMini">
            {/* Header */}
            <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Mini Market – Factory & Wholesaler Requests
                    </h1>
                    <p className="mt-1 max-w-xl text-sm text-slate-400">
                        Private hub between you and{' '}
                        <span className="text-orange-400 font-medium">factories</span> /
                        <span className="text-orange-400 font-medium">wholesalers</span>. No
                        random buyers – just serious production partners.
                    </p>
                </div>

                <div className="flex gap-3">
                    <GlassChipStat label="Open briefs" value={String(MOCK_DEALS.length)} />
                    <GlassChipStat label="Won collaborations" value="0" />
                </div>
            </header>

            {/* Deals list */}
            <div className="space-y-3">
                {MOCK_DEALS.map((deal) => (
                    <MiniMarketCard
                        key={deal.id}
                        deal={deal}
                        onOpenChat={() => handleOpenChat(deal.id)}
                    />
                ))}
            </div>

            {MOCK_DEALS.length === 0 && (
                <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-10 text-center text-sm text-slate-400">
                    You don't have any factory/wholesaler requests yet.
                    <br />
                    <span className="text-orange-300">
                        Keep your portfolio updated to attract more B2B clients.
                    </span>
                </div>
            )}
        </DashboardShell>
    );
}

function GlassChipStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
            <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                {label}
            </div>
            <div className="text-lg font-semibold text-orange-400 mt-0.5">{value}</div>
        </div>
    );
}

function MiniMarketCard({
    deal,
    onOpenChat,
}: {
    deal: MiniMarketDeal;
    onOpenChat: () => void;
}) {
    const badge =
        deal.buyerType === 'FACTORY'
            ? { label: 'Factory', color: 'border-sky-400/70 bg-sky-500/10 text-sky-200' }
            : { label: 'Wholesaler', color: 'border-emerald-400/70 bg-emerald-500/10 text-emerald-200' };

    const statusColor: Record<MiniMarketDeal['status'], string> = {
        NEW: 'text-orange-300',
        IN_PROGRESS: 'text-sky-300',
        CLOSED: 'text-slate-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-2xl px-4 py-4 md:px-5 md:py-5 shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
        >
            <div className="pointer-events-none absolute -left-10 top-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="truncate text-sm md:text-base font-semibold">
                            {deal.buyerName}
                        </h2>
                        <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] ${badge.color}`}
                        >
                            {badge.label}
                        </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span>{deal.country}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-500" />
                        <span>
                            Status:{' '}
                            <span className={statusColor[deal.status]}>{deal.status}</span>
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-500" />
                        <span>{deal.createdAt}</span>
                    </div>

                    <div className="mt-2 text-xs text-slate-200">
                        <span className="font-medium text-orange-300">Focus: </span>
                        {deal.productFocus}
                    </div>

                    <div className="mt-1 text-xs text-slate-300">
                        Budget:{' '}
                        <span className="font-semibold text-orange-300">
                            {deal.budgetRange}
                        </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs text-slate-300">
                        {deal.messagePreview}
                    </p>
                </div>

                <div className="flex flex-row md:flex-col items-end gap-2 md:gap-3">
                    <button className="rounded-full bg-white/5 border border-white/20 px-3 py-1 text-[11px] text-slate-200 hover:border-orange-400/60 hover:text-orange-200 transition">
                        View brief
                    </button>
                    <button
                        onClick={onOpenChat}
                        className="rounded-full bg-orange-500/90 px-3 py-1 text-[11px] font-semibold text-black shadow-[0_0_20px_rgba(248,153,72,0.7)] hover:bg-orange-400 transition"
                    >
                        Open chat
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
