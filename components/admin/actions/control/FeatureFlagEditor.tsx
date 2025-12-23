// components/admin/actions/control/FeatureFlagEditor.tsx
"use client";

import * as React from "react";
import { apiPatch } from "@/lib/api";
import { useAdminAction } from "@/components/admin/useAdminAction";
import { Icons } from "@/components/icons/icons";

export function FeatureFlagEditor({
    flags,
}: {
    flags: Record<string, boolean>;
}) {
    const { loading, run } = useAdminAction();
    const [state, setState] = React.useState(flags);

    async function save() {
        await run(
            () => apiPatch(`/api/admin/feature-flags`, { flags: state }),
            { start: "Updating flags", ok: "Flags updated", fail: "Update failed" }
        );
    }

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
            <div style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Feature Flags</div>

                {Object.entries(state).map(([k, v]) => (
                    <label key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                        <span style={{ color: "var(--bd-muted)" }}>{k}</span>
                        <input type="checkbox" checked={v} onChange={(e) => setState({ ...state, [k]: e.target.checked })} />
                    </label>
                ))}

                <button className="bd-btn bd-btn-primary" onClick={save} disabled={loading} style={{ justifyContent: "center" }}>
                    <Icons.Settings size={18} /> {loading ? "Saving..." : "Save Flags"}
                </button>
            </div>
        </div>
    );
}
