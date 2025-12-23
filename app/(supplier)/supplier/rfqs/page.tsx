import Link from "next/link";

// Mock supplier RFQs
const MOCK_RFQS = [
    {
        id: "RFQ-001",
        buyer: "John Doe",
        product: "Custom T-Shirts with Logo",
        quantity: 500,
        targetPrice: 12000,
        status: "PENDING_QUOTE",
        assignedAt: "2024-12-13",
        dueIn: "48 hours",
    },
    {
        id: "RFQ-002",
        buyer: "Adamu Store",
        product: "Bulk Cotton Fabric",
        quantity: 200,
        targetPrice: null,
        status: "QUOTED",
        quotedPrice: 15000,
        quotedTotal: 3000000,
        assignedAt: "2024-12-11",
    },
    {
        id: "RFQ-003",
        buyer: "BDTrade Ltd",
        product: "Packaging Materials",
        quantity: 1000,
        targetPrice: 2000,
        status: "ACCEPTED",
        quotedPrice: 2500,
        quotedTotal: 2500000,
        assignedAt: "2024-12-08",
    },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    PENDING_QUOTE: { bg: "bg-amber-500/20", text: "text-amber-400", label: "Quote Needed" },
    QUOTED: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Quote Sent" },
    ACCEPTED: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Accepted" },
    REJECTED: { bg: "bg-red-500/20", text: "text-red-400", label: "Rejected" },
};

export default function SupplierRFQsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-50">Assigned RFQs</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Review and respond to RFQs assigned by Banadama Ops
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Total RFQs</p>
                    <p className="text-2xl font-semibold text-slate-100 mt-1">{MOCK_RFQS.length}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Pending Quote</p>
                    <p className="text-2xl font-semibold text-amber-400 mt-1">
                        {MOCK_RFQS.filter((r) => r.status === "PENDING_QUOTE").length}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Quoted</p>
                    <p className="text-2xl font-semibold text-blue-400 mt-1">
                        {MOCK_RFQS.filter((r) => r.status === "QUOTED").length}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Accepted</p>
                    <p className="text-2xl font-semibold text-emerald-400 mt-1">
                        {MOCK_RFQS.filter((r) => r.status === "ACCEPTED").length}
                    </p>
                </div>
            </div>

            {/* RFQ List */}
            <div className="space-y-4">
                {MOCK_RFQS.map((rfq) => {
                    const status = STATUS_STYLES[rfq.status];

                    return (
                        <div
                            key={rfq.id}
                            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs text-slate-500 font-mono">{rfq.id}</span>
                                        <span className={`rounded-full px-2 py-0.5 text-xs ${status.bg} ${status.text}`}>
                                            {status.label}
                                        </span>
                                        {rfq.status === "PENDING_QUOTE" && (
                                            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                                                ⏰ Due in {rfq.dueIn}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-medium text-slate-100 mt-2">{rfq.product}</h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Buyer: {rfq.buyer} • Qty: {rfq.quantity.toLocaleString()}
                                    </p>

                                    {rfq.targetPrice && (
                                        <p className="text-xs text-slate-500 mt-2">
                                            Target Price: ₦{rfq.targetPrice.toLocaleString()}/unit
                                        </p>
                                    )}

                                    {rfq.quotedPrice && (
                                        <div className="mt-3 p-3 rounded-lg bg-slate-800/50">
                                            <p className="text-xs text-slate-400">Your Quote</p>
                                            <p className="text-sm text-slate-200">
                                                ₦{rfq.quotedPrice.toLocaleString()}/unit × {rfq.quantity} =
                                                <span className="text-emerald-400 font-semibold ml-1">
                                                    ₦{rfq.quotedTotal?.toLocaleString()}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="shrink-0">
                                    {rfq.status === "PENDING_QUOTE" && (
                                        <Link
                                            href={`/supplier/rfqs/${rfq.id}/quote`}
                                            className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors"
                                        >
                                            Submit Quote
                                        </Link>
                                    )}
                                    {rfq.status === "QUOTED" && (
                                        <p className="text-xs text-slate-500">Waiting for buyer response</p>
                                    )}
                                    {rfq.status === "ACCEPTED" && (
                                        <Link
                                            href={`/supplier/orders`}
                                            className="rounded-lg border border-emerald-500 px-6 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                        >
                                            View PO
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">📝</span>
                    <div>
                        <p className="text-sm font-medium text-blue-300">How RFQs Work</p>
                        <p className="text-xs text-blue-200 mt-1">
                            Banadama Ops assigns RFQs to you based on your capabilities.
                            Submit your quote within the deadline. If accepted, you&apos;ll receive a Purchase Order.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
