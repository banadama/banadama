// app/rfq/[id]/page.tsx - Premium RFQ Detail Page
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRfq, confirmRfq } from "@/lib/rfqApi";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { PricingBreakdownCard } from "@/components/pricing/PricingBreakdownCard";

const STATUS_STEPS = ["PENDING", "ASSIGNED", "QUOTED", "CONFIRMED"];

export default function RequestDetailPage({ params: { id } }: { params: { id: string } }) {
    const router = useRouter();
    const [request, setRequest] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        fetchRequest();
    }, [id]);

    const fetchRequest = async () => {
        try {
            setLoading(true);
            const data = await getRfq<any>(id);
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
            await confirmRfq(id);
            await fetchRequest();
        } catch (err: any) {
            setError(err.message || "Failed to confirm quote");
        } finally {
            setConfirming(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading Sourcing Details...</p>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icons.AlertTriangle size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Request Not Found</h2>
                <p className="text-slate-500 mb-8 font-medium">{error || "The sourcing request you are looking for does not exist."}</p>
                <Link href="/rfq">
                    <Button variant="glass" className="rounded-xl font-black uppercase tracking-widest px-8">Return to Dashboard</Button>
                </Link>
            </div>
        );
    }

    const hasQuote = request.status === "QUOTED" && (request.estimatedPricing || request.quote);
    const isConfirmed = request.status === "CONFIRMED";
    const statusIndex = STATUS_STEPS.indexOf(request.status);

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-10 pb-32">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link href="/rfq" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-500 transition-colors mb-4 group">
                        <Icons.ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Feed
                    </Link>
                    <div className="flex items-center gap-4 flex-wrap">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">{request.title || "Untithed Request"}</h1>
                        <Badge variant={request.status === "QUOTED" ? "success" : "glass"} className="rounded-xl px-4 py-1.5 font-black uppercase text-[10px] tracking-widest shadow-sm">
                            {request.status}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="glass" className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs px-6 py-3">
                        <Icons.Download size={16} className="mr-2" /> PDF
                    </Button>
                    <Link href="/buyer/messages">
                        <Button className="bg-slate-900 text-white rounded-xl font-bold text-xs px-6 py-3 shadow-lg hover:bg-black transition-all">
                            <Icons.Chat size={16} className="mr-2" /> CHAT WITH OPS
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
                <div className="flex flex-col gap-10">
                    {/* Progress Tracker */}
                    <Card className="border-none shadow-premium bg-white rounded-[2rem] overflow-hidden">
                        <CardBody className="p-8 md:p-12">
                            <div className="flex items-center justify-between mb-12 overflow-x-auto pb-4 gap-8 scrollbar-hide">
                                {STATUS_STEPS.map((step, idx) => (
                                    <div key={step} className="flex flex-col items-center gap-4 relative min-w-[100px]">
                                        {idx < STATUS_STEPS.length - 1 && (
                                            <div className={`absolute top-6 left-1/2 w-full h-[2px] ${idx < statusIndex ? "bg-orange-500" : "bg-slate-100"}`} />
                                        )}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 ${idx <= statusIndex ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20 scale-110" : "bg-slate-50 text-slate-300"}`}>
                                            {idx < statusIndex ? <Icons.Check size={24} /> : (idx === statusIndex ? <Icons.Activity size={24} /> : <Icons.Clock size={24} />)}
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-[10px] font-black uppercase tracking-widest ${idx <= statusIndex ? "text-slate-900" : "text-slate-300"}`}>{step}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                                    <Icons.Info size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-0.5">Current Phase</p>
                                    <p className="text-sm font-medium text-slate-500">
                                        {request.status === "PENDING" && "Your request is being reviewed by our sourcing experts."}
                                        {request.status === "ASSIGNED" && "We have matched your request with a verified global supplier."}
                                        {request.status === "QUOTED" && "A formal quote has been generated. Please review and confirm."}
                                        {request.status === "CONFIRMED" && "Order successfully created. Logistics coordination in progress."}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Quotation Details */}
                    {hasQuote && (
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Formal Quotation</h2>
                                <span className="h-[2px] flex-1 bg-slate-100" />
                            </div>
                            {/* Reusing existing Pricing Breakdown with premium styling wrapper */}
                            <div className="bg-white rounded-[2rem] shadow-premium border border-slate-100 overflow-hidden">
                                <PricingBreakdownCard pricing={request.estimatedPricing || request.quote} />
                            </div>

                            {!isConfirmed && (
                                <div className="bg-orange-500 p-10 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-orange-500/20">
                                    <div>
                                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Ready to proceed?</h3>
                                        <p className="text-orange-100 text-sm font-medium">Confirm this quote to lock in pricing and start factory production.</p>
                                    </div>
                                    <Button
                                        onClick={handleConfirmQuote}
                                        disabled={confirming}
                                        className="bg-white text-orange-600 font-black px-12 py-6 rounded-2xl shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-widest active:scale-95 whitespace-nowrap"
                                    >
                                        {confirming ? "CONFIRMING..." : "CONFIRM QUOTE"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Detailed Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-none shadow-premium bg-white rounded-[2rem]">
                            <CardBody className="p-8">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Specifications</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Quantity</span>
                                        <span className="text-sm font-black text-slate-900">{request.quantity?.toLocaleString()} Units</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Category</span>
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{request.category || "General"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Region</span>
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{request.region || "LAGOS"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Created</span>
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="border-none shadow-premium bg-white rounded-[2rem]">
                            <CardBody className="p-8">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Supplier Info</h4>
                                {request.supplier ? (
                                    <div className="flex flex-col items-center text-center gap-4">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                                            <Icons.Globe size={32} />
                                        </div>
                                        <div>
                                            <h5 className="text-lg font-black text-slate-900 uppercase tracking-tight">{request.supplier.businessName}</h5>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Factory Partner</p>
                                        </div>
                                        <Link href={`/marketplace/suppliers/${request.supplier.slug || request.supplier.id}`}>
                                            <Button variant="glass" className="rounded-xl font-bold text-[10px] uppercase tracking-widest px-6 py-2">VISIT SHOWROOM</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-6 text-center text-slate-300">
                                        <Icons.Users size={40} className="mb-4 opacity-20" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Awaiting Assignment</p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>

                    {request.description && (
                        <Card className="border-none shadow-premium bg-white rounded-[2rem]">
                            <CardBody className="p-8">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Internal Notes / Description</h4>
                                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 italic text-sm text-slate-600 leading-relaxed font-medium">
                                    {request.description}
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </div>

                {/* Vertical Sidebar - Helpers */}
                <div className="flex flex-col gap-6 sticky top-28">
                    {isConfirmed && (
                        <Link href="/buyer/orders">
                            <Card className="border-none shadow-xl bg-emerald-500 text-white rounded-[2rem] hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl -mr-16 -mt-16" />
                                <CardBody className="p-8 relative z-10 text-center">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-lg">
                                        <Icons.Package size={24} />
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-1">View Order</h4>
                                    <p className="text-[10px] font-bold text-emerald-100 uppercase">Tracking & Logistics</p>
                                </CardBody>
                            </Card>
                        </Link>
                    )}

                    <Card className="border-none shadow-premium bg-[#1E293B] text-white rounded-[2rem] overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -mr-16 -mt-16" />
                        <CardBody className="p-8 relative z-10">
                            <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-orange-400">Need Modification?</h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">If the requirements have changed or you need a different quantity, please talk to your sourcing agent directly.</p>
                            <Link href="/buyer/messages">
                                <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black rounded-xl py-4 uppercase tracking-[0.2em] transition-all">
                                    MESSAGE AGENT
                                </Button>
                            </Link>
                        </CardBody>
                    </Card>

                    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Icons.ShieldCheck size={20} className="text-emerald-500" />
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Escrow Protected</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Your funds are only released to the supplier after you confirm delivery in the order management panel.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
