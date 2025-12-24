// app/(factory)/factory/dashboard/page.tsx - Factory Dashboard (Wireframe compliant)
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/icons";

interface FactoryStats {
  pendingRfqs: number;
  activeOrders: number;
  inProduction: number;
  completedThisMonth: number;
  walletBalance: number;
}

interface PendingAction {
  id: string;
  type: string;
  description: string;
  urgency: "high" | "medium" | "low";
}

export default function FactoryDashboardPage() {
  const [stats] = useState<FactoryStats>({
    pendingRfqs: 5,
    activeOrders: 8,
    inProduction: 4,
    completedThisMonth: 12,
    walletBalance: 85000000,
  });

  const [actions] = useState<PendingAction[]>([
    { id: "1", type: "RFQ", description: "New RFQ: Packaging Bags - 10,000 units", urgency: "high" },
    { id: "2", type: "ORDER", description: "Order #ORD-123 ready for shipment", urgency: "medium" },
    { id: "3", type: "DOCS", description: "Upload invoice for Order #ORD-456", urgency: "low" },
  ]);

  const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

  const getUrgencyVariant = (urgency: string) => {
    const variants: Record<string, "danger" | "warning" | "default"> = {
      high: "danger",
      medium: "warning",
      low: "default",
    };
    return variants[urgency] || "default";
  };

  return (
    <div className="bd-grid" style={{ gap: 24 }}>
      {/* Page Header */}
      <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="bd-h1">Factory Dashboard</h1>
          <p className="bd-p" style={{ opacity: 0.7 }}>Manage RFQs, orders, and production</p>
        </div>
        <Link href="/factory/capabilities">
          <Button variant="soft" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icons.Settings size={16} /> Manage Capabilities
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="bd-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        <Link href="/factory/rfqs">
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

        <Link href="/factory/orders">
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

        <Card>
          <CardBody>
            <div style={{ textAlign: "center" }}>
              <Icons.Capabilities size={24} style={{ margin: "0 auto 8px" }} />
              <div style={{ fontSize: 28, fontWeight: 900 }}>{stats.inProduction}</div>
              <div className="bd-small" style={{ opacity: 0.7 }}>In Production</div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div style={{ textAlign: "center" }}>
              <Icons.Check size={24} style={{ margin: "0 auto 8px" }} />
              <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-success))" }}>{stats.completedThisMonth}</div>
              <div className="bd-small" style={{ opacity: 0.7 }}>Completed (MTD)</div>
            </div>
          </CardBody>
        </Card>

        <Link href="/factory/wallet">
          <Card style={{ cursor: "pointer" }}>
            <CardBody>
              <div style={{ textAlign: "center" }}>
                <Icons.Wallet size={24} style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: 20, fontWeight: 900, color: "hsl(var(--bd-success))" }}>{formatMoney(stats.walletBalance)}</div>
                <div className="bd-small" style={{ opacity: 0.7 }}>Wallet</div>
              </div>
            </CardBody>
          </Card>
        </Link>
      </div>

      {/* Pending Actions */}
      <Card>
        <CardHeader>
          <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div className="bd-h3" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icons.Warning size={18} /> Pending Actions
            </div>
            <Badge variant="warning">{actions.length}</Badge>
          </div>
        </CardHeader>
        <CardBody className="bd-grid" style={{ gap: 12 }}>
          {actions.map((action) => (
            <div
              key={action.id}
              className="bd-row"
              style={{
                justifyContent: "space-between",
                padding: 16,
                background: "hsl(var(--bd-muted))",
                borderRadius: "var(--bd-radius)",
                borderLeft: `3px solid hsl(var(--bd-${getUrgencyVariant(action.urgency)}))`,
              }}
            >
              <div className="bd-row" style={{ gap: 12 }}>
                <Badge>{action.type}</Badge>
                <span style={{ fontWeight: 600 }}>{action.description}</span>
              </div>
              <Badge variant={getUrgencyVariant(action.urgency)}>{action.urgency.toUpperCase()}</Badge>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="bd-h3">Quick Actions</div>
        </CardHeader>
        <CardBody>
          <div className="bd-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <Link href="/factory/rfqs">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.RFQ size={16} /> View RFQs
              </Button>
            </Link>
            <Link href="/factory/orders">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Orders size={16} /> Manage Orders
              </Button>
            </Link>
            <Link href="/factory/messages">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Message size={16} /> Messages
              </Button>
            </Link>
            <Link href="/factory/wallet">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Wallet size={16} /> Wallet
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      {/* Ops Notice */}
      <Card style={{ background: "hsl(var(--bd-muted))" }}>
        <CardBody className="bd-row" style={{ gap: 12 }}>
          <Icons.Shield size={20} />
          <div className="bd-small">
            All orders are Ops-mediated. Contact Ops through Messages for any order issues or updates.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
