import Link from "next/link";

// Mock group buys the buyer has joined
const MOCK_JOINED_GROUP_BUYS = [
    {
        id: "GB-001",
        product: "Bulk T-Shirts Order",
        supplier: "Lagos Textiles Factory",
        unitPrice: 12000,
        quantity: 50,
        myTotal: 600000,
        moq: 100,
        currentJoined: 75,
        status: "WAITING",
        endsIn: "3 days",
    },
    {
        id: "GB-002",
        product: "Cotton Fabric Bundle",
        supplier: "Dhaka Mills",
        unitPrice: 38000,
        quantity: 10,
        myTotal: 380000,
        moq: 50,
        currentJoined: 50,
        status: "MOQ_REACHED",
        paymentDue: "48 hours",
    },
];

// Available group buys to join
const MOCK_AVAILABLE = [
    {
        id: "GB-003",
        product: "Packaging Boxes (500pc)",
        supplier: "BD Packaging Co",
        regularPrice: 250000,
        groupPrice: 200000,
        discount: 20,
        moq: 10,
        currentJoined: 7,
        endsIn: "5 days",
    },
];

export default function BuyerGroupBuysPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-50">My Group Buys</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Track your group buy participation
                    </p>
                </div>
                <Link
                    href="/group-buy"
                    className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-purple-400 transition-colors"
                >
                    Browse Group Buys
                </Link>
            </div>

            {/* MOQ Reached Alert */}
            {MOCK_JOINED_GROUP_BUYS.some((gb) => gb.status === "MOQ_REACHED") && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🎉</span>
                        <div>
                            <p className="text-sm font-medium text-emerald-300">MOQ Reached!</p>
                            <p className="text-xs text-emerald-200 mt-1">
                                One or more group buys have reached their target. Complete payment to confirm your order.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* My Joined Group Buys */}
            <section>
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Joined Group Buys</h2>
                <div className="space-y-4">
                    {MOCK_JOINED_GROUP_BUYS.map((gb) => {
                        const progress = Math.round((gb.currentJoined / gb.moq) * 100);
                        const isReached = gb.status === "MOQ_REACHED";

                        return (
                            <div
                                key={gb.id}
                                className={`rounded-xl border p-5 ${isReached
                                        ? "border-emerald-500/50 bg-emerald-500/5"
                                        : "border-slate-800 bg-slate-900/60"
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 font-mono">{gb.id}</span>
                                            <span className={`rounded-full px-2 py-0.5 text-xs ${isReached
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "bg-amber-500/20 text-amber-400"
                                                }`}>
                                                {isReached ? "MOQ Reached" : "Waiting for MOQ"}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-slate-100 mt-2">{gb.product}</h3>
                                        <p className="text-xs text-slate-400 mt-1">{gb.supplier}</p>

                                        {/* Progress */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                <span>{gb.currentJoined} / {gb.moq} joined</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${isReached ? "bg-emerald-500" : "bg-purple-500"
                                                        }`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Your Order */}
                                        <div className="mt-4 p-3 rounded-lg bg-slate-800/50">
                                            <p className="text-xs text-slate-400">Your Order</p>
                                            <p className="text-sm text-slate-200">
                                                {gb.quantity} units × ₦{gb.unitPrice.toLocaleString()} = <span className="text-emerald-400 font-semibold">₦{gb.myTotal.toLocaleString()}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        {isReached ? (
                                            <div>
                                                <p className="text-xs text-emerald-400 mb-2">⏰ Pay within {gb.paymentDue}</p>
                                                <button className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors">
                                                    Pay Now
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500">
                                                Ends in {gb.endsIn}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Available Group Buys */}
            <section>
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Available to Join</h2>
                <div className="space-y-4">
                    {MOCK_AVAILABLE.map((gb) => {
                        const progress = Math.round((gb.currentJoined / gb.moq) * 100);

                        return (
                            <div
                                key={gb.id}
                                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-slate-100">{gb.product}</h3>
                                        <p className="text-xs text-slate-400 mt-1">{gb.supplier}</p>

                                        <div className="mt-3 flex items-center gap-3">
                                            <span className="text-lg font-semibold text-emerald-400">
                                                ₦{gb.groupPrice.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-slate-500 line-through">
                                                ₦{gb.regularPrice.toLocaleString()}
                                            </span>
                                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                                                {gb.discount}% off
                                            </span>
                                        </div>

                                        <div className="mt-3">
                                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                <span>{gb.currentJoined} / {gb.moq} joined</span>
                                                <span>Ends in {gb.endsIn}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-500 rounded-full"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/group-buy/${gb.id}`}
                                        className="rounded-lg bg-purple-500 px-6 py-2 text-sm font-medium text-slate-950 hover:bg-purple-400 transition-colors"
                                    >
                                        Join
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Info */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                        <p className="text-sm font-medium text-purple-300">How Group Buy Works</p>
                        <p className="text-xs text-purple-200 mt-1">
                            Join a group buy to pool orders with other buyers. When MOQ is reached,
                            you&apos;ll be notified to pay. If MOQ isn&apos;t reached by the deadline, the group buy is cancelled.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
