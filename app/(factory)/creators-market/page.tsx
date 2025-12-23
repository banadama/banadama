'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardShell } from '@/components/shared/DashboardShell';

type CreatorType = 'MODEL' | 'MOCK_DESIGNER' | 'GRAPHIC_DESIGNER' | 'PHOTOGRAPHER' | 'VIDEOGRAPHER';

interface Creator {
    id: string;
    name: string;
    type: CreatorType;
    country: string;
    rating: number;
    jobsDone: number;
    avatarColor: string;
    tags: string[];
    startingPrice: string;
}

const MOCK_CREATORS: Creator[] = [
    {
        id: 'c1',
        name: 'Aisha Studio',
        type: 'MODEL',
        country: 'Nigeria',
        rating: 4.9,
        jobsDone: 132,
        avatarColor: 'from-pink-400 to-red-500',
        tags: ['Fashion', 'Abaya', 'Streetwear'],
        startingPrice: '₦15,000 / session',
    },
    {
        id: 'c2',
        name: 'Dhaka Mock Lab',
        type: 'MOCK_DESIGNER',
        country: 'Bangladesh',
        rating: 4.8,
        jobsDone: 87,
        avatarColor: 'from-purple-400 to-indigo-500',
        tags: ['Garment mockups', 'T-shirt', 'Hoodies'],
        startingPrice: '₦8,000 / design',
    },
    {
        id: 'c3',
        name: 'Kano Graphics',
        type: 'GRAPHIC_DESIGNER',
        country: 'Nigeria',
        rating: 4.7,
        jobsDone: 210,
        avatarColor: 'from-sky-400 to-blue-500',
        tags: ['Label design', 'Packaging', 'Logos'],
        startingPrice: '₦10,000 / pack',
    },
];

const typeLabels: Record<CreatorType, string> = {
    MODEL: 'Model',
    MOCK_DESIGNER: 'Mock Designer',
    GRAPHIC_DESIGNER: 'Graphic Designer',
    PHOTOGRAPHER: 'Photographer',
    VIDEOGRAPHER: 'Videographer',
};

export default function CreatorsMarketPage() {
    const [selectedType, setSelectedType] = useState<CreatorType | 'ALL'>('ALL');
    const router = useRouter();

    const filteredCreators =
        selectedType === 'ALL'
            ? MOCK_CREATORS
            : MOCK_CREATORS.filter((c) => c.type === selectedType);

    const handleStartCollaboration = (creatorId: string) => {
        // Factory → messages convention
        router.push(`/factory/messages/new?creatorId=${creatorId}`);
    };

    return (
        <DashboardShell variant="factoryCreators">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Creators Market
                    </h1>
                    <p className="text-sm text-slate-400 mt-1 max-w-xl">
                        Connect with{' '}
                        <span className="text-orange-400 font-medium">models</span>,{' '}
                        <span className="text-orange-400 font-medium">mock designers</span> and{' '}
                        <span className="text-orange-400 font-medium">graphic creators</span> to
                        present your factory & wholesaler products with no regret.
                    </p>
                </div>

                {/* Quick stats */}
                <div className="flex gap-3">
                    <GlassStat label="Active creators" value={String(MOCK_CREATORS.length)} />
                    <GlassStat label="Avg. rating" value="4.8★" />
                </div>
            </div>

            {/* Filters + Search */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                    <FilterChip
                        active={selectedType === 'ALL'}
                        label="All"
                        onClick={() => setSelectedType('ALL')}
                    />
                    <FilterChip
                        active={selectedType === 'MODEL'}
                        label="Models"
                        onClick={() => setSelectedType('MODEL')}
                    />
                    <FilterChip
                        active={selectedType === 'MOCK_DESIGNER'}
                        label="Mock Designers"
                        onClick={() => setSelectedType('MOCK_DESIGNER')}
                    />
                    <FilterChip
                        active={selectedType === 'GRAPHIC_DESIGNER'}
                        label="Graphic Designers"
                        onClick={() => setSelectedType('GRAPHIC_DESIGNER')}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            placeholder="Search creators, tags, country..."
                            className="w-64 max-w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-400/70"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                            ⌕
                        </span>
                    </div>
                </div>
            </div>

            {/* Creators grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCreators.map((creator) => (
                    <CreatorCard
                        key={creator.id}
                        creator={creator}
                        onStartCollaboration={() => handleStartCollaboration(creator.id)}
                    />
                ))}

                {filteredCreators.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-slate-400">
                        No creators match this filter yet. Try another type or remove filters.
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}

function GlassStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
            <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                {label}
            </div>
            <div className="text-lg font-semibold text-orange-400 mt-0.5">{value}</div>
        </div>
    );
}

function FilterChip({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-3 py-1 text-xs font-medium border backdrop-blur-md transition ${active
                    ? 'border-orange-400/80 bg-orange-500/10 text-orange-300 shadow-[0_0_20px_rgba(248,153,72,0.35)]'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-orange-400/60 hover:text-orange-200'
                }`}
        >
            {label}
        </button>
    );
}

function CreatorCard({
    creator,
    onStartCollaboration,
}: {
    creator: Creator;
    onStartCollaboration: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
        >
            {/* subtle gradient glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/20 blur-2xl" />

            <div className="flex items-center gap-3 mb-3">
                <div
                    className={`h-12 w-12 rounded-3xl bg-gradient-to-br ${creator.avatarColor} flex items-center justify-center text-xs font-semibold text-white shadow-lg`}
                >
                    {creator.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold">{creator.name}</h3>
                        <span className="rounded-full border border-orange-400/60 bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-orange-300">
                            {typeLabels[creator.type]}
                        </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-400">
                        {creator.country} • {creator.jobsDone} jobs •{' '}
                        <span className="text-orange-300 font-medium">
                            {creator.rating.toFixed(1)}★
                        </span>
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
                {creator.tags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-slate-400">
                    Starting from{' '}
                    <span className="text-orange-300 font-semibold">
                        {creator.startingPrice}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button className="rounded-full bg-white/5 border border-white/15 px-3 py-1 text-[11px] text-slate-200 hover:border-orange-400/60 hover:text-orange-200 transition">
                        View profile
                    </button>
                    <button
                        onClick={onStartCollaboration}
                        className="rounded-full bg-orange-500/90 px-3 py-1 text-[11px] font-semibold text-black shadow-[0_0_20px_rgba(248,153,72,0.7)] hover:bg-orange-400 transition"
                    >
                        Start collaboration
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
