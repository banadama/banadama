// components/admin/actions/verifications/VerificationTickSetter.tsx
"use client";

import * as React from "react";
import { apiPatch } from "@/lib/api";
import { useAdminAction } from "@/components/admin/useAdminAction";
import { Icons } from "@/components/icons/icons";

type Tick = "NONE" | "BLUE_TICK" | "GREEN_TICK";

export function VerificationTickSetter({
    accountId,
    current,
}: {
    accountId: string;
    current: Tick;
}) {
    const { loading, run } = useAdminAction();
    const [tick, setTick] = React.useState<Tick>(current);

    async function save() {
        await run(
            () => apiPatch(`/api/admin/accounts/${accountId}/verification`, { tick }),
            { start: "Updating verification", ok: "Verification updated", fail: "Update failed" }
        );
        location.reload();
    }

    return (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <select className="bd-input" value={tick} onChange={(e) => setTick(e.target.value as Tick)}>
                <option value="NONE">None</option>
                <option value="BLUE_TICK">Blue Tick</option>
                <option value="GREEN_TICK">Green Tick</option>
            </select>
            <button className="bd-btn bd-btn-primary" onClick={save} disabled={loading}>
                <Icons.Check size={18} /> {loading ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
