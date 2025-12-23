import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { OpsChatClient } from "@/components/chat/OpsChatClient";

export default async function OpsMessagesPage({ searchParams }: { searchParams: any }) {
    await requireRole("OPS");

    const threadId = typeof searchParams?.threadId === "string" ? searchParams.threadId : null;

    // Load thread list – using a consistent endpoint or dispute threads.
    // For general Ops messages, we might use /api/chat/threads?scope=OPS
    const threadsRes = await apiGet<any>("/api/chat/threads?scope=OPS").catch(() => null);
    const threads = (threadsRes?.data?.threads ?? threadsRes?.threads ?? []) as any[];

    // If threadId is present, fetch messages (this also marks read via backend GET)
    const initialThread = threadId
        ? threads.find((t: any) => (t.id === threadId || t.threadId === threadId)) ?? { id: threadId }
        : (threads[0] ?? null);

    const initialThreadId = initialThread?.id ?? initialThread?.threadId ?? null;

    const messagesRes = initialThreadId
        ? await apiGet<any>(`/api/chat/threads/${initialThreadId}/messages`).catch(() => null)
        : null;

    const initialMessages = (messagesRes?.data?.messages ?? messagesRes?.messages ?? []) as any[];

    return (
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 12, alignItems: "start" }}>
            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Threads</div>
                {threads.length === 0 ? (
                    <div style={{ color: "var(--bd-muted)" }}>No threads.</div>
                ) : (
                    threads.map((t: any) => {
                        const id = t.id ?? t.threadId;
                        const active = id === initialThreadId;
                        const label = t.title || t.participantName || t.participantEmail || String(id).slice(0, 10);
                        return (
                            <a
                                key={id}
                                href={`/ops/messages?threadId=${encodeURIComponent(id)}`}
                                className="bd-btn"
                                style={{
                                    justifyContent: "flex-start",
                                    background: active ? "var(--bd-soft)" : undefined,
                                    textDecoration: "none",
                                    color: "inherit"
                                }}
                            >
                                <div style={{ display: "grid", gap: 2 }}>
                                    <div style={{ fontWeight: 700 }}>{label}</div>
                                    {t.lastMessage && (
                                        <div style={{ fontSize: 11, color: "var(--bd-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 300 }}>
                                            {t.lastMessage}
                                        </div>
                                    )}
                                </div>
                            </a>
                        );
                    })
                )}
            </div>

            <OpsChatClient
                initialThreadId={initialThreadId}
                initialMessages={initialMessages}
            />
        </div>
    );
}
