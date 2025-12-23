"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons/icons";
import { loginRedirect } from "@/lib/authRedirect";
import { apiGet } from "@/lib/api";
import { createBuyNowOrder } from "@/lib/buyNow";
import { useToast } from "@/components/ui/toast/ToastProvider";

export function BuyNowButton({
    productId,
    qty = 1,
    className = "bd-btn bd-btn-primary",
    label = "Buy Now",
}: {
    productId: string;
    qty?: number;
    className?: string;
    label?: string;
}) {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);

    async function ensureLoggedIn(): Promise<boolean> {
        try {
            await apiGet("/api/user");
            return true;
        } catch {
            toast.push({ type: "info", title: "Sign in required", message: "Please sign in to continue checkout." });
            router.push(loginRedirect(`/marketplace/products/${productId}`));
            return false;
        }
    }

    async function onClick() {
        if (loading) return;
        setLoading(true);

        try {
            const ok = await ensureLoggedIn();
            if (!ok) return;

            toast.push({ type: "info", title: "Starting checkout", message: "Preparing your order..." });

            const { orderId } = await createBuyNowOrder(productId, qty);

            toast.push({ type: "success", title: "Checkout ready", message: "Redirecting to your order..." });
            router.push(`/buyer/orders/${orderId}`);
        } catch {
            toast.push({ type: "error", title: "Checkout failed", message: "Unable to start checkout. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    const CartIcon = Icons.get("Cart");

    return (
        <button
            className={className}
            onClick={onClick}
            disabled={loading}
            style={{
                justifyContent: "center",
                opacity: loading ? 0.85 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 6,
            }}
        >
            <CartIcon size={18} />
            {loading ? "Starting..." : label}
        </button>
    );
}
