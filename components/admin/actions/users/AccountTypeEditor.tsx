// components/admin/actions/users/AccountTypeEditor.tsx
"use client";

import * as React from "react";
import { apiPatch } from "@/lib/api";
import { useAdminAction } from "@/components/admin/useAdminAction";
import { Icons } from "@/components/icons/icons";

export function AccountTypeEditor({ accountId, current }: { accountId: string; current: string }) {
    const { loading, run } = useAdminAction();
    const [type, setType] = React.useState(current);

    async function save() {
        await run(
            () => apiPatch(`/api/admin/accounts/${accountId}/type`, { type }),
            { start: "Updating account type", ok: "Account updated", fail: "Update failed" }
        );
        location.reload();
    }

    return (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <select className="bd-input" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="BUYER">BUYER</option>
                <option value="FACTORY">FACTORY</option>
                <option value="WHOLESALER">WHOLESALER</option>
                <option value="RETAIL">RETAIL</option>
                <option value="CREATOR">CREATOR</option>
            </select>

            <button className="bd-btn bd-btn-primary" onClick={save} disabled={loading}>
                <Icons.Check size={18} /> {loading ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
