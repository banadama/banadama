// app/(buyer)/buyer/cart/page.tsx - VERSION 2 (LIQUID GLASS)
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { VerificationBadge } from "@/components/verification/VerificationBadge";
import { CartClientComponents } from "./client";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type CartItem = {
    id: string;
    productId: string;
    title: string;
    image?: string | null;
    qty: number;
    currency: string;
    unitPrice: number;
    supplier?: { id: string; name: string; verificationLevel: string };
    mode: "BUY_NOW";
};

export default async function CartPage() {
    await requireRole("BUYER");

    let data: any = null;
    try {
        data = await apiGet("/api/cart");
    } catch {
        data = { cart: null, items: [], totals: { subtotal: 0, currency: "NGN" } };
    }

    const items: CartItem[] = data?.items ?? [];
    const totals = data?.totals ?? { subtotal: 0, currency: "NGN" };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Shopping Cart</h1>
                    <p className="text-slate-400 mt-2 font-medium">Review your items for local fulfillment.</p>
                </div>
                <Link href="/marketplace">
                    <Button variant="secondary" size="md">
                        <Icons.Search size={18} className="mr-2" />
                        Continue Shopping
                    </Button>
                </Link>
            </div>

            {items.length === 0 ? (
                <Card className="border-white/5 bg-white/[0.02]">
                    <CardBody className="flex flex-col items-center py-24 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                            <Icons.Cart size={40} className="text-slate-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
                        <p className="text-slate-400 max-w-sm mb-10">Looks like you haven't added anything yet. Explore our marketplace for the best deals.</p>
                        <Link href="/marketplace">
                            <Button variant="primary" size="lg" className="px-10">
                                Browse Marketplace
                            </Button>
                        </Link>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((it) => (
                            <Card key={it.id} className="border-white/5 bg-white/[0.02] hover:border-white/10 transition-all group overflow-hidden">
                                <CardBody className="p-0">
                                    <div className="flex items-center gap-6 p-4">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shrink-0">
                                            {it.image ? (
                                                <img src={it.image} alt={it.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                                    <Icons.Package size={32} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between gap-4">
                                                <h3 className="text-lg font-bold text-white truncate">{it.title}</h3>
                                                <span className="text-lg font-black text-white">
                                                    {it.currency} {Number(it.unitPrice).toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                                {it.supplier && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{it.supplier.name}</span>
                                                        <VerificationBadge level={it.supplier.verificationLevel as any} size="sm" />
                                                    </div>
                                                )}
                                                <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 py-0.5 text-[10px] font-bold uppercase">
                                                    Escrow Protected
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between mt-6">
                                                <CartClientComponents.QtyStepper itemId={it.id} qty={it.qty} />
                                                <CartClientComponents.RemoveItem itemId={it.id} />
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="lg:sticky lg:top-24 h-fit">
                        <Card className="border-white/10 bg-white/[0.03] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                            <CardBody className="p-8">
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                    Order Summary
                                    <Badge className="bg-white/5 border-white/10 text-slate-400 font-bold">{items.length}</Badge>
                                </h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-slate-400 font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-white font-bold">{totals.currency} {Number(totals.subtotal ?? 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400 font-medium">
                                        <span>Shipping</span>
                                        <span className="text-orange-400 text-xs font-bold uppercase tracking-tight">Calculated at Checkout</span>
                                    </div>
                                    <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-lg font-bold text-white">Total</span>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-white block leading-none">{totals.currency} {Number(totals.subtotal ?? 0).toLocaleString()}</span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">Taxes included</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <CartClientComponents.CheckoutButton />
                                    <CartClientComponents.ClearCartButton />
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-2 opacity-40">
                                    <Icons.Lock size={12} className="text-white" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Secure Checkout</span>
                                </div>
                            </CardBody>
                        </Card>
                    </aside>
                </div>
            )}
        </div>
    );
}

