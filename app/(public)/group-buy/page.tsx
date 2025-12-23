import Link from "next/link";

// Mock group buy products
const MOCK_GROUP_BUYS = [
    {
        id: "1",
        name: "Bulk T-Shirts Order",
        supplier: "Lagos Textiles Factory",
        country: "NG",
        countryFlag: "🇳🇬",
        regularPrice: 15000,
        groupPrice: 12000,
        discount: 20,
        moq: 100,
        currentJoined: 40,
        endsIn: "5 days",
        image: "👕",
    },
    {
        id: "2",
        name: "Cotton Fabric Roll Bundle",
        supplier: "Dhaka Mills",
        country: "BD",
        countryFlag: "🇧🇩",
        regularPrice: 45000,
        groupPrice: 38000,
        discount: 15,
        moq: 50,
        currentJoined: 35,
        endsIn: "3 days",
        image: "🧵",
    },
    {
        id: "3",
        name: "Packaging Boxes (500pc)",
        supplier: "BD Packaging Co",
        country: "BD",
        countryFlag: "🇧🇩",
        regularPrice: 250000,
        groupPrice: 200000,
        discount: 20,
        moq: 10,
        currentJoined: 7,
        endsIn: "7 days",
        image: "📦",
    },
];

export default function GroupBuyPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👥</span>
                    <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-400">
                        Group Buy
                    </span>
                </div>
                <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
                    Join Group Buys
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                    Pool orders with other buyers to unlock wholesale pricing
                </p>
            </div>

            {/* How it works */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 mb-8">
                <h3 className="text-sm font-medium text-purple-300 mb-3">
                    How Group Buy Works
                </h3>
                <div className="grid gap-4 md:grid-cols-4 text-xs text-purple-200">
                    <div className="flex items-start gap-2">
                        <span className="rounded-full bg-purple-500/30 px-2 py-0.5 text-purple-300">1</span>
                        <span>Join a group buy that interests you</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="rounded-full bg-purple-500/30 px-2 py-0.5 text-purple-300">2</span>
                        <span>Wait for MOQ to be reached</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="rounded-full bg-purple-500/30 px-2 py-0.5 text-purple-300">3</span>
                        <span>Pay when notified</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="rounded-full bg-purple-500/30 px-2 py-0.5 text-purple-300">4</span>
                        <span>Receive your order</span>
                    </div>
                </div>
            </div>

            {/* Active Group Buys */}
            <div className="space-y-4">
                {MOCK_GROUP_BUYS.map((groupBuy) => {
                    const progress = Math.round((groupBuy.currentJoined / groupBuy.moq) * 100);

                    return (
                        <div
                            key={groupBuy.id}
                            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-800 text-3xl shrink-0">
                                    {groupBuy.image}
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-medium text-slate-100">
                                                {groupBuy.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                                <span>{groupBuy.countryFlag}</span>
                                                {groupBuy.supplier}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                                            ⏰ Ends in {groupBuy.endsIn}
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                                            <span>{groupBuy.currentJoined} / {groupBuy.moq} joined</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="mt-4 flex flex-wrap items-center gap-4">
                                        <div>
                                            <span className="text-xl font-semibold text-emerald-400">
                                                ₦{groupBuy.groupPrice.toLocaleString()}
                                            </span>
                                            <span className="ml-2 text-sm text-slate-500 line-through">
                                                ₦{groupBuy.regularPrice.toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">
                                            {groupBuy.discount}% off
                                        </span>
                                    </div>
                                </div>

                                <div className="md:ml-4 shrink-0">
                                    <button className="w-full md:w-auto rounded-lg bg-purple-500 px-6 py-2.5 text-sm font-medium text-slate-950 hover:bg-purple-400 transition-colors">
                                        Join Group Buy
                                    </button>
                                    <p className="text-[10px] text-slate-500 text-center mt-1">
                                        No payment until MOQ reached
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FAQ */}
            <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                    Frequently Asked Questions
                </h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="font-medium text-slate-200">What if MOQ is not reached?</p>
                        <p className="text-slate-400 mt-1">
                            If MOQ is not reached by the deadline, the group buy is cancelled and no payment is taken.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-slate-200">When do I pay?</p>
                        <p className="text-slate-400 mt-1">
                            You&apos;ll be notified when MOQ is reached. Payment is due within 48 hours of notification.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-slate-200">Is my payment protected?</p>
                        <p className="text-slate-400 mt-1">
                            Yes, all payments go to escrow and are only released when you confirm delivery.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
                <p className="text-sm text-slate-400">
                    Can&apos;t find what you&apos;re looking for?
                </p>
                <Link
                    href="/marketplace"
                    className="mt-2 inline-block text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    Browse Full Marketplace →
                </Link>
            </div>
        </div>
    );
}
