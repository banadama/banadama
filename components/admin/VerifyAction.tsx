// components/admin/VerifyAction.tsx - Verification Approve/Reject Component
"use client";

import * as React from "react";
import { apiPatch } from "@/lib/api";
import { useOpsAction } from "@/components/ops/useOpsAction";
import { Icons } from "@/components/icons/icons";

export function VerifyAction({ requestId }: { requestId: string }) {
    const { loading, run } = useOpsAction();

    async function approve() {
        await run(
            () => apiPatch(`/api/admin/verifications/${requestId}`, { decision: "APPROVE" }),
            { start: "Approving", ok: "Approved", fail: "Approve failed" }
        );
        location.reload();
    }

    async function reject() {
        await run(
            () => apiPatch(`/api/admin/verifications/${requestId}`, { decision: "REJECT" }),
            { start: "Rejecting", ok: "Rejected", fail: "Reject failed" }
        );
        location.reload();
    }

    return (
        <div style={{ display: "flex", gap: 10 }}>
            <button className="bd-btn bd-btn-primary" onClick={approve} disabled={loading}>
                <Icons.Check size={18} /> Approve
            </button>
            <button className="bd-btn" onClick={reject} disabled={loading}>
                <Icons.X size={18} /> Reject
            </button>
        </div>
    );
}
