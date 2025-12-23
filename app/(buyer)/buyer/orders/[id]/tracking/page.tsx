// app/(buyer)/buyer/orders/[id]/tracking/page.tsx - Order Tracking
import { StepTimeline } from "../../../../../../components/timeline/StepTimeline";
import { Card, CardBody } from "../../../../../../components/ui/Card";
import { Badge } from "../../../../../../components/ui/Badge";

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const steps = [
        { label: "Order Confirmed", description: "Dec 15, 2024 - 10:30 AM" },
        { label: "Escrow Locked", description: "Payment secured" },
        { label: "In Transit", description: "Shipped via logistics partner" },
        { label: "Delivered", description: "Pending confirmation" },
        { label: "Payout Released", description: "" },
    ];
    const current = 2; // TODO: derive from backend status

    return (
        <div className="bd-grid" style={{ gap: 20 }}>
            <div className="bd-row" style={{ alignItems: "center", gap: 12 }}>
                <div className="bd-h2">Tracking</div>
                <Badge variant="warning">IN TRANSIT</Badge>
            </div>

            <Card>
                <CardBody className="bd-grid" style={{ gap: 12 }}>
                    <div className="bd-row" style={{ justifyContent: "space-between" }}>
                        <div>
                            <div className="bd-small">Order ID</div>
                            <div style={{ fontWeight: 800 }}>{id}</div>
                        </div>
                        <div>
                            <div className="bd-small">Estimated Delivery</div>
                            <div style={{ fontWeight: 800 }}>Dec 20, 2024</div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <StepTimeline steps={steps} current={current} />
        </div>
    );
}
