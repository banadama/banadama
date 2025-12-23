// app/(buyer)/buyer/dashboard/page.tsx - Buyer Dashboard (Wireframe compliant)
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/icons";

interface DashboardStats {
  activeRfqs: number;
  pendingOrders: number;
  completedOrders: number;
  walletBalance: number;
  escrowLocked: number;
}

interface RecentRfq {
  id: string;
  product: string;
  status: string;
  createdAt: string;
}

interface RecentOrder {
  id: string;
  product: string;
  supplier: string;
  status: string;
  total: number;
}

export default function BuyerDashboardPage() {
  const [stats] = useState<DashboardStats>({
    activeRfqs: 3,
    pendingOrders: 2,
    completedOrders: 15,
    walletBalance: 125000000,
    escrowLocked: 45000000,
  });

  const [recentRfqs] = useState<RecentRfq[]>([
    { id: "RFQ-001", product: "Packaging Nylon Bags - 5000pcs", status: "PENDING_QUOTE", createdAt: "2025-01-15" },
    { id: "RFQ-002", product: "Cotton T-Shirts - 1000pcs", status: "QUOTED", createdAt: "2025-01-14" },
    { id: "RFQ-003", product: "Adhesive Tape - 200 rolls", status: "CONFIRMED", createdAt: "2025-01-12" },
  ]);

  const [recentOrders] = useState<RecentOrder[]>([
    { id: "ORD-001", product: "Paper Bags - 2000pcs", supplier: "Lagos Packaging", status: "IN_PRODUCTION", total: 15000000 },
    { id: "ORD-002", product: "Labels - 5000pcs", supplier: "Ikeja Prints", status: "SHIPPED", total: 8500000 },
  ]);

  const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
      PENDING_QUOTE: { label: "Pending Quote", variant: "warning" },
      QUOTED: { label: "Quoted", variant: "default" },
      CONFIRMED: { label: "Confirmed", variant: "success" },
      IN_PRODUCTION: { label: "In Production", variant: "warning" },
      SHIPPED: { label: "Shipped", variant: "success" },
      DELIVERED: { label: "Delivered", variant: "success" },
    };
    return <Badge variant={config[status]?.variant || "default"}>{config[status]?.label || status}</Badge>;
  };

  return (
    <div className="bd-grid" style={{ gap: 24 }}>
      {/* Page Header */}
      <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="bd-h1">Dashboard</h1>
          <p className="bd-p" style={{ opacity: 0.7 }}>Welcome back! Here's your sourcing overview.</p>
        </div>
        <Link href="/buyer/requests/new">
          <Button variant="primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icons.Plus size={16} /> New RFQ
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="bd-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        <Link href="/buyer/requests">
          <Card style={{ cursor: "pointer" }}>
            <CardBody>
              <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                <Icons.RFQ size={24} />
                <div>
                  <div className="bd-small" style={{ opacity: 0.7 }}>Active RFQs</div>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>{stats.activeRfqs}</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Link>

        <Link href="/buyer/orders">
          <Card style={{ cursor: "pointer" }}>
            <CardBody>
              <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                <Icons.Package size={24} />
                <div>
                  <div className="bd-small" style={{ opacity: 0.7 }}>Pending Orders</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-warning))" }}>{stats.pendingOrders}</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Link>

        <Card>
          <CardBody>
            <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
              <Icons.Check size={24} />
              <div>
                <div className="bd-small" style={{ opacity: 0.7 }}>Completed</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-success))" }}>{stats.completedOrders}</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Link href="/buyer/wallet">
          <Card style={{ cursor: "pointer" }}>
            <CardBody>
              <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                <Icons.Wallet size={24} />
                <div>
                  <div className="bd-small" style={{ opacity: 0.7 }}>Wallet</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "hsl(var(--bd-success))" }}>{formatMoney(stats.walletBalance)}</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Link>

        <Card>
          <CardBody>
            <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
              <Icons.Lock size={24} />
              <div>
                <div className="bd-small" style={{ opacity: 0.7 }}>Escrow</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "hsl(var(--bd-warning))" }}>{formatMoney(stats.escrowLocked)}</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent RFQs & Orders */}
      <div className="bd-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent RFQs */}
        <Card>
          <CardHeader>
            <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div className="bd-h3" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.RFQ size={18} /> Recent RFQs
              </div>
              <Link href="/buyer/requests">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody className="bd-grid" style={{ gap: 12 }}>
            {recentRfqs.map((rfq) => (
              <Link key={rfq.id} href={`/buyer/requests/${rfq.id}`}>
                <div
                  className="bd-row"
                  style={{
                    justifyContent: "space-between",
                    padding: 12,
                    background: "hsl(var(--bd-muted))",
                    borderRadius: "var(--bd-radius)",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{rfq.product}</div>
                    <div className="bd-small" style={{ opacity: 0.7 }}>{rfq.id} • {rfq.createdAt}</div>
                  </div>
                  {getStatusBadge(rfq.status)}
                </div>
              </Link>
            ))}
          </CardBody>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div className="bd-h3" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Orders size={18} /> Recent Orders
              </div>
              <Link href="/buyer/orders">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody className="bd-grid" style={{ gap: 12 }}>
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/buyer/orders/${order.id}`}>
                <div
                  className="bd-row"
                  style={{
                    justifyContent: "space-between",
                    padding: 12,
                    background: "hsl(var(--bd-muted))",
                    borderRadius: "var(--bd-radius)",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{order.product}</div>
                    <div className="bd-small" style={{ opacity: 0.7 }}>{order.supplier} • {formatMoney(order.total)}</div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </Link>
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
          <div className="bd-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <Link href="/buyer/requests/new">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Plus size={16} /> Create RFQ
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Marketplace size={16} /> Browse Products
              </Button>
            </Link>
            <Link href="/buyer/messages">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Message size={16} /> Messages
              </Button>
            </Link>
            <Link href="/buyer/wallet">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Wallet size={16} /> Fund Wallet
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
