// app/error.tsx - Global Error Boundary
"use client";

import * as React from "react";
import { Icons } from "@/components/icons/icons";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const WarningIcon = Icons.get("Warning");
    const ChevronRightIcon = Icons.get("ChevronRight");
    const ProductIcon = Icons.get("Product");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10, maxWidth: 600, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <WarningIcon size={24} style={{ color: "var(--bd-danger)" }} />
                    <div style={{ fontWeight: 950, fontSize: 18 }}>Something went wrong</div>
                </div>
                <div style={{ color: "var(--bd-muted)", lineHeight: 1.6 }}>
                    The page failed to load. You can retry safely.
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="bd-btn bd-btn-primary" onClick={() => reset()}>
                        <ChevronRightIcon size={16} style={{ transform: "rotate(180deg)" }} />
                        Retry
                    </button>
                    <a className="bd-btn" href="/marketplace">
                        <ProductIcon size={18} />
                        Go to Marketplace
                    </a>
                </div>

                {/* Keep technical detail minimal (no leaking) */}
                {process.env.NODE_ENV === "development" ? (
                    <pre className="bd-card bd-card-pad" style={{ color: "var(--bd-muted)", overflow: "auto", fontSize: 12 }}>
                        {String(error?.message ?? error)}
                    </pre>
                ) : null}
            </div>
        </div>
    );
}
