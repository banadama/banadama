"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons/icons";

type From = "marketplace" | "near-me" | "global";

function buildReturnUrl(from: From, sp: URLSearchParams) {
    const qs = new URLSearchParams(sp.toString());

    // Remove product-specific params if any (from our detail link construction)
    qs.delete("from");

    const q = qs.toString();
    const base =
        from === "near-me" ? "/near-me" :
            from === "global" ? "/global" :
                "/marketplace";

    return q ? `${base}?${q}` : base;
}

export function BackToResults() {
    const router = useRouter();
    const sp = useSearchParams();

    // We pass ?from=marketplace|near-me|global when linking from cards
    const from = (sp.get("from") as From) || "marketplace";
    const href = buildReturnUrl(from, new URLSearchParams(sp.toString()));

    function goBack() {
        // Best preservation: browser restores scroll + session cache
        if (typeof window !== "undefined" && window.history.length > 1) {
            window.history.back();
            return;
        }
        router.push(href);
    }

    const ChevronLeftIcon = Icons.get("ChevronLeft");
    const ListIcon = Icons.get("List");

    return (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <button className="bd-btn" onClick={goBack}>
                <ChevronLeftIcon size={18} /> Back to results
            </button>

            {/* Fallback direct link */}
            <a className="bd-btn" href={href}>
                <ListIcon size={18} /> Results
            </a>
        </div>
    );
}
