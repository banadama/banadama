// components/ops/useOpsAction.ts - Universal Ops Action Hook
"use client";

import * as React from "react";
import { useToast } from "@/components/ui/toast/ToastProvider";

export function useOpsAction() {
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);

    async function run<T>(fn: () => Promise<T>, msgs?: { start?: string; ok?: string; fail?: string }) {
        if (loading) return null;
        setLoading(true);
        try {
            if (msgs?.start) toast.push({ type: "info", title: msgs.start });
            const res = await fn();
            toast.push({ type: "success", title: msgs?.ok ?? "Done" });
            return res;
        } catch {
            toast.push({ type: "error", title: msgs?.fail ?? "Action failed", message: "Please try again." });
            return null;
        } finally {
            setLoading(false);
        }
    }

    return { loading, run };
}
