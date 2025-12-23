"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StepTimeline } from "@/components/ui/StepTimeline";
import { PricingBreakdownCard } from "@/components/pricing/PricingBreakdownCard";

interface RequestDetail {
    id: string;
    title?: string;
    description?: string;
    status: string;
    quantity: number;
    category?: string;
    region?: string;
    unitPrice?: number;
    createdAt: string;
    estimatedPricing?: any;
    buyer?: { email?: string; user?: { email?: string } };
    supplier?: { id: string; businessName: string };
    servicePlan?: { name: string };
}

interface Supplier {
    id: string;
    businessName: string;
    isVerified: boolean;
}

const STATUS_STEPS = ["PENDING", "ASSIGNED", "QUOTED", "CONFIRMED"];

export default function OpsRfqDetailPage({ params }: { params: { id: string } }) {
    const [request, setRequest] = useState<RequestDetail | null>(null);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedSupplierId, setSelectedSupplierId] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchData();
    }, [params.id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use canonical endpoints:
            // GET /api/rfq/[id]/assign returns available suppliers for this RFQ
            const [reqData, suppliersData] = await Promise.all([
                apiGet<any>(`/api/requests/${params.id}`),
                apiGet<any>(`/api/rfq/${params.id}/assign`).catch(() => ({ suppliers: [] })),
            ]);

            setRequest(reqData.request || reqData);
            setSuppliers(suppliersData.suppliers || []);
        } catch (err: any) {
            setError(err.message || "Failed to load request");
        } finally {
            setLoading(false);
        }
    };

    const handleAssignSupplier = async () => {
        if (!selectedSupplierId || assigning) return;

        setAssigning(true);
        try {
            // Use canonical endpoint: POST /api/rfq/[id]/assign
            await apiPost(`/api/rfq/${params.id}/assign`, {
                supplierId: selectedSupplierId,
            });
            await fetchData();
        } catch (err: any) {
            setError(err.message || "Failed to assign supplier");
        } finally {
            setAssigning(false);
        }
    };

    const handleGenerateQuote = async () => {
        if (generating) return;

        setGenerating(true);
        try {
            await apiPost(`/api/requests/${params.id}/quote`, {});
            await fetchData();
        } catch (err: any) {
            setError(err.message || "Failed to generate quote");
        } finally {
            setGenerating(false);
        }
    };

    const getTimelineSteps = () => {
        if (!request) return [];
        const currentIndex = STATUS_STEPS.indexOf(request.status);

        return STATUS_STEPS.map((step, index) => ({
            label: step.replace(/_/g, " "),
            status: index < currentIndex ? "completed" as const :
                index === currentIndex ? "current" as const : "pending" as const,
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-slate-400">Loading request...</p>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="space-y-4">
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-sm text-red-400">{error || "Request not found"}</p>
                </div>
                <Link href="/ops/buyer-requests" className="text-sm text-emerald-400 hover:text-emerald-300">
                    ← Back to Queue
                </Link>
            </div>
        );
    }

    const canAssign = request.status === "PENDING" && !request.supplier;
    const canGenerateQuote = request.status === "ASSIGNED" || (request.status === "PENDING" && request.supplier);
    const hasQuote = request.status === "QUOTED" || request.status === "CONFIRMED";

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <Link href="/ops/buyer-requests" className="text-sm text-emerald-400 hover:text-emerald-300">
                        ← Back to Queue
                    </Link>
                    <h1 className="text-2xl font-semibold text-slate-50 mt-4">
                        {request.title || `RFQ ${request.id.slice(0, 8)}`}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <StatusBadge status={request.status} size="md" />
                        <span className="text-sm text-slate-400">{request.id}</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Request Details */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="font-medium text-slate-100 mb-4">Request Details</h3>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-slate-400">Buyer</dt>
                                <dd className="text-slate-100 mt-1">
                                    {request.buyer?.user?.email || request.buyer?.email || "—"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Category</dt>
                                <dd className="text-slate-100 mt-1">{request.category || "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Quantity</dt>
                                <dd className="text-slate-100 mt-1">{request.quantity}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Region</dt>
                                <dd className="text-slate-100 mt-1">{request.region || "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Service Plan</dt>
                                <dd className="text-slate-100 mt-1">{request.servicePlan?.name || "Basic"}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Unit Price</dt>
                                <dd className="text-emerald-400 mt-1">
                                    {request.unitPrice ? `₦${request.unitPrice.toLocaleString()}` : "—"}
                                </dd>
                            </div>
                        </dl>
                        {request.description && (
                            <div className="mt-4 pt-4 border-t border-slate-800">
                                <dt className="text-sm text-slate-400 mb-1">Description</dt>
                                <dd className="text-sm text-slate-100 whitespace-pre-wrap">{request.description}</dd>
                            </div>
                        )}
                    </div>

                    {/* Assign Supplier */}
                    {canAssign && (
                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
                            <h3 className="font-medium text-amber-400 mb-4">⚡ Step 1: Assign Supplier</h3>
                            <div className="flex gap-3">
                                <select
                                    value={selectedSupplierId}
                                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                                    className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                                >
                                    <option value="">Select a supplier...</option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.businessName} {s.isVerified ? "✓" : ""}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAssignSupplier}
                                    disabled={!selectedSupplierId || assigning}
                                    className="rounded-lg bg-amber-500 px-6 py-2 text-sm font-medium text-slate-950 hover:bg-amber-400 disabled:opacity-50"
                                >
                                    {assigning ? "Assigning..." : "Assign"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Assigned Supplier */}
                    {request.supplier && (
                        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-6">
                            <h3 className="font-medium text-blue-400 mb-2">✓ Assigned Supplier</h3>
                            <p className="text-slate-100">{request.supplier.businessName}</p>
                        </div>
                    )}

                    {/* Generate Quote */}
                    {canGenerateQuote && (
                        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-6">
                            <h3 className="font-medium text-purple-400 mb-4">⚡ Step 2: Generate Quote</h3>
                            <p className="text-sm text-slate-300 mb-4">
                                Calculate pricing and send quote to buyer for confirmation.
                            </p>
                            <button
                                onClick={handleGenerateQuote}
                                disabled={generating}
                                className="rounded-lg bg-purple-500 px-6 py-3 text-sm font-medium text-slate-950 hover:bg-purple-400 disabled:opacity-50"
                            >
                                {generating ? "Generating..." : "Generate Quote"}
                            </button>
                        </div>
                    )}

                    {/* Pricing Breakdown */}
                    {hasQuote && request.estimatedPricing && (
                        <PricingBreakdownCard pricing={request.estimatedPricing} showAffiliate />
                    )}

                    {/* Confirmed Status */}
                    {request.status === "CONFIRMED" && (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                            <h3 className="font-medium text-emerald-400 mb-2">✓ Quote Confirmed</h3>
                            <p className="text-sm text-slate-300">
                                Buyer has confirmed this quote. Order has been created.
                            </p>
                            <Link
                                href="/ops/orders"
                                className="inline-block mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400"
                            >
                                View Orders
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="font-medium text-slate-100 mb-4">Status Timeline</h3>
                        <StepTimeline steps={getTimelineSteps()} />
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="font-medium text-slate-100 mb-2">Messages</h3>
                        <Link
                            href="/ops/messages"
                            className="text-sm text-emerald-400 hover:text-emerald-300"
                        >
                            💬 Open Messages →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
