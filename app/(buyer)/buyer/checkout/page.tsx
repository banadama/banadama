// app/(buyer)/buyer/checkout/page.tsx - VERSION 2 (LIQUID GLASS)
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CheckoutClientComponents } from "./client";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type CheckoutSession = {
    id: string;
    status: "DRAFT" | "PAYMENT_PENDING" | "PAID_ESCROW" | "CANCELLED" | "EXPIRED";
    tradeMode: "LOCAL" | "GLOBAL_BUY_ONLY";
    address?: any;
    pricing?: any;
    items?: any[];
};

export default async function CheckoutPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
    await requireRole("BUYER");

    const sessionId = typeof searchParams.session === "string" ? searchParams.session : "";

    if (!sessionId) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10">
                <Breadcrumbs items={[{ label: "Cart", href: "/buyer/cart" }, { label: "Checkout" }]} />
                <Card className="mt-10 border-white/5 bg-white/[0.02]">
                    <CardBody className="flex flex-col items-center py-20 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                            <Icons.Warning size={32} className="text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">No Session Found</h2>
                        <p className="text-slate-400 max-w-sm mb-8">Your checkout session has expired or was not found. Please restart from your cart.</p>
                        <Link href="/buyer/cart">
                            <Button variant="primary">Return to Cart</Button>
                        </Link>
                    </CardBody>
                </Card>
            </div>
        );
    }

    let s: CheckoutSession | null = null;
    try {
        s = await apiGet(`/api/checkout-sessions/${sessionId}`);
    } catch {
        s = null;
    }

    if (!s) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10">
                <Card className="border-white/5 bg-white/[0.02]">
                    <CardBody className="flex flex-col items-center py-20 text-center">
                        <Icons.X size={48} className="text-red-500 mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Checkout Error</h2>
                        <p className="text-slate-400 mb-8">Unable to load checkout details.</p>
                        <Link href="/buyer/cart">
                            <Button variant="secondary">Back to Cart</Button>
                        </Link>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <Breadcrumbs items={[{ label: "Cart", href: "/buyer/cart" }, { label: "Checkout" }]} />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-10 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Checkout</h1>
                    <p className="text-slate-400 mt-2 font-medium">
                        {s.tradeMode === "GLOBAL_BUY_ONLY"
                            ? "International Escrow — Global logistics coordinated by Ops"
                            : "Local Escrow — Secure trade within your region"}
                    </p>
                </div>
                <Badge variant="accent" className="bg-orange-500/10 border-orange-500/20 text-orange-400 px-4 py-2 text-sm font-bold">
                    <Icons.Lock size={16} className="mr-2" /> 100% Secure Escrow
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Summary Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-xl font-bold text-white">Order Summary</h2>
                            <Badge className="bg-white/5 border-white/10 text-slate-400">{s.items?.length || 0} items</Badge>
                        </div>
                        <div className="space-y-4">
                            {(s.items ?? []).map((it: any, idx: number) => (
                                <Card key={idx} className="border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors">
                                    <CardBody className="flex items-center justify-between gap-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
                                                <Icons.Package size={20} className="text-slate-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{it.title ?? it.productTitle ?? "Product"}</h4>
                                                <div className="flex gap-4 mt-1">
                                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Qty: {it.qty ?? 1}</span>
                                                    <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Buy Now</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-black text-white">
                                                {it.currency ?? s?.pricing?.currency ?? "NGN"} {Number(it.lineTotal ?? it.total ?? 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Delivery Form */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Shipping Destination</h2>
                        <CheckoutClientComponents.DeliveryForm sessionId={s.id} initial={s.address ?? {}} tradeMode={s.tradeMode} />
                    </section>
                </div>

                {/* Sidebar Sticky */}
                <aside className="lg:sticky lg:top-24 h-fit">
                    <Card className="border-white/10 bg-white/[0.02] shadow-2xl shadow-orange-500/5 overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                        <CardBody className="p-6">
                            <h3 className="text-lg font-bold text-white mb-6">Order Total</h3>

                            <CheckoutClientComponents.PricingDisplay pricing={s.pricing ?? {}} />

                            <div className="my-8 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                <div className="flex gap-3">
                                    <Icons.ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                                    <p className="text-[11px] text-emerald-400 font-medium leading-relaxed">
                                        Funds are locked in escrow and only released to the seller after delivery confirmation.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <CheckoutClientComponents.PayButton sessionId={s.id} />
                                <Link href="/buyer/cart" className="block text-center">
                                    <span className="text-sm font-bold text-slate-500 hover:text-white transition-colors">
                                        Modify Items in Cart
                                    </span>
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </aside>
            </div>
        </div>
    );
}

