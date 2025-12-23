// app/(buyer)/buyer/checkout/client.tsx - Checkout Client Components with Toast
"use client";

import * as React from "react";
import { apiPatch, apiPost } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { useToast } from "@/components/ui/toast/ToastProvider";

function DeliveryForm({ sessionId, initial, tradeMode }: { sessionId: string; initial: any; tradeMode: "LOCAL" | "GLOBAL_BUY_ONLY" }) {
    const toast = useToast();
    const [form, setForm] = React.useState<any>({
        name: initial.name ?? "",
        phone: initial.phone ?? "",
        country: initial.country ?? "NG",
        state: initial.state ?? "",
        city: initial.city ?? "",
        address1: initial.address1 ?? "",
        notes: initial.notes ?? "",
    });
    const [saving, setSaving] = React.useState(false);

    async function save() {
        setSaving(true);
        try {
            await apiPatch(`/api/checkout-sessions/${sessionId}`, { address: form });
            toast.push({ type: "success", title: "Saved", message: "Delivery details updated." });
        } catch {
            toast.push({ type: "error", title: "Save failed", message: "Unable to save delivery details. Try again." });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
            <div style={{ display: "grid", gap: 10 }}>
                {tradeMode === "GLOBAL_BUY_ONLY" && (
                    <div className="bd-badge bd-badge-warning" style={{ marginBottom: 8 }}>
                        <Icons.Globe size={14} /> International shipping coordinated by Ops
                    </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input className="bd-input" placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <input className="bd-input" placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <select className="bd-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                        <option value="NG">Nigeria</option>
                        <option value="BD">Bangladesh</option>
                    </select>
                    <input className="bd-input" placeholder="State *" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input className="bd-input" placeholder="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    <input className="bd-input" placeholder="Address line *" value={form.address1} onChange={(e) => setForm({ ...form, address1: e.target.value })} />
                </div>

                <textarea
                    className="bd-input"
                    style={{ minHeight: 80, paddingTop: 10 }}
                    placeholder="Notes for Ops / delivery instructions"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />

                <button className="bd-btn" onClick={save} disabled={saving} style={{ justifyContent: "center" }}>
                    {saving ? (
                        <>Saving...</>
                    ) : (
                        <><Icons.Document size={18} /> Save delivery details</>
                    )}
                </button>
            </div>
        </div>
    );
}

function PricingDisplay({ pricing }: { pricing: any }) {
    const currency = pricing.currency ?? "NGN";
    const subtotal = pricing.subtotal ?? 0;
    const platformFee = pricing.platformFee ?? pricing.fees ?? 0;
    const shipping = pricing.shipping ?? pricing.shippingEstimate ?? 0;
    const total = pricing.total ?? pricing.grandTotal ?? (subtotal + platformFee + shipping);

    return (
        <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--bd-muted)" }}>
                <span>Subtotal</span>
                <span>{currency} {Number(subtotal).toLocaleString()}</span>
            </div>

            {platformFee > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--bd-muted)" }}>
                    <span>Platform Fee</span>
                    <span>{currency} {Number(platformFee).toLocaleString()}</span>
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--bd-muted)" }}>
                <span>Shipping</span>
                {shipping > 0 ? (
                    <span>{currency} {Number(shipping).toLocaleString()}</span>
                ) : (
                    <span className="bd-small">Calculated by Ops</span>
                )}
            </div>

            <div style={{ borderTop: "1px solid var(--bd-border)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 900 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 18, color: "var(--bd-success)" }}>
                    {currency} {Number(total).toLocaleString()}
                </span>
            </div>
        </div>
    );
}

function PayButton({ sessionId }: { sessionId: string }) {
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);

    async function pay() {
        if (loading) return;
        setLoading(true);
        try {
            const res = await apiPost(`/api/checkout-sessions/${sessionId}/pay`, {});
            const orderId = res?.orderIds?.[0] ?? res?.orderId;

            toast.push({ type: "success", title: "Payment received", message: "Escrow locked. Redirecting to your order..." });

            if (orderId) {
                location.href = `/buyer/orders/${orderId}`;
                return;
            }

            // fallback
            location.href = `/buyer/checkout/success`;
        } catch {
            toast.push({ type: "error", title: "Payment failed", message: "Please try again." });
            setLoading(false);
        }
    }

    return (
        <button className="bd-btn bd-btn-primary" onClick={pay} disabled={loading} style={{ justifyContent: "center", width: "100%" }}>
            <Icons.Lock size={18} />
            {loading ? "Processing..." : "Pay & Lock Escrow"}
        </button>
    );
}

export const CheckoutClientComponents = {
    DeliveryForm,
    PricingDisplay,
    PayButton,
};
