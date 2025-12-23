// components/ops/actions/rfq/AssignSupplierCard.tsx
"use client";

import * as React from "react";
import { apiPost } from "@/lib/api";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { useOpsAction } from "@/components/ops/useOpsAction";
import { Icons } from "@/components/icons/icons";

export function AssignSupplierCard({
    rfqId,
    suppliers,
}: {
    rfqId: string;
    suppliers: Array<{ id: string; name: string }>;
}) {
    const toast = useToast();
    const { loading, run } = useOpsAction();
    const [supplierId, setSupplierId] = React.useState("");

    async function assign() {
        if (!supplierId) {
            toast.push({ type: "warning", title: "Select supplier", message: "Choose a supplier to continue." });
            return;
        }
        await run(
            () => apiPost(`/api/rfq/${rfqId}/assign`, { supplierId }),
            { start: "Assigning supplier", ok: "Supplier assigned", fail: "Assignment failed" }
        );
        location.reload();
    }

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
            <div style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Assign Supplier</div>

                <select className="bd-input" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                    <option value="">Select supplier...</option>
                    {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                <button className="bd-btn bd-btn-primary" onClick={assign} disabled={loading} style={{ justifyContent: "center" }}>
                    <Icons.Users size={18} /> {loading ? "Assigning..." : "Assign"}
                </button>
            </div>
        </div>
    );
}
