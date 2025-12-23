// components/orders/OrderStatusUpdater.tsx - Order Status Update Component
"use client";

import * as React from "react";
import { apiPatch } from "@/lib/api";
import { useOpsAction } from "@/components/ops/useOpsAction";
import { Icons } from "@/components/icons/icons";

const ORDER_STATUSES = [
    "PENDING",
    "CONFIRMED",
    "IN_PRODUCTION",
    "READY_TO_SHIP",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

export function OrderStatusUpdater({ orderId, current }: { orderId: string; current: string }) {
    const { loading, run } = useOpsAction();
    const [status, setStatus] = React.useState(current);

    async function update() {
        if (status === current) return;

        await run(
            () => apiPatch(`/api/orders/${orderId}/status`, { status }),
            { start: "Updating status", ok: "Status updated", fail: "Update failed" }
        );
        location.reload();
    }

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <select className="bd-input" value={status} onChange={(e) => setStatus(e.target.value)} style={{ flex: 1 }}>
                    {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                </select>

                <button
                    className="bd-btn bd-btn-primary"
                    onClick={update}
                    disabled={loading || status === current}
                    style={{ justifyContent: "center" }}
                >
                    <Icons.ChevronRight size={18} /> {loading ? "Saving..." : "Update"}
                </button>
            </div>
        </div>
    );
}
