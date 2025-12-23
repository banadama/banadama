// components/admin/actions/control/TradeControlEditor.tsx
"use client";

import * as React from "react";
import { apiPatch } from "@/lib/api";
import { useAdminAction } from "@/components/admin/useAdminAction";
import { Icons } from "@/components/icons/icons";

export function TradeControlEditor({ config }: { config: any }) {
    const { loading, run } = useAdminAction();
    const [state, setState] = React.useState<any>(config ?? {});
    const [error, setError] = React.useState(false);

    async function save() {
        await run(
            () => apiPatch(`/api/admin/trade-control`, state),
            { start: "Updating trade control", ok: "Trade control saved", fail: "Update failed" }
        );
    }

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        try {
            setState(JSON.parse(e.target.value));
            setError(false);
        } catch {
            setError(true);
        }
    }

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
            <div style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Trade Control</div>
                <textarea
                    className="bd-input"
                    style={{ minHeight: 140, paddingTop: 10, borderColor: error ? "var(--bd-danger)" : undefined }}
                    value={JSON.stringify(state, null, 2)}
                    onChange={handleChange}
                />
                {error && <div className="bd-small" style={{ color: "var(--bd-danger)" }}>Invalid JSON</div>}
                <button className="bd-btn bd-btn-primary" onClick={save} disabled={loading || error} style={{ justifyContent: "center" }}>
                    <Icons.Globe size={18} /> {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}
