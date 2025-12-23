// app/(ops)/ops/overview/page.tsx - Ops Control Tower (Wireframe compliant)
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/icons";

interface OpsStats {
    pendingRfqs: number;
    activeOrders: number;
    shipmentsInTransit: number;
    pendingVerifications: number;
    openDisputes: number;
    alertsCount: number;
}

interface Alert {
    id: string;
    type: string;
    message: string;
    severity: "high" | "medium" | "low";
    createdAt: string;
}

interface QueueItem {
    id: string;
    type: string;
    subject: string;
    priority: string;
    age: string;
}

export default function OpsOverviewPage() {
    const [stats] = useState<OpsStats>({
        pendingRfqs: 8,
        activeOrders: 24,
        shipmentsInTransit: 12,
        pendingVerifications: 5,
        openDisputes: 3,
        alertsCount: 4,
    });

    const [alerts] = useState<Alert[]>([
        { id: "1", type: "ORDER", message: "Order #ORD-123 delayed by supplier", severity: "high", createdAt: "10 min ago" },
        { id: "2", type: "RFQ", message: "RFQ #RFQ-456 unassigned for 24h", severity: "medium", createdAt: "30 min ago" },
        { id: "3", type: "DISPUTE", message: "New dispute opened on Order #ORD-789", severity: "high", createdAt: "1 hour ago" },
        { id: "4", type: "VERIFICATION", message: "Supplier verification pending review", severity: "low", createdAt: "2 hours ago" },
    ]);

    const [queues] = useState<QueueItem[]>([
        { id: "RFQ-001", type: "RFQ", subject: "Packaging Nylon Bags - 5000pcs", priority: "HIGH", age: "2h" },
        { id: "RFQ-002", type: "RFQ", subject: "Cotton T-Shirts - 1000pcs", priority: "MEDIUM", age: "4h" },
        { id: "ORD-003", type: "ORDER", subject: "Paper Bags order needs status update", priority: "HIGH", age: "1h" },
        { id: "VER-004", type: "VERIFICATION", subject: "Lagos Packaging Co. - Blue Tick", priority: "MEDIUM", age: "6h" },
    ]);

    const getSeverityBadge = (severity: string) => {
        const variants: Record<string, "danger" | "warning" | "default"> = {
            high: "danger",
            medium: "warning",
            low: "default",
        };
        return <Badge variant={variants[severity] || "default"}>{severity.toUpperCase()}</Badge>;
    };

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            {/* Page Header */}
            <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 className="bd-h1">Ops Control Tower</h1>
                    <p className="bd-p" style={{ opacity: 0.7 }}>Real-time operations dashboard</p>
                </div>
                <div className="bd-row" style={{ gap: 12 }}>
                    <Badge variant={stats.alertsCount > 0 ? "danger" : "success"}>
                        {stats.alertsCount} Active Alerts
                    </Badge>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="bd-grid" style={{ gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
                <Link href="/ops/buyer-requests">
                    <Card style={{ cursor: "pointer" }}>
                        <CardBody>
                            <div style={{ textAlign: "center" }}>
                                <Icons.RFQ size={24} style={{ margin: "0 auto 8px" }} />
                                <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-warning))" }}>{stats.pendingRfqs}</div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Pending RFQs</div>
                            </div>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/ops/orders">
                    <Card style={{ cursor: "pointer" }}>
                        <CardBody>
                            <div style={{ textAlign: "center" }}>
                                <Icons.Orders size={24} style={{ margin: "0 auto 8px" }} />
                                <div style={{ fontSize: 28, fontWeight: 900 }}>{stats.activeOrders}</div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Active Orders</div>
                            </div>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/ops/logistics">
                    <Card style={{ cursor: "pointer" }}>
                        <CardBody>
                            <div style={{ textAlign: "center" }}>
                                <Icons.Truck size={24} style={{ margin: "0 auto 8px" }} />
                                <div style={{ fontSize: 28, fontWeight: 900 }}>{stats.shipmentsInTransit}</div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>In Transit</div>
                            </div>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/ops/verifications-review">
                    <Card style={{ cursor: "pointer" }}>
                        <CardBody>
                            <div style={{ textAlign: "center" }}>
                                <Icons.Shield size={24} style={{ margin: "0 auto 8px" }} />
                                <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-warning))" }}>{stats.pendingVerifications}</div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Verifications</div>
                            </div>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/ops/disputes">
                    <Card style={{ cursor: "pointer" }}>
                        <CardBody>
                            <div style={{ textAlign: "center" }}>
                                <Icons.Warning size={24} style={{ margin: "0 auto 8px" }} />
                                <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-danger))" }}>{stats.openDisputes}</div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Disputes</div>
                            </div>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/ops/messages">
                    <Card style={{ cursor: "pointer" }}>
                        <CardBody>
                            <div style={{ textAlign: "center" }}>
                                <Icons.Message size={24} style={{ margin: "0 auto 8px" }} />
                                <div style={{ fontSize: 28, fontWeight: 900 }}>5</div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Unread</div>
                            </div>
                        </CardBody>
                    </Card>
                </Link>
            </div>

            {/* Alerts & Queue */}
            <div className="bd-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Alerts */}
                <Card>
                    <CardHeader>
                        <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                            <div className="bd-h3" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Icons.Warning size={18} /> Active Alerts
                            </div>
                            <Badge variant="danger">{alerts.length}</Badge>
                        </div>
                    </CardHeader>
                    <CardBody className="bd-grid" style={{ gap: 12 }}>
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="bd-row"
                                style={{
                                    justifyContent: "space-between",
                                    padding: 12,
                                    background: alert.severity === "high" ? "rgba(239, 68, 68, 0.1)" : "hsl(var(--bd-muted))",
                                    borderRadius: "var(--bd-radius)",
                                    borderLeft: `3px solid ${alert.severity === "high" ? "hsl(var(--bd-danger))" : "hsl(var(--bd-warning))"}`,
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 700 }}>{alert.message}</div>
                                    <div className="bd-small" style={{ opacity: 0.7 }}>{alert.type} • {alert.createdAt}</div>
                                </div>
                                {getSeverityBadge(alert.severity)}
                            </div>
                        ))}
                    </CardBody>
                </Card>

                {/* Queue Summary */}
                <Card>
                    <CardHeader>
                        <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                            <div className="bd-h3" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Icons.List size={18} /> Work Queue
                            </div>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardBody className="bd-grid" style={{ gap: 12 }}>
                        {queues.map((item) => (
                            <div
                                key={item.id}
                                className="bd-row"
                                style={{
                                    justifyContent: "space-between",
                                    padding: 12,
                                    background: "hsl(var(--bd-muted))",
                                    borderRadius: "var(--bd-radius)",
                                    cursor: "pointer",
                                }}
                            >
                                <div className="bd-row" style={{ gap: 12 }}>
                                    <Badge>{item.type}</Badge>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{item.subject}</div>
                                        <div className="bd-small" style={{ opacity: 0.7 }}>{item.id} • Age: {item.age}</div>
                                    </div>
                                </div>
                                <Badge variant={item.priority === "HIGH" ? "danger" : "default"}>{item.priority}</Badge>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <div className="bd-h3">Quick Actions</div>
                </CardHeader>
                <CardBody>
                    <div className="bd-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                        <Link href="/ops/buyer-requests">
                            <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                                <Icons.RFQ size={16} /> Process RFQs
                            </Button>
                        </Link>
                        <Link href="/ops/orders">
                            <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                                <Icons.Orders size={16} /> Manage Orders
                            </Button>
                        </Link>
                        <Link href="/ops/logistics">
                            <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                                <Icons.Truck size={16} /> Track Shipments
                            </Button>
                        </Link>
                        <Link href="/ops/verifications-review">
                            <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                                <Icons.Shield size={16} /> Review Verifications
                            </Button>
                        </Link>
                        <Link href="/ops/disputes">
                            <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                                <Icons.Warning size={16} /> Handle Disputes
                            </Button>
                        </Link>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
