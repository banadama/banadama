"use client";

import * as React from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";
import { notifyNewMessage } from "@/lib/notify";

export function BuyerDisputeChatClient({ threadId }: { threadId: string }) {
    const toast = useToast();
    const [messages, setMessages] = React.useState<any[]>([]);
    const [unread, setUnread] = React.useState<number>(0);
    const [body, setBody] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [sending, setSending] = React.useState(false);
    const bottomRef = React.useRef<HTMLDivElement | null>(null);
    const pollRef = React.useRef<number | null>(null);
    const loadingRef = React.useRef(false);
    const prevUnreadRef = React.useRef<number>(0);
    const firstLoadRef = React.useRef<boolean>(true);

    async function load() {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);
        try {
            const res = await apiGet<any>(`/api/chat/threads/${threadId}/messages`);
            const data = res?.data ?? res;
            setMessages(data?.messages ?? []);

            // After loading messages, backend GET already marks read.
            // We can re-check unread (should become 0 unless new messages arrive later).
            const u = await apiGet<any>(`/api/chat/threads/${threadId}/unread`).catch(() => null);
            const ud = u?.data ?? u;
            const nextUnread = Number(ud?.unread ?? 0);

            setUnread(nextUnread);

            // Toast only when unread increases (and not on first load)
            if (!firstLoadRef.current && nextUnread > prevUnreadRef.current) {
                const diff = nextUnread - prevUnreadRef.current;
                notifyNewMessage();
                toast.push({
                    type: "info",
                    title: "New message",
                    message: diff === 1 ? "1 new Ops reply." : `${diff} new Ops replies.`,
                });
            }

            prevUnreadRef.current = nextUnread;
            firstLoadRef.current = false;
        } catch (e: any) {
            toast.push({ type: "error", title: "Failed to load chat", message: e?.message });
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }

    React.useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadId]);

    React.useEffect(() => {
        function start() {
            if (pollRef.current) return;
            pollRef.current = window.setInterval(() => {
                if (document.visibilityState !== "visible") return;
                load();
            }, 10_000);
        }

        function stop() {
            if (!pollRef.current) return;
            window.clearInterval(pollRef.current);
            pollRef.current = null;
        }

        start();

        const onVis = () => {
            if (document.visibilityState === "visible") load(); // instant sync on return
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
        const text = body.trim();
        if (!text) return;

        setSending(true);
        try {
            await apiPost<any>(`/api/chat/threads/${threadId}/messages`, { body: text });
            setBody("");
            await load();
        } catch (e: any) {
            toast.push({ type: "error", title: "Send failed", message: e?.message });
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ fontWeight: 950, fontSize: 18 }}>Dispute Chat (Ops)</div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    {unread > 0 ? (
                        <span className="bd-badge" style={{ fontWeight: 950, background: "var(--bd-primary)", color: "white" }}>
                            <Icons.Chat size={14} /> Unread: {unread}
                        </span>
                    ) : (
                        <span className="bd-badge">
                            <Icons.ShieldCheck size={14} /> Ops-mediated
                        </span>
                    )}

                    <button className="bd-btn" onClick={load} disabled={loading}>
                        <Icons.RefreshCw size={18} /> {loading ? "Refreshing" : "Refresh"}
                    </button>
                </div>
            </div>

            <div className="bd-card bd-card-pad" style={{ boxShadow: "none", height: 520, overflow: "auto", display: "grid", gap: 10 }}>
                {messages.length === 0 ? (
                    <div style={{ color: "var(--bd-muted)" }}>No messages yet.</div>
                ) : (
                    messages.map((m: any) => {
                        const isMe = m.senderRole === "BUYER" || m.sender_role === "BUYER";
                        return (
                            <div key={m.id} style={{ display: "grid", gap: 4, justifyItems: isMe ? "end" : "start" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, width: "100%", flexDirection: isMe ? "row-reverse" : "row" }}>
                                    <div style={{ fontWeight: 900 }}>{m.senderName ?? m.senderRole ?? m.sender_role ?? "User"}</div>
                                    <div style={{ color: "var(--bd-muted)", fontSize: 12 }}>{m.createdAt ? new Date(m.createdAt).toLocaleString() : "—"}</div>
                                </div>
                                <div className="bd-card" style={{
                                    lineHeight: 1.6,
                                    padding: "8px 12px",
                                    background: isMe ? "var(--bd-soft)" : undefined,
                                    maxWidth: "85%"
                                }}>
                                    {m.content ?? m.body}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <input
                    className="bd-input"
                    placeholder="Write a message to Ops…"
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
                Opening this chat marks it as read automatically. New Ops replies will show as unread until you refresh/open again.
            </div>
        </div>
    );
}
