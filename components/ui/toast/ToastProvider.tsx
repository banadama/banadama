// components/ui/toast/ToastProvider.tsx - Toast Notification System
"use client";

import * as React from "react";
import { Icons } from "@/components/icons/icons";

type ToastType = "success" | "error" | "info" | "warning";

export type Toast = {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    ttl?: number; // ms
};

type ToastCtx = {
    push: (t: Omit<Toast, "id">) => void;
    clear: (id: string) => void;
};

const Ctx = React.createContext<ToastCtx | null>(null);

function iconFor(type: ToastType) {
    switch (type) {
        case "success":
            return <Icons.Check size={18} />;
        case "error":
            return <Icons.X size={18} />;
        case "warning":
            return <Icons.Warning size={18} />;
        default:
            return <Icons.Message size={18} />;
    }
}

function tone(type: ToastType) {
    switch (type) {
        case "success":
            return "var(--bd-success)";
        case "error":
            return "var(--bd-danger)";
        case "warning":
            return "var(--bd-warning)";
        default:
            return "var(--bd-border)";
    }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const clear = React.useCallback((id: string) => {
        setToasts((t) => t.filter((x) => x.id !== id));
    }, []);

    const push = React.useCallback((t: Omit<Toast, "id">) => {
        const id = crypto.randomUUID();
        const ttl = t.ttl ?? 3500;

        const toast: Toast = { id, ...t, ttl };
        setToasts((prev) => [toast, ...prev].slice(0, 4));

        window.setTimeout(() => clear(id), ttl);
    }, [clear]);

    return (
        <Ctx.Provider value={{ push, clear }}>
            {children}

            {/* Toast stack */}
            <div
                style={{
                    position: "fixed",
                    right: 14,
                    bottom: 14,
                    display: "grid",
                    gap: 10,
                    zIndex: 60,
                    width: "min(420px, calc(100vw - 28px))",
                }}
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className="bd-card bd-card-pad"
                        style={{
                            boxShadow: "var(--bd-shadow)",
                            borderLeft: `3px solid ${tone(t.type)}`,
                            display: "grid",
                            gap: 6,
                            animation: "slideIn 0.2s ease-out",
                        }}
                        role="status"
                        aria-live="polite"
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 950 }}>
                                <span style={{ display: "grid", placeItems: "center", color: tone(t.type) }}>{iconFor(t.type)}</span>
                                <span>{t.title}</span>
                            </div>
                            <button className="bd-btn" onClick={() => clear(t.id)} style={{ height: 34, padding: "0 8px" }}>
                                <Icons.X size={16} />
                            </button>
                        </div>

                        {t.message ? <div style={{ color: "var(--bd-muted)", lineHeight: 1.5, fontSize: 14 }}>{t.message}</div> : null}
                    </div>
                ))}
            </div>
        </Ctx.Provider>
    );
}

export function useToast() {
    const ctx = React.useContext(Ctx);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
