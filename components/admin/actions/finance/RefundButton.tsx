// components/admin/actions/finance/RefundButton.tsx
"use client";

import * as React from "react";
import { apiPost } from "@/lib/api";
import { useAdminAction } from "@/components/admin/useAdminAction";
import { Icons } from "@/components/icons/icons";

export function RefundButton({ orderId }: { orderId: string }) {
    const { loading, run } = useAdminAction();

    async function refund() {
        await run(
            () => apiPost(`/api/admin/finance/orders/${orderId}/refund`, {}),
            { start: "Processing refund", ok: "Refund created", fail: "Refund failed" }
        );
        location.reload();
    }

    return (
        <button className="bd-btn" onClick={refund} disabled={loading}>
            <Icons.Receipt size={18} /> {loading ? "Working..." : "Refund"}
        </button>
    );
}
