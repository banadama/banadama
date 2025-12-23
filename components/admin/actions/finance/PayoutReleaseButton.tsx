// components/admin/actions/finance/PayoutReleaseButton.tsx
"use client";

import * as React from "react";
import { apiPost } from "@/lib/api";
import { useAdminAction } from "@/components/admin/useAdminAction";
import { Icons } from "@/components/icons/icons";

export function PayoutReleaseButton({ escrowId }: { escrowId: string }) {
    const { loading, run } = useAdminAction();

    async function release() {
        await run(
            () => apiPost(`/api/admin/finance/escrow/${escrowId}/release`, {}),
            { start: "Releasing payout", ok: "Payout released", fail: "Release failed" }
        );
        location.reload();
    }

    return (
        <button className="bd-btn bd-btn-primary" onClick={release} disabled={loading}>
            <Icons.Bank size={18} /> {loading ? "Releasing..." : "Release Payout"}
        </button>
    );
}
