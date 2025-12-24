// app/(ops)/ops/error.tsx - Ops Error Boundary
"use client";

import * as React from "react";
import { Icons } from "@/components/icons/icons";

export default function OpsError({ reset }: { reset: () => void }) {
    return (
        <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Icons.Warning size={18} style={{ color: "var(--bd-danger)" }} />
                <div style={{ fontWeight: 950 }}>Ops page error</div>
            </div>
            <div style={{ color: "var(--bd-muted)" }}>Try again. If it repeats, escalate to Admin.</div>
            <button className="bd-btn bd-btn-primary" onClick={() => reset()} style={{ justifyContent: "center" }}>
                <Icons.ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />
                Retry
            </button>
        </div>
    );
}
