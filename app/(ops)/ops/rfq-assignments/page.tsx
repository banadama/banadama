// app/(ops)/ops/rfq-assignments/page.tsx - Ops RFQ Assignment Queue
"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type RFQ = {
    id: string;
    buyer: string;
    product: string;
    quantity: number;
    country: string;
    status: "PENDING" | "ASSIGNED" | "QUOTED" | "CONFIRMED";
    assignedSupplier?: string;
    createdAt: string;
};

type Supplier = {
    id: string;
    name: string;
    type: string;
    country: string;
    verification: string;
    rating: number;
};

export default function OpsRfqAssignmentsPage() {
    const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);
    const [showAssignDialog, setShowAssignDialog] = useState(false);

    const [rfqs] = useState<RFQ[]>([
        { id: "RFQ-001", buyer: "Buyer Alpha", product: "Packaging Nylon Bags", quantity: 5000, country: "NG", status: "PENDING", createdAt: "2 hours ago" },
        { id: "RFQ-002", buyer: "Buyer Beta", product: "Cotton T-Shirts Bulk", quantity: 1000, country: "BD", status: "PENDING", createdAt: "4 hours ago" },
        { id: "RFQ-003", buyer: "Buyer Gamma", product: "Carton Boxes", quantity: 500, country: "NG", status: "ASSIGNED", assignedSupplier: "Lagos Pack Ltd", createdAt: "1 day ago" },
        { id: "RFQ-004", buyer: "Buyer Delta", product: "Denim Fabric", quantity: 200, country: "BD", status: "QUOTED", assignedSupplier: "Dhaka Textiles", createdAt: "2 days ago" },
    ]);

    const [suppliers] = useState<Supplier[]>([
        { id: "s1", name: "Lagos Packaging Co.", type: "WHOLESALER", country: "NG", verification: "GREEN_TICK", rating: 4.8 },
        { id: "s2", name: "Kano Supplies", type: "WHOLESALER", country: "NG", verification: "BLUE_TICK", rating: 4.5 },
        { id: "s3", name: "Dhaka Textile Factory", type: "FACTORY", country: "BD", verification: "GREEN_TICK", rating: 4.9 },
        { id: "s4", name: "BD Fashion Mills", type: "FACTORY", country: "BD", verification: "BLUE_TICK", rating: 4.6 },
    ]);

    const pendingRfqs = rfqs.filter((r) => r.status === "PENDING");
    const assignedRfqs = rfqs.filter((r) => r.status === "ASSIGNED");
    const quotedRfqs = rfqs.filter((r) => r.status === "QUOTED");

    const handleAssignClick = (rfq: RFQ) => {
        setSelectedRfq(rfq);
        setShowAssignDialog(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="warning">Pending</Badge>;
            case "ASSIGNED":
                return <Badge variant="default">Assigned</Badge>;
            case "QUOTED":
                return <Badge variant="success">Quoted</Badge>;
            case "CONFIRMED":
                return <Badge variant="success">Confirmed</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const filteredSuppliers = selectedRfq
        ? suppliers.filter((s) => s.country === selectedRfq.country)
        : [];

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div>
                <div className="bd-h2">📋 RFQ Assignments</div>
                <p className="bd-p" style={{ opacity: 0.7 }}>
                    Assign suppliers to buyer RFQs and create quotes
                </p>
            </div>

            {/* Stats */}
            <div className="bd-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <Card>
                    <CardBody>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Pending</div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-warning))" }}>
                            {pendingRfqs.length}
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Assigned</div>
                        <div style={{ fontSize: 28, fontWeight: 900 }}>{assignedRfqs.length}</div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Quoted</div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-success))" }}>
                            {quotedRfqs.length}
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Today</div>
                        <div style={{ fontSize: 28, fontWeight: 900 }}>{rfqs.length}</div>
                    </CardBody>
                </Card>
            </div>

            {/* Pending Queue */}
            <Card>
                <CardHeader>
                    <div className="bd-row" style={{ justifyContent: "space-between" }}>
                        <div className="bd-h3">⏳ Pending Queue</div>
                        <Badge variant="warning">{pendingRfqs.length} waiting</Badge>
                    </div>
                </CardHeader>
                <CardBody>
                    <DataTable
                        columns={[
                            { key: "id", label: "RFQ" },
                            { key: "buyer", label: "Buyer" },
                            { key: "product", label: "Product" },
                            { key: "qty", label: "Qty" },
                            { key: "country", label: "Country" },
                            { key: "time", label: "Time" },
                            { key: "actions", label: "" },
                        ]}
                        rows={pendingRfqs.map((rfq) => ({
                            id: <span style={{ fontWeight: 700 }}>{rfq.id}</span>,
                            buyer: rfq.buyer,
                            product: rfq.product,
                            qty: rfq.quantity.toLocaleString(),
                            country: rfq.country === "NG" ? "🇳🇬" : "🇧🇩",
                            time: rfq.createdAt,
                            actions: (
                                <Button variant="primary" size="sm" onClick={() => handleAssignClick(rfq)}>
                                    Assign Supplier
                                </Button>
                            ),
                        }))}
                        emptyMessage="No pending RFQs"
                    />
                </CardBody>
            </Card>

            {/* Assigned/Quoted */}
            <Card>
                <CardHeader>
                    <div className="bd-h3">📄 In Progress</div>
                </CardHeader>
                <CardBody>
                    <DataTable
                        columns={[
                            { key: "id", label: "RFQ" },
                            { key: "buyer", label: "Buyer" },
                            { key: "product", label: "Product" },
                            { key: "supplier", label: "Assigned Supplier" },
                            { key: "status", label: "Status" },
                            { key: "actions", label: "" },
                        ]}
                        rows={[...assignedRfqs, ...quotedRfqs].map((rfq) => ({
                            id: <span style={{ fontWeight: 700 }}>{rfq.id}</span>,
                            buyer: rfq.buyer,
                            product: rfq.product,
                            supplier: rfq.assignedSupplier || "-",
                            status: getStatusBadge(rfq.status),
                            actions: (
                                <Button variant="soft" size="sm">
                                    {rfq.status === "ASSIGNED" ? "Create Quote" : "View Quote"}
                                </Button>
                            ),
                        }))}
                        emptyMessage="No RFQs in progress"
                    />
                </CardBody>
            </Card>

            {/* Assign Dialog */}
            {selectedRfq && (
                <ConfirmDialog
                    open={showAssignDialog}
                    title={`Assign Supplier for ${selectedRfq.id}`}
                    message={
                        <div className="bd-grid" style={{ gap: 16 }}>
                            <div className="bd-card bd-card-pad" style={{ background: "hsl(var(--bd-muted))" }}>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Product</div>
                                <div style={{ fontWeight: 700 }}>{selectedRfq.product}</div>
                                <div className="bd-small">Qty: {selectedRfq.quantity.toLocaleString()}</div>
                            </div>

                            <div>
                                <label className="bd-label">Select Supplier ({selectedRfq.country})</label>
                                <div className="bd-grid" style={{ gap: 8 }}>
                                    {filteredSuppliers.map((sup) => (
                                        <div
                                            key={sup.id}
                                            className="bd-card bd-card-pad bd-row"
                                            style={{ justifyContent: "space-between", cursor: "pointer" }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 700 }}>
                                                    {sup.name}
                                                    {sup.verification === "GREEN_TICK" && " 🟢"}
                                                    {sup.verification === "BLUE_TICK" && " 🔵"}
                                                </div>
                                                <div className="bd-small" style={{ opacity: 0.7 }}>
                                                    {sup.type} • Rating: {sup.rating}
                                                </div>
                                            </div>
                                            <input type="radio" name="supplier" value={sup.id} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                    confirmLabel="Assign"
                    onConfirm={() => setShowAssignDialog(false)}
                    onCancel={() => setShowAssignDialog(false)}
                />
            )}
        </div>
    );
}
