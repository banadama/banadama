// app/(admin)/admin/audit-log/page.tsx - Admin Audit Log
"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Icons } from "@/components/icons";

type AuditEntry = {
    id: string;
    timestamp: string;
    actor: string;
    actorRole: string;
    action: string;
    resource: string;
    details: string;
    ip: string;
};

export default function AuditLogPage() {
    const [entries] = useState<AuditEntry[]>([
        { id: "1", timestamp: "2025-01-15 14:32:15", actor: "admin@banadama.com", actorRole: "ADMIN", action: "UPDATE", resource: "User #123", details: "Changed verification status to BLUE_TICK", ip: "102.89.x.x" },
        { id: "2", timestamp: "2025-01-15 14:28:00", actor: "finance@banadama.com", actorRole: "FINANCE_ADMIN", action: "APPROVE", resource: "Payout #456", details: "Released ₦250,000 to supplier", ip: "102.89.x.x" },
        { id: "3", timestamp: "2025-01-15 14:15:30", actor: "ops@banadama.com", actorRole: "OPS", action: "ASSIGN", resource: "RFQ #789", details: "Assigned to Lagos Packaging Co.", ip: "102.89.x.x" },
        { id: "4", timestamp: "2025-01-15 13:45:00", actor: "admin@banadama.com", actorRole: "ADMIN", action: "CREATE", resource: "Category", details: "Created new category: Building Materials", ip: "102.89.x.x" },
        { id: "5", timestamp: "2025-01-15 13:30:00", actor: "finance@banadama.com", actorRole: "FINANCE_ADMIN", action: "REJECT", resource: "Refund #321", details: "Rejected refund request - insufficient evidence", ip: "102.89.x.x" },
    ]);

    const getActionBadge = (action: string) => {
        switch (action) {
            case "CREATE":
                return <Badge variant="success">CREATE</Badge>;
            case "UPDATE":
                return <Badge>UPDATE</Badge>;
            case "DELETE":
                return <Badge variant="danger">DELETE</Badge>;
            case "APPROVE":
                return <Badge variant="success">APPROVE</Badge>;
            case "REJECT":
                return <Badge variant="danger">REJECT</Badge>;
            case "ASSIGN":
                return <Badge>ASSIGN</Badge>;
            default:
                return <Badge>{action}</Badge>;
        }
    };

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 className="bd-h1">Audit Log</h1>
                    <p className="bd-p" style={{ opacity: 0.7 }}>
                        Track all admin actions and system changes
                    </p>
                </div>
                <Button variant="soft" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icons.Document size={16} />
                    Export Log
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardBody className="bd-row" style={{ gap: 12, flexWrap: "wrap" }}>
                    <input
                        type="text"
                        className="bd-input"
                        placeholder="Search actions..."
                        style={{ flex: 1, minWidth: 200 }}
                    />
                    <select className="bd-input" style={{ width: 150 }}>
                        <option value="">All Actions</option>
                        <option value="CREATE">CREATE</option>
                        <option value="UPDATE">UPDATE</option>
                        <option value="DELETE">DELETE</option>
                        <option value="APPROVE">APPROVE</option>
                        <option value="REJECT">REJECT</option>
                    </select>
                    <select className="bd-input" style={{ width: 150 }}>
                        <option value="">All Roles</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="FINANCE_ADMIN">FINANCE</option>
                        <option value="OPS">OPS</option>
                    </select>
                    <input type="date" className="bd-input" style={{ width: 150 }} />
                    <Button variant="primary">Filter</Button>
                </CardBody>
            </Card>

            {/* Log Table */}
            <Card>
                <CardHeader>
                    <div className="bd-row" style={{ justifyContent: "space-between" }}>
                        <div className="bd-h3">Activity Log</div>
                        <div className="bd-small" style={{ opacity: 0.7 }}>{entries.length} entries</div>
                    </div>
                </CardHeader>
                <CardBody>
                    <DataTable
                        columns={[
                            { key: "timestamp", label: "Time" },
                            { key: "actor", label: "Actor" },
                            { key: "action", label: "Action" },
                            { key: "resource", label: "Resource" },
                            { key: "details", label: "Details" },
                        ]}
                        rows={entries.map((entry) => ({
                            timestamp: (
                                <span className="bd-small" style={{ fontFamily: "monospace" }}>
                                    {entry.timestamp}
                                </span>
                            ),
                            actor: (
                                <div>
                                    <div style={{ fontWeight: 700 }}>{entry.actor}</div>
                                    <Badge>{entry.actorRole}</Badge>
                                </div>
                            ),
                            action: getActionBadge(entry.action),
                            resource: entry.resource,
                            details: (
                                <span className="bd-small" style={{ opacity: 0.8 }}>
                                    {entry.details}
                                </span>
                            ),
                        }))}
                    />
                </CardBody>
            </Card>

            {/* Info */}
            <Card style={{ background: "hsl(var(--bd-muted))" }}>
                <CardBody className="bd-row" style={{ gap: 12 }}>
                    <Icons.Shield size={20} />
                    <div className="bd-small">
                        Audit logs are retained for 90 days and cannot be modified or deleted.
                        All admin actions are automatically recorded.
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
