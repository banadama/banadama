// app/(buyer)/buyer/cart/client.tsx - Cart Client Components with Toast
"use client";

import * as React from "react";
import { apiPatch, apiDelete, apiPost } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { useToast } from "@/components/ui/toast/ToastProvider";

function QtyStepper({ itemId, qty }: { itemId: string; qty: number }) {
    const toast = useToast();
    const [v, setV] = React.useState(qty);
    const [loading, setLoading] = React.useState(false);

    async function setQty(next: number) {
        if (next < 1) return;
        const prev = v;
        setV(next);
        setLoading(true);
        try {
            await apiPatch(`/api/cart/items/${itemId}`, { qty: next });
            toast.push({ type: "success", title: "Updated", message: "Quantity updated." });
        } catch {
            setV(prev);
            toast.push({ type: "error", title: "Update failed", message: "Unable to update quantity. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="bd-btn" onClick={() => setQty(v - 1)} disabled={loading} style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}>
                <Icons.Minus size={16} />
            </button>
            <span className="bd-badge" style={{ minWidth: 44, justifyContent: "center" }}>{v}</span>
            <button className="bd-btn" onClick={() => setQty(v + 1)} disabled={loading} style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}>
                <Icons.Plus size={16} />
            </button>
        </div>
    );
}

function RemoveItem({ itemId }: { itemId: string }) {
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);

    async function remove() {
        if (loading) return;
        setLoading(true);
        try {
            await apiDelete(`/api/cart/items/${itemId}`);
            toast.push({ type: "success", title: "Removed", message: "Item removed from cart." });
            location.reload();
        } catch {
            setLoading(false);
            toast.push({ type: "error", title: "Remove failed", message: "Unable to remove item. Please try again." });
        }
    }

    return (
        <button className="bd-btn" onClick={remove} disabled={loading} style={{ justifyContent: "center" }}>
            <Icons.X size={16} /> Remove
        </button>
    );
}

function CheckoutButton() {
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);

    async function go() {
        if (loading) return;
        setLoading(true);
        try {
            const res = await apiPost("/api/cart/checkout", { tradeMode: "LOCAL", address: {} });
            const id = res?.checkoutSessionId;
            if (id) {
                toast.push({ type: "success", title: "Checkout ready", message: "Redirecting to checkout..." });
                location.href = `/buyer/checkout?session=${encodeURIComponent(id)}`;
                return;
            }
            toast.push({ type: "error", title: "Checkout failed", message: "Could not create checkout session." });
            setLoading(false);
        } catch {
            toast.push({ type: "error", title: "Checkout failed", message: "Please try again." });
            setLoading(false);
        }
    }

    return (
        <button className="bd-btn bd-btn-primary" onClick={go} disabled={loading} style={{ justifyContent: "center", width: "100%" }}>
            <Icons.Lock size={18} /> {loading ? "Preparing..." : "Proceed to Checkout"}
        </button>
    );
}

function ClearCartButton() {
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);

    async function clear() {
        if (loading) return;
        setLoading(true);
        try {
            await apiDelete("/api/cart");
            toast.push({ type: "success", title: "Cleared", message: "Cart cleared." });
            location.reload();
        } catch {
            setLoading(false);
            toast.push({ type: "error", title: "Clear failed", message: "Unable to clear cart. Please try again." });
        }
    }

    return (
        <button className="bd-btn" onClick={clear} disabled={loading} style={{ justifyContent: "center", width: "100%" }}>
            <Icons.X size={18} /> Clear Cart
        </button>
    );
}

export const CartClientComponents = {
    QtyStepper,
    RemoveItem,
    CheckoutButton,
    ClearCartButton,
};
