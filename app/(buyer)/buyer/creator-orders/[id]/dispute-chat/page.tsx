import { requireRole } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { BuyerDisputeChatClient } from "@/components/chat/BuyerDisputeChatClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dispute Chat",
};

export default async function BuyerDisputeChat({ params }: { params: { id: string } }) {
    await requireRole("BUYER");

    // Get or Create thread
    const res = await apiPost<any>(`/api/creator/orders/${params.id}/dispute/thread`, {});
    const data = res?.data ?? res;
    const threadId = data?.threadId;

    if (!threadId) {
        return (
            <div className="bd-card bd-card-pad">
                <div style={{ color: "var(--bd-error)", fontWeight: 700 }}>Unable to initialize chat</div>
                <p>Please ensure you have an active dispute for this order.</p>
                <a href={`/buyer/creator-orders/${params.id}`} className="bd-btn" style={{ marginTop: 10 }}>Back to Order</a>
            </div>
        );
    }

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <a href={`/buyer/creator-orders/${params.id}`} className="bd-btn" style={{ padding: "4px 8px" }}>← Back</a>
                <h2 style={{ margin: 0 }}>Dispute Chat</h2>
            </div>
            <BuyerDisputeChatClient threadId={threadId} />
        </div>
    );
}
