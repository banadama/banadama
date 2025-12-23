"use client";

import * as React from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";
import { notifyNewMessage } from "@/lib/notify";

export function OpsChatClient({
    initialThreadId,
    initialMessages,
}: {
    initialThreadId: string | null;
    initialMessages: any[];
}) {
    const toast = useToast();
    const [threadId, setThreadId] = React.useState<string | null>(initialThreadId);
    const [messages, setMessages] = React.useState<any[]>(initialMessages ?? []);
    const [body, setBody] = React.useState("");
    const [sending, setSending] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const pollRef = React.useRef<number | null>(null);
    const loadingRef = React.useRef(false);
    const bottomRef = React.useRef<HTMLDivElement | null>(null);
    const prevUnreadRef = React.useRef<number>(0);
    const firstLoadRef = React.useRef<boolean>(true);

    async function load(id: string) {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);
        try {
            const res = await apiGet<any>(`/api/chat/threads/${id}/messages`);
            const data = res?.data ?? res;
            setMessages(data?.messages ?? []);
            // NOTE: backend GET marks read already (chat_thread_reads)

            // Notifications logic via unread endpoint
            const u = await apiGet<any>(`/api/chat/threads/${id}/unread`).catch(() => null);
            const ud = u?.data ?? u;
            const nextUnread = Number(ud?.unread ?? 0);

            if (!firstLoadRef.current && nextUnread > prevUnreadRef.current) {
                const diff = nextUnread - prevUnreadRef.current;
                notifyNewMessage();
                toast.push({
                    type: "info",
                    title: "New message",
                    message: diff === 1 ? "1 new buyer message." : `${diff} new buyer messages.`,
                });
            }

            prevUnreadRef.current = nextUnread;
            firstLoadRef.current = false;
        } catch (e: any) {
            toast.push({ type: "error", title: "Failed to load messages", message: e?.message });
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }

    React.useEffect(() => {
        if (!initialThreadId) return;
        setThreadId(initialThreadId);
        setMessages(initialMessages ?? []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialThreadId]);

    React.useEffect(() => {
        if (!threadId) return;

        function start() {
            if (pollRef.current) return;
            pollRef.current = window.setInterval(() => {
                if (document.visibilityState !== "visible") return;
                load(threadId);
            }, 10_000);
        }

        function stop() {
            if (!pollRef.current) return;
            window.clearInterval(pollRef.current);
            pollRef.current = null;
        }

        start();

        const onVis = () => {
            if (document.visibilityState === "visible") load(threadId);
        };

        document.addEventListener("visibilitychange", onVis);

        return () => {
            stop();
            document.removeEventListener("visibilitychange", onVis);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadId]);

    // Auto-scroll to latest whenever messages change
    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    async function send() {
        if (!threadId) return;
        const text = body.trim();
        if (!text) return;

        setSending(true);
        try {
            await apiPost<any>(`/api/chat/threads/${threadId}/messages`, { body: text });
            setBody("");
            await load(threadId); // refresh (and will mark read)
        } catch (e: any) {
            toast.push({ type: "error", title: "Send failed", message: e?.message });
        } finally {
            setSending(false);
        }
    }

    if (!threadId) {
        return <div className="bd-card bd-card-pad">Select a thread.</div>;
    }

    return (
        <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Thread</div>
                <button className="bd-btn" onClick={() => load(threadId)} disabled={loading}>
                    <Icons.RefreshCw size={18} /> {loading ? "Refreshing" : "Refresh"}
                </button>
            </div>

            <div
                className="bd-card bd-card-pad"
                style={{ boxShadow: "none", height: 520, overflow: "auto", display: "grid", gap: 10 }}
            >
                {messages.length === 0 ? (
                    <div style={{ color: "var(--bd-muted)" }}>No messages yet.</div>
                ) : (
                    messages.map((m: any) => (
                        <div key={m.id} style={{ display: "grid", gap: 4 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                                <div style={{ fontWeight: 900 }}>{m.senderName ?? m.senderRole ?? "User"}</div>
                                <div style={{ color: "var(--bd-muted)", fontSize: 12 }}>{m.createdAt ? new Date(m.createdAt).toLocaleString() : "—"}</div>
                            </div>
                            <div style={{ lineHeight: 1.6 }}>{m.content ?? m.body}</div>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <input
                    className="bd-input"
                    placeholder="Write a reply…"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            send();
                        }
                    }}
                />
                <button className="bd-btn bd-btn-primary" onClick={send} disabled={sending} style={{ justifyContent: "center" }}>
                    <Icons.Send size={18} /> {sending ? "Sending" : "Send"}
                </button>
            </div>

            <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>
                Opening this thread marks it as read automatically.
            </div>
        </div>
    );
}
