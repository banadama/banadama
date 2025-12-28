// app/(buyer)/buyer/cart/client.tsx - VERSION 2 (UI POLISH)
"use client";

import * as React from "react";
import { apiPatch, apiDelete, apiPost } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

function QtyStepper({ itemId, qty }: { itemId: string; qty: number }) {
    const { showToast } = useToast();
    const [v, setV] = React.useState(qty);
    const [loading, setLoading] = React.useState(false);

    async function setQty(next: number) {
        if (next < 1) return;
        const prev = v;
        setV(next);
        setLoading(true);
        try {
            await apiPatch(`/api/cart/items/${itemId}`, { qty: next });
            showToast("Quantity updated.", "success");
        } catch {
            setV(prev);
            showToast("Unable to update quantity. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                onClick={() => setQty(v - 1)}
                disabled={loading || v <= 1}
            >
                <Icons.Minus size={14} className="text-slate-400" />
            </button>
            <span className="w-10 text-center text-sm font-black text-white">{v}</span>
            <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                onClick={() => setQty(v + 1)}
                disabled={loading}
            >
                <Icons.Plus size={14} className="text-slate-400" />
            </button>
        </div>
    );
}

function RemoveItem({ itemId }: { itemId: string }) {
    const { showToast } = useToast();
    const [loading, setLoading] = React.useState(false);

    async function remove() {
        if (loading) return;
        setLoading(true);
        try {
            await apiDelete(`/api/cart/items/${itemId}`);
            showToast("Item removed from cart.", "success");
            location.reload();
        } catch {
            setLoading(false);
            showToast("Unable to remove item. Please try again.", "error");
        }
    }

    return (
        <button
            className="text-xs font-bold text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1.5 px-2 py-1"
            onClick={remove}
            disabled={loading}
        >
            <Icons.X size={14} /> Remove
        </button>
    );
}

function CheckoutButton() {
    const { showToast } = useToast();
    const [loading, setLoading] = React.useState(false);

    async function go() {
        if (loading) return;
        setLoading(true);
        try {
            const res = await apiPost<any>("/api/cart/checkout", { tradeMode: "LOCAL", address: {} });
            const id = res?.checkoutSessionId;
            if (id) {
                showToast("Redirecting to checkout...", "success");
                location.href = `/buyer/checkout?session=${encodeURIComponent(id)}`;
                return;
            }
            showToast("Could not create checkout session.", "error");
            setLoading(false);
        } catch {
            showToast("Please try again.", "error");
            setLoading(false);
        }
    }

    return (
        <Button variant="primary" size="lg" onClick={go} disabled={loading} className="w-full h-14 text-lg">
            {loading ? (
                "Initialising..."
            ) : (
                <>
                    <Icons.Lock size={20} className="mr-2" />
                    Checkout Now
                </>
            )}
        </Button>
    );
}

function ClearCartButton() {
    const { showToast } = useToast();
    const [loading, setLoading] = React.useState(false);

    async function clear() {
        if (loading) return;
        if (!confirm("Are you sure you want to clear your cart?")) return;
        setLoading(true);
        try {
            await apiDelete("/api/cart");
            showToast("Cart cleared.", "success");
            location.reload();
        } catch {
            setLoading(false);
            showToast("Unable to clear cart. Please try again.", "error");
        }
    }

    return (
        <button
            className="w-full text-center py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
            onClick={clear}
            disabled={loading}
        >
            Clear Entire Cart
        </button>
    );
}

export const CartClientComponents = {
    QtyStepper,
    RemoveItem,
    CheckoutButton,
    ClearCartButton,
};

