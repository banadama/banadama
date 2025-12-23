// app/(buyer)/buyer/cart/page.tsx - Cart Page (Server Component)
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { VerificationTick } from "@/components/trust/VerificationTick";
import { CartClientComponents } from "./client";

type CartItem = {
    id: string;
    productId: string;
    title: string;
    image?: string | null;
    qty: number;
    currency: string;
    unitPrice: number;
    supplier?: { id: string; name: string; verificationLevel: "NONE" | "GREEN_TICK" | "BLUE_TICK" };
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
        <div className="bd-container bd-page">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
                <div>
                    <div style={{ fontWeight: 950, fontSize: 22 }}>Cart</div>
                    <div style={{ color: "var(--bd-muted)", marginTop: 4 }}>Buy Now items only. RFQs are handled separately.</div>
                </div>
                <a className="bd-btn" href="/marketplace">
                    <Icons.Product size={18} />
                    Browse
                </a>
            </div>

            {items.length === 0 ? (
                <div className="bd-card bd-card-pad" style={{ textAlign: "center", color: "var(--bd-muted)" }}>
                    Your cart is empty.
                    <div style={{ marginTop: 10 }}>
                        <a className="bd-btn bd-btn-primary" href="/marketplace" style={{ justifyContent: "center", display: "inline-flex" }}>
                            <Icons.Search size={18} />
                            Browse Marketplace
                        </a>
                    </div>
                </div>
            ) : (
                <div className="bd-product-layout">
                    {/* Items */}
                    <div className="bd-card bd-card-pad">
                        <div style={{ display: "grid", gap: 10 }}>
                            {items.map((it) => (
                                <div key={it.id} className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 12, alignItems: "center" }}>
                                        <div className="bd-card" style={{ width: 72, height: 72, overflow: "hidden", borderRadius: 12 }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            {it.image ? <img src={it.image} alt={it.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                                                <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                                                    <Icons.Package size={24} style={{ opacity: 0.3 }} />
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {it.title}
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                                                {it.supplier ? (
                                                    <>
                                                        <span className="bd-badge">
                                                            <Icons.Users size={14} /> {it.supplier.name}
                                                        </span>
                                                        <VerificationTick level={it.supplier.verificationLevel} />
                                                    </>
                                                ) : null}

                                                <span className="bd-badge">
                                                    <Icons.Cart size={14} /> Buy Now
                                                </span>

                                                <span className="bd-badge">
                                                    <Icons.Receipt size={14} /> {it.currency} {Number(it.unitPrice).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                                            <CartClientComponents.QtyStepper itemId={it.id} qty={it.qty} />
                                            <CartClientComponents.RemoveItem itemId={it.id} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bd-card bd-card-pad bd-sticky">
                        <div style={{ display: "grid", gap: 10 }}>
                            <div className="bd-badge">
                                <Icons.Lock size={14} /> Escrow applies at checkout
                            </div>

                            <div style={{ fontWeight: 950, fontSize: 18 }}>Summary</div>

                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--bd-muted)" }}>
                                <span>Subtotal</span>
                                <span>{totals.currency} {Number(totals.subtotal ?? 0).toLocaleString()}</span>
                            </div>

                            <div style={{ borderTop: "1px solid var(--bd-border)", paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 900 }}>
                                <span>Total</span>
                                <span>{totals.currency} {Number(totals.subtotal ?? 0).toLocaleString()}</span>
                            </div>

                            <CartClientComponents.CheckoutButton />
                            <CartClientComponents.ClearCartButton />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
