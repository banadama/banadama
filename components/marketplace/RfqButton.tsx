"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons/icons";
import { apiGet } from "@/lib/api";
import { rfqEntryHref, rfqLoginGateHref } from "@/lib/rfqEntry";
import { useToast } from "@/components/ui/toast/ToastProvider";

export function RfqButton({
    productId,
    className = "bd-btn",
    label = "Request Quote (RFQ)",
}: {
    productId: string;
    className?: string;
    label?: string;
}) {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);

    async function onClick() {
        if (loading) return;
        setLoading(true);

        try {
            await apiGet("/api/user");
            toast.push({ type: "info", title: "Opening RFQ", message: "Loading request form..." });
            router.push(rfqEntryHref(productId));
        } catch {
            toast.push({ type: "info", title: "Sign in required", message: "Please sign in to submit an RFQ." });
            router.push(rfqLoginGateHref(productId));
        } finally {
            setLoading(false);
        }
    }

    const RFQIcon = Icons.get("RFQ");

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
            <RFQIcon size={18} />
            {loading ? "Opening..." : label}
        </button>
    );
}
