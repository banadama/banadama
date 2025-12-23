// app/(retail)/retail/messages/page.tsx - Retail Messages
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { MessageComposer } from "@/components/ops/actions";

export default async function RetailMessagesPage() {
    await requireRole("RETAIL");

    let threads: any[] = [];
    try {
        const res = await apiGet("/api/chat/threads?supplier=1");
        threads = res?.threads ?? [];
    } catch { }

    const first = threads[0];

    return (
        <div className="bd-card bd-card-pad">
            <div style={{ fontWeight: 950, fontSize: 18, marginBottom: 12 }}>Messages</div>

            {!first ? (
                <div style={{ color: "var(--bd-muted)" }}>No threads yet.</div>
            ) : (
                <div style={{ display: "grid", gap: 10 }}>
                    <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                        <div style={{ fontWeight: 900 }}>{first.title ?? "Thread"}</div>
                        <div style={{ color: "var(--bd-muted)", marginTop: 6 }}>Ops mediated communication.</div>
                    </div>
                    <MessageComposer threadId={first.id} />
                </div>
            )}
        </div>
    );
}
