// app/(buyer)/buyer/checkout/page.tsx - Checkout Page (Server Component)
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CheckoutClientComponents } from "./client";

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

    // If no session, show mock checkout (for dev/testing)
    if (!sessionId) {
        return (
            <div className="bd-container bd-page">
                <Breadcrumbs items={[{ label: "Cart", href: "/buyer/cart" }, { label: "Checkout" }]} />

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
                    <div>
                        <div style={{ fontWeight: 950, fontSize: 22 }}>Checkout</div>
                        <div style={{ color: "var(--bd-muted)", marginTop: 4 }}>Local checkout. Escrow protected.</div>
                    </div>
                    <span className="bd-badge">
                        <Icons.Lock size={14} /> Escrow on payment
                    </span>
                </div>

                <div className="bd-card bd-card-pad" style={{ color: "var(--bd-muted)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <Icons.Warning size={20} />
                        <span>No checkout session found. Please start from the cart.</span>
                    </div>
                    <a className="bd-btn" href="/buyer/cart" style={{ display: "inline-flex" }}>
                        <Icons.Cart size={16} /> Go to Cart
                    </a>
                </div>
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
            <div className="bd-container bd-page">
                <div className="bd-card bd-card-pad" style={{ color: "var(--bd-muted)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <Icons.Warning size={20} />
                        <span>Unable to load checkout session.</span>
                    </div>
                    <a className="bd-btn" href="/buyer/cart" style={{ display: "inline-flex" }}>
                        <Icons.Cart size={16} /> Back to Cart
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bd-container bd-page">
            <Breadcrumbs items={[{ label: "Cart", href: "/buyer/cart" }, { label: "Checkout" }]} />

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
                <div>
                    <div style={{ fontWeight: 950, fontSize: 22 }}>Checkout</div>
                    <div style={{ color: "var(--bd-muted)", marginTop: 4 }}>
                        {s.tradeMode === "GLOBAL_BUY_ONLY" ? "Global buy-only. Ops coordinates international logistics." : "Local checkout. Escrow protected."}
                    </div>
                </div>

                <span className="bd-badge">
                    <Icons.Lock size={14} /> Escrow on payment
                </span>
            </div>

            <div className="bd-product-layout">
                {/* Left: forms + items */}
                <div className="bd-card bd-card-pad">
                    <div style={{ display: "grid", gap: 14 }}>
                        <section>
                            <div style={{ fontWeight: 950, marginBottom: 8 }}>Order Summary</div>
                            <div style={{ display: "grid", gap: 10 }}>
                                {(s.items ?? []).map((it: any, idx: number) => (
                                    <div key={idx} className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                                            <div style={{ fontWeight: 900 }}>{it.title ?? it.productTitle ?? "Item"}</div>
                                            <span className="bd-badge">
                                                <Icons.Receipt size={14} /> {it.currency ?? s.pricing?.currency ?? "NGN"} {Number(it.lineTotal ?? it.total ?? 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div style={{ marginTop: 6, color: "var(--bd-muted)", display: "flex", gap: 10, flexWrap: "wrap" }}>
                                            <span className="bd-badge"><Icons.Product size={14} /> Qty: {it.qty ?? 1}</span>
                                            <span className="bd-badge"><Icons.Cart size={14} /> Buy Now</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div style={{ fontWeight: 950, marginBottom: 8 }}>Delivery</div>
                            <CheckoutClientComponents.DeliveryForm sessionId={s.id} initial={s.address ?? {}} tradeMode={s.tradeMode} />
                        </section>

                        <section>
                            <div style={{ fontWeight: 950, marginBottom: 8 }}>Payment</div>
                            <div className="bd-card bd-card-pad" style={{ boxShadow: "none", background: "rgba(34, 197, 94, 0.08)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <Icons.Lock size={18} style={{ color: "var(--bd-success)" }} />
                                    <div style={{ fontWeight: 900, color: "var(--bd-success)" }}>Escrow Protection</div>
                                </div>
                                <div className="bd-small">
                                    Funds are locked in escrow and released only after delivery confirmation.
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Right: pricing + pay */}
                <div className="bd-card bd-card-pad bd-sticky">
                    <div style={{ display: "grid", gap: 12 }}>
                        <div style={{ fontWeight: 950 }}>Pricing</div>
                        <CheckoutClientComponents.PricingDisplay pricing={s.pricing ?? {}} />
                        <CheckoutClientComponents.PayButton sessionId={s.id} />
                        <a className="bd-btn" href="/buyer/cart" style={{ justifyContent: "center", width: "100%" }}>
                            <Icons.ChevronRight size={18} style={{ transform: "rotate(180deg)" }} />
                            Back to Cart
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
