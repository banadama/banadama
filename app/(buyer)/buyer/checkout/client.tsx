// app/(buyer)/buyer/checkout/client.tsx - VERSION 2 (UI POLISH)
"use client";

import * as React from "react";
import { apiPatch, apiPost } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import clsx from "clsx";

function DeliveryForm({ sessionId, initial, tradeMode }: { sessionId: string; initial: any; tradeMode: "LOCAL" | "GLOBAL_BUY_ONLY" }) {
    const { showToast } = useToast();
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
            showToast("Delivery details updated.", "success");
        } catch {
            showToast("Unable to save delivery details. Try again.", "error");
        } finally {
            setSaving(false);
        }
    }

    const Input = ({ placeholder, value, onChange, className, type = "text" }: any) => (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={clsx(
                "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all",
                className
            )}
        />
    );

    return (
        <Card className="border-white/5 bg-white/[0.01]">
            <CardBody className="flex flex-col gap-5">
                {tradeMode === "GLOBAL_BUY_ONLY" && (
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-3 flex gap-3">
                        <Icons.Globe size={18} className="text-orange-500 shrink-0" />
                        <p className="text-[11px] text-orange-400 font-medium leading-relaxed">
                            International shipping is coordinated by Banadama Ops. Please provide your destination address below.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Recipient Full Name *" value={form.name} onChange={(v: any) => setForm({ ...form, name: v })} />
                    <Input placeholder="Contact Phone *" value={form.phone} onChange={(v: any) => setForm({ ...form, phone: v })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500/50 outline-none transition-all appearance-none cursor-pointer"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                    >
                        <option value="NG" className="bg-[#0f172a]">Nigeria</option>
                        <option value="BD" className="bg-[#0f172a]">Bangladesh</option>
                    </select>
                    <Input placeholder="State / Province *" value={form.state} onChange={(v: any) => setForm({ ...form, state: v })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="City *" value={form.city} onChange={(v: any) => setForm({ ...form, city: v })} />
                    <Input placeholder="Detailed Address *" value={form.address1} onChange={(v: any) => setForm({ ...form, address1: v })} />
                </div>

                <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500/50 outline-none transition-all min-h-[100px]"
                    placeholder="Instructions for delivery or special notes for Ops..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />

                <Button variant="glass" onClick={save} disabled={saving} className="w-full border-white/10 bg-white/5">
                    {saving ? "Saving Details..." : "Confirm Shipping Address"}
                </Button>
            </CardBody>
        </Card>
    );
}

function PricingDisplay({ pricing }: { pricing: any }) {
    const currency = pricing.currency ?? "NGN";
    const subtotal = pricing.subtotal ?? 0;
    const platformFee = pricing.platformFee ?? pricing.fees ?? 0;
    const shipping = pricing.shipping ?? pricing.shippingEstimate ?? 0;
    const total = pricing.total ?? pricing.grandTotal ?? (subtotal + platformFee + shipping);

    const Row = ({ label, value, highlight }: any) => (
        <div className="flex justify-between items-center py-1">
            <span className="text-xs font-medium text-slate-500">{label}</span>
            <span className={clsx("text-sm font-bold", highlight ? "text-orange-400" : "text-slate-300")}>{value}</span>
        </div>
    );

    return (
        <div className="space-y-2">
            <Row label="Subtotal" value={`${currency} ${Number(subtotal).toLocaleString()}`} />
            {platformFee > 0 && <Row label="Service Fee" value={`${currency} ${Number(platformFee).toLocaleString()}`} />}
            <Row
                label="Shipping Cost"
                value={shipping > 0 ? `${currency} ${Number(shipping).toLocaleString()}` : "To be calculated"}
                highlight={shipping === 0}
            />

            <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-4">
                <span className="text-base font-bold text-white">Grand Total</span>
                <span className="text-2xl font-black text-white">{currency} {Number(total).toLocaleString()}</span>
            </div>
        </div>
    );
}

function PayButton({ sessionId }: { sessionId: string }) {
    const { showToast } = useToast();
    const [loading, setLoading] = React.useState(false);

    async function pay() {
        if (loading) return;
        setLoading(true);
        try {
            const res = await apiPost<any>(`/api/checkout-sessions/${sessionId}/pay`, {});
            const orderId = res?.orderIds?.[0] ?? res?.orderId;

            showToast("Payment received. Escrow locked.", "success");

            if (orderId) {
                location.href = `/buyer/orders/${orderId}`;
                return;
            }
            location.href = `/buyer/checkout/success`;
        } catch {
            showToast("Payment failed. Please try again.", "error");
            setLoading(false);
        }
    }

    return (
        <Button variant="primary" size="lg" onClick={pay} disabled={loading} className="w-full h-14 text-lg">
            {loading ? (
                <>Processing...</>
            ) : (
                <>
                    <Icons.Lock size={20} className="mr-2" />
                    Pay & Lock Escrow
                </>
            )}
        </Button>
    );
}

export const CheckoutClientComponents = {
    DeliveryForm,
    PricingDisplay,
    PayButton,
};

