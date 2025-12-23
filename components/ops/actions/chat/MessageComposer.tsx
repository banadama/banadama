// components/ops/actions/chat/MessageComposer.tsx
"use client";

import * as React from "react";
import { apiPost } from "@/lib/api";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";

export function MessageComposer({ threadId, onSent }: { threadId: string; onSent?: () => void }) {
    const toast = useToast();
    const [text, setText] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    async function send() {
        if (!text.trim()) {
            toast.push({ type: "warning", title: "Empty message", message: "Type a message first." });
            return;
        }
        setLoading(true);
        try {
            await apiPost(`/api/chat/threads/${threadId}/messages`, { text });
            setText("");
            toast.push({ type: "success", title: "Sent" });
            onSent?.();
        } catch {
            toast.push({ type: "error", title: "Send failed", message: "Unable to send message." });
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    }

    return (
        <div style={{ display: "flex", gap: 10 }}>
            <input
                className="bd-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message..."
                style={{ flex: 1 }}
            />
            <button className="bd-btn bd-btn-primary" onClick={send} disabled={loading}>
                <Icons.Send size={18} /> {loading ? "Sending..." : "Send"}
            </button>
        </div>
    );
}
