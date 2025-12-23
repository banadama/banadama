// components/admin/actions/users/UserRoleChanger.tsx
"use client";

import * as React from "react";
import { apiPatch } from "@/lib/api";
import { useAdminAction } from "@/components/admin/useAdminAction";
import { Icons } from "@/components/icons/icons";

export function UserRoleChanger({ userId, current }: { userId: string; current: string }) {
    const { loading, run } = useAdminAction();
    const [role, setRole] = React.useState(current);

    async function save() {
        await run(
            () => apiPatch(`/api/admin/users/${userId}/role`, { role }),
            { start: "Updating role", ok: "Role updated", fail: "Update failed" }
        );
        location.reload();
    }

    return (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <select className="bd-input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="BUYER">BUYER</option>
                <option value="OPS">OPS</option>
                <option value="FACTORY">FACTORY</option>
                <option value="WHOLESALER">WHOLESALER</option>
                <option value="RETAIL">RETAIL</option>
                <option value="CREATOR">CREATOR</option>
                <option value="AFFILIATE">AFFILIATE</option>
                <option value="ADMIN">ADMIN</option>
                <option value="FINANCE_ADMIN">FINANCE_ADMIN</option>
            </select>

            <button className="bd-btn bd-btn-primary" onClick={save} disabled={loading}>
                <Icons.Check size={18} /> {loading ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
