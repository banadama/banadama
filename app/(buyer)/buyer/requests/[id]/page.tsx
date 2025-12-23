"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRfq, confirmRfq } from "@/lib/rfqApi";
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
    createdAt: string;
    estimatedPricing?: any;
    servicePlan?: { name: string; level: string };
    supplier?: { businessName: string };
}

const STATUS_STEPS = ["PENDING", "ASSIGNED", "QUOTED", "CONFIRMED"];

export default function RequestDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [request, setRequest] = useState<RequestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        fetchRequest();
    }, [params.id]);

    const fetchRequest = async () => {
        try {
            setLoading(true);
            setError(null);
            // Uses rfqApi helper with automatic fallback from /api/rfq/[id] to /api/requests/[id]
            const data = await getRfq<any>(params.id);
            setRequest(data.request || data.rfq || data);
        } catch (err: any) {
            setError(err.message || "Failed to load request");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmQuote = async () => {
        if (!request || confirming) return;

        setConfirming(true);
        try {
            // Uses rfqApi helper with automatic fallback from /api/rfq/[id]/confirm to /api/requests/[id]/confirm
            await confirmRfq(params.id);
            await fetchRequest(); // Refresh data
        } catch (err: any) {
            setError(err.message || "Failed to confirm quote");
        } finally {
            setConfirming(false);
        }
    };

    const getTimelineSteps = () => {
        if (!request) return [];

        const currentIndex = STATUS_STEPS.indexOf(request.status);

        return STATUS_STEPS.map((step, index) => ({
            label: step.replace(/_/g, " "),
            status: index < currentIndex ? "completed" as const :
                index === currentIndex ? "current" as const : "pending" as const,
            description: getStepDescription(step),
        }));
    };

    const getStepDescription = (step: string) => {
        switch (step) {
            case "PENDING": return "Request submitted, awaiting review";
            case "ASSIGNED": return "Supplier assigned by Ops team";
            case "QUOTED": return "Quote received, awaiting your confirmation";
            case "CONFIRMED": return "Quote confirmed, order created";
            default: return "";
        }
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
                <Link href="/buyer/requests" className="text-sm text-emerald-400 hover:text-emerald-300">
                    ← Back to Requests
                </Link>
            </div>
        );
    }

    const hasQuote = request.status === "QUOTED" && request.estimatedPricing;
    const isConfirmed = request.status === "CONFIRMED";

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <Link href="/buyer/requests" className="text-sm text-emerald-400 hover:text-emerald-300">
                        ← Back to Requests
                    </Link>
                    <h1 className="text-2xl font-semibold text-slate-50 mt-4">
                        {request.title || `Request ${request.id.slice(0, 8)}`}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <StatusBadge status={request.status} size="md" />
                        <span className="text-sm text-slate-400">{request.id}</span>
                    </div>
                </div>
                <Link
                    href="/buyer/messages"
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-600 transition-colors"
                >
                    💬 Message Ops
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Request Details */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="font-medium text-slate-100 mb-4">Request Details</h3>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-slate-400">Category</dt>
                                <dd className="text-slate-100 mt-1">{request.category || "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Quantity</dt>
                                <dd className="text-slate-100 mt-1">{request.quantity}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Delivery Region</dt>
                                <dd className="text-slate-100 mt-1">{request.region || "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Service Plan</dt>
                                <dd className="text-slate-100 mt-1">{request.servicePlan?.name || "Basic"}</dd>
                            </div>
                            {request.supplier && (
                                <div className="col-span-2">
                                    <dt className="text-slate-400">Assigned Supplier</dt>
                                    <dd className="text-emerald-400 mt-1">{request.supplier.businessName}</dd>
                                </div>
                            )}
                        </dl>
                        {request.description && (
                            <div className="mt-4 pt-4 border-t border-slate-800">
                                <dt className="text-sm text-slate-400 mb-1">Description</dt>
                                <dd className="text-sm text-slate-100 whitespace-pre-wrap">{request.description}</dd>
                            </div>
                        )}
                    </div>

                    {/* Pricing Breakdown (if quoted) */}
                    {hasQuote && request.estimatedPricing && (
                        <PricingBreakdownCard pricing={request.estimatedPricing} />
                    )}

                    {/* Actions */}
                    {hasQuote && !isConfirmed && (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                            <h3 className="font-medium text-emerald-400 mb-2">Quote Ready!</h3>
                            <p className="text-sm text-slate-300 mb-4">
                                Review the pricing breakdown above and confirm to proceed with the order.
                            </p>
                            <button
                                onClick={handleConfirmQuote}
                                disabled={confirming}
                                className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50"
                            >
                                {confirming ? "Confirming..." : "Confirm Quote & Create Order"}
                            </button>
                        </div>
                    )}

                    {isConfirmed && (
                        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-6">
                            <h3 className="font-medium text-blue-400 mb-2">✓ Quote Confirmed</h3>
                            <p className="text-sm text-slate-300 mb-4">
                                Your order has been created. View it in your Orders section.
                            </p>
                            <Link
                                href="/buyer/orders"
                                className="inline-block rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-slate-950 hover:bg-blue-400 transition-colors"
                            >
                                View Orders
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar - Timeline */}
                <div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="font-medium text-slate-100 mb-4">Status Timeline</h3>
                        <StepTimeline steps={getTimelineSteps()} />
                    </div>
                </div>
            </div>
        </div>
    );
}
