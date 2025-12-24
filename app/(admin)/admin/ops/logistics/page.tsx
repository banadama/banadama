// app/(ops)/ops/logistics/page.tsx - Ops Logistics
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";

export default async function OpsLogistics() {
    const shipments = [
        { id: "SHP-001", order: "ORD-001", status: "IN_TRANSIT", origin: "Lagos", destination: "Abuja" },
        { id: "SHP-002", order: "ORD-002", status: "DELIVERED", origin: "Dhaka", destination: "Lagos" },
        { id: "SHP-003", order: "ORD-003", status: "PENDING", origin: "Lagos", destination: "Kano" },
    ];

    return (
        <div className="bd-grid" style={{ gap: 20 }}>
            <div className="bd-h2">🚚 Logistics</div>

            {/* Stats */}
            <div className="bd-grid" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16 }}>
                <Card>
                    <CardBody className="bd-grid" style={{ gap: 8 }}>
                        <div style={{ fontWeight: 900, opacity: 0.7 }}>In Transit</div>
                        <div style={{ fontSize: 28, fontWeight: 900 }}>
                            {shipments.filter((s) => s.status === "IN_TRANSIT").length}
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="bd-grid" style={{ gap: 8 }}>
                        <div style={{ fontWeight: 900, opacity: 0.7 }}>Pending Pickup</div>
                        <div style={{ fontSize: 28, fontWeight: 900 }}>
                            {shipments.filter((s) => s.status === "PENDING").length}
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="bd-grid" style={{ gap: 8 }}>
                        <div style={{ fontWeight: 900, opacity: 0.7 }}>Delivered Today</div>
                        <div style={{ fontSize: 28, fontWeight: 900 }}>
                            {shipments.filter((s) => s.status === "DELIVERED").length}
                        </div>
                    </CardBody>
                </Card>
            </div>

            <DataTable
                title="Shipments"
                columns={[
                    { key: "id", label: "Shipment" },
                    { key: "order", label: "Order" },
                    { key: "route", label: "Route" },
                    { key: "status", label: "Status" },
                    { key: "actions", label: "" },
                ]}
                rows={shipments.map((s) => ({
                    id: s.id,
                    order: s.order,
                    route: `${s.origin} → ${s.destination}`,
                    status: <StatusBadge status={s.status as "IN_TRANSIT" | "DELIVERED" | "PENDING"} />,
                    actions: (
                        <Link href={`/ops/logistics/${s.id}`}>
                            <Button variant="soft" size="sm">Manage →</Button>
                        </Link>
                    ),
                }))}
            />
        </div>
    );
}
