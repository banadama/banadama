// app/(ops)/ops/supplier-performance/page.tsx - Ops Supplier Performance
"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";

type SupplierPerformance = {
    id: string;
    name: string;
    type: string;
    country: string;
    verification: string;
    ordersCompleted: number;
    ordersTotal: number;
    onTimeRate: number;
    rating: number;
    flagged: boolean;
    flagReason?: string;
};

export default function OpsSupplierPerformancePage() {
    const [suppliers] = useState<SupplierPerformance[]>([
        { id: "s1", name: "Lagos Packaging Co.", type: "WHOLESALER", country: "NG", verification: "GREEN_TICK", ordersCompleted: 45, ordersTotal: 48, onTimeRate: 94, rating: 4.8, flagged: false },
        { id: "s2", name: "Kano Supplies", type: "WHOLESALER", country: "NG", verification: "BLUE_TICK", ordersCompleted: 23, ordersTotal: 25, onTimeRate: 92, rating: 4.5, flagged: false },
        { id: "s3", name: "Dhaka Textile Factory", type: "FACTORY", country: "BD", verification: "GREEN_TICK", ordersCompleted: 120, ordersTotal: 125, onTimeRate: 96, rating: 4.9, flagged: false },
        { id: "s4", name: "BD Fashion Mills", type: "FACTORY", country: "BD", verification: "BLUE_TICK", ordersCompleted: 30, ordersTotal: 35, onTimeRate: 86, rating: 4.2, flagged: true, flagReason: "Delivery delays" },
        { id: "s5", name: "Lagos Retail Hub", type: "RETAIL", country: "NG", verification: "NONE", ordersCompleted: 8, ordersTotal: 12, onTimeRate: 67, rating: 3.5, flagged: true, flagReason: "Quality issues" },
    ]);

    const getVerificationBadge = (level: string) => {
        if (level === "GREEN_TICK") return <Badge variant="success">🟢</Badge>;
        if (level === "BLUE_TICK") return <Badge>🔵</Badge>;
        return <Badge variant="warning">—</Badge>;
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return "hsl(var(--bd-success))";
        if (rating >= 4.0) return "hsl(var(--bd-warning))";
        return "hsl(var(--bd-danger))";
    };

    const flaggedSuppliers = suppliers.filter((s) => s.flagged);
    const topSuppliers = suppliers.filter((s) => s.rating >= 4.5 && !s.flagged);

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div>
                <div className="bd-h2">📊 Supplier Performance</div>
                <p className="bd-p" style={{ opacity: 0.7 }}>
                    Monitor supplier metrics and flag issues for review
                </p>
            </div>

            {/* Stats */}
            <div className="bd-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <Card>
                    <CardBody>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Total Suppliers</div>
                        <div style={{ fontSize: 28, fontWeight: 900 }}>{suppliers.length}</div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Top Performers</div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-success))" }}>
                            {topSuppliers.length}
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Flagged</div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-danger))" }}>
                            {flaggedSuppliers.length}
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-small" style={{ opacity: 0.7 }}>Avg On-Time Rate</div>
                        <div style={{ fontSize: 28, fontWeight: 900 }}>
                            {Math.round(suppliers.reduce((a, s) => a + s.onTimeRate, 0) / suppliers.length)}%
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Flagged Suppliers */}
            {flaggedSuppliers.length > 0 && (
                <Card style={{ border: "1px solid hsl(var(--bd-danger))" }}>
                    <CardHeader>
                        <div className="bd-row" style={{ gap: 8 }}>
                            <span style={{ color: "hsl(var(--bd-danger))" }}>⚠️</span>
                            <div className="bd-h3">Flagged Suppliers</div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <DataTable
                            columns={[
                                { key: "supplier", label: "Supplier" },
                                { key: "reason", label: "Flag Reason" },
                                { key: "rating", label: "Rating" },
                                { key: "onTime", label: "On-Time" },
                                { key: "actions", label: "" },
                            ]}
                            rows={flaggedSuppliers.map((sup) => ({
                                supplier: (
                                    <div className="bd-row" style={{ gap: 8 }}>
                                        <span>{sup.country === "NG" ? "🇳🇬" : "🇧🇩"}</span>
                                        <span style={{ fontWeight: 700 }}>{sup.name}</span>
                                    </div>
                                ),
                                reason: <Badge variant="danger">{sup.flagReason}</Badge>,
                                rating: (
                                    <span style={{ fontWeight: 700, color: getRatingColor(sup.rating) }}>
                                        {sup.rating}
                                    </span>
                                ),
                                onTime: `${sup.onTimeRate}%`,
                                actions: (
                                    <div className="bd-row" style={{ gap: 4 }}>
                                        <Button variant="soft" size="sm">Review</Button>
                                        <Button variant="danger" size="sm">Recommend Suspend</Button>
                                    </div>
                                ),
                            }))}
                        />
                    </CardBody>
                </Card>
            )}

            {/* All Suppliers */}
            <Card>
                <CardHeader>
                    <div className="bd-h3">All Suppliers</div>
                </CardHeader>
                <CardBody>
                    <DataTable
                        columns={[
                            { key: "supplier", label: "Supplier" },
                            { key: "type", label: "Type" },
                            { key: "verification", label: "Tick" },
                            { key: "orders", label: "Orders" },
                            { key: "onTime", label: "On-Time" },
                            { key: "rating", label: "Rating" },
                            { key: "status", label: "Status" },
                            { key: "actions", label: "" },
                        ]}
                        rows={suppliers.map((sup) => ({
                            supplier: (
                                <div className="bd-row" style={{ gap: 8 }}>
                                    <span>{sup.country === "NG" ? "🇳🇬" : "🇧🇩"}</span>
                                    <span style={{ fontWeight: 700 }}>{sup.name}</span>
                                </div>
                            ),
                            type: <Badge>{sup.type}</Badge>,
                            verification: getVerificationBadge(sup.verification),
                            orders: `${sup.ordersCompleted}/${sup.ordersTotal}`,
                            onTime: (
                                <span
                                    style={{
                                        fontWeight: 700,
                                        color: sup.onTimeRate >= 90 ? "hsl(var(--bd-success))" : sup.onTimeRate >= 80 ? "hsl(var(--bd-warning))" : "hsl(var(--bd-danger))",
                                    }}
                                >
                                    {sup.onTimeRate}%
                                </span>
                            ),
                            rating: (
                                <span style={{ fontWeight: 700, color: getRatingColor(sup.rating) }}>
                                    ⭐ {sup.rating}
                                </span>
                            ),
                            status: sup.flagged ? (
                                <Badge variant="danger">Flagged</Badge>
                            ) : (
                                <Badge variant="success">Good</Badge>
                            ),
                            actions: (
                                <Button variant="soft" size="sm">
                                    View Details
                                </Button>
                            ),
                        }))}
                    />
                </CardBody>
            </Card>

            {/* Note */}
            <Card style={{ background: "hsl(var(--bd-muted))" }}>
                <CardBody className="bd-row" style={{ gap: 12 }}>
                    <span style={{ fontSize: 20 }}>ℹ️</span>
                    <div className="bd-small">
                        <strong>Note:</strong> Ops can recommend supplier suspension but cannot directly
                        suspend or assign verification ticks. Those actions require Admin approval.
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
