"use client";

import * as React from "react";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";
import { payCreatorOrder, confirmCreatorOrder } from "@/lib/creatorApi";

export function BuyerCreatorOrderActions({ orderId, status }: { orderId: string; status: string }) {
    const toast = useToast();
    const [loading, setLoading] = React.useState<"PAY" | "CONFIRM" | null>(null);

    const canPay = status === "PENDING";
    const canConfirm = status === "DELIVERED";

    async function pay() {
        setLoading("PAY");
        try {
            await payCreatorOrder(orderId);
            toast.push({ type: "success", title: "Paid into escrow" });
            window.location.reload();
        } catch (e: any) {
            toast.push({ type: "error", title: "Payment failed", message: e?.message });
        } finally {
            setLoading(null);
        }
    }

    async function confirm() {
        setLoading("CONFIRM");
        try {
            await confirmCreatorOrder(orderId);
            toast.push({ type: "success", title: "Confirmed delivery" });
            window.location.reload();
        } catch (e: any) {
            toast.push({ type: "error", title: "Confirm failed", message: e?.message });
        } finally {
            setLoading(null);
        }
    }

    return (
        <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ fontWeight: 950, marginRight: "auto" }}>Actions</div>

            {canPay ? (
                <button className="bd-btn bd-btn-primary" onClick={pay} disabled={loading !== null} style={{ justifyContent: "center" }}>
                    <Icons.CreditCard size={18} /> {loading === "PAY" ? "Paying" : "Pay (escrow)"}
                </button>
            ) : null}

            {canConfirm ? (
                <button className="bd-btn bd-btn-primary" onClick={confirm} disabled={loading !== null} style={{ justifyContent: "center" }}>
                    <Icons.Check size={18} /> {loading === "CONFIRM" ? "Confirming" : "Confirm & release payout"}
                </button>
            ) : null}

            <span className="bd-badge">
                <Icons.ShieldCheck size={14} /> Escrow protected
            </span>
        </div>
    );
}
