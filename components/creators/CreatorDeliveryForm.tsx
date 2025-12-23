"use client";

import * as React from "react";
import { apiPost } from "@/lib/api";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";

export function CreatorDeliveryForm({ orderId }: { orderId: string }) {
    const toast = useToast();
    const [message, setMessage] = React.useState("");
    const [files, setFiles] = React.useState<string>(""); // comma-separated URLs
    const [loading, setLoading] = React.useState(false);

    async function submit() {
        if (!message && !files) {
            toast.push({ type: "error", title: "Missing content", message: "Please provide a message or files." });
            return;
        }
        setLoading(true);
        try {
            const payload = {
                message: message || null,
                files: files
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
            };
            await apiPost(`/api/creator/orders/${orderId}/deliver`, payload);
            toast.push({ type: "success", title: "Delivered" });
            window.location.reload();
        } catch (e: any) {
            toast.push({ type: "error", title: "Delivery failed", message: e?.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 950 }}>Submit delivery</div>

            <textarea className="bd-input" placeholder="Message to buyer / Ops" value={message} onChange={(e) => setMessage(e.target.value)} style={{ minHeight: 90 }} />

            <input
                className="bd-input"
                placeholder="Files (URLs) — comma separated"
                value={files}
                onChange={(e) => setFiles(e.target.value)}
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="bd-btn bd-btn-primary" onClick={submit} disabled={loading} style={{ justifyContent: "center" }}>
                    <Icons.Upload size={18} /> {loading ? "Submitting" : "Submit delivery"}
                </button>
            </div>
        </div>
    );
}
