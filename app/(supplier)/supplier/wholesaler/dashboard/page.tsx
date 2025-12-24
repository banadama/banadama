// app/(wholesaler)/wholesaler/dashboard/page.tsx - Wholesaler Dashboard (Wireframe compliant)
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/icons";

interface WholesalerStats {
  totalProducts: number;
  activeOrders: number;
  lowStockItems: number;
  completedThisMonth: number;
  walletBalance: number;
}

interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  threshold: number;
}

export default function WholesalerDashboardPage() {
  const [stats] = useState<WholesalerStats>({
    totalProducts: 45,
    activeOrders: 12,
    lowStockItems: 3,
    completedThisMonth: 28,
    walletBalance: 125000000,
  });

  const [lowStock] = useState<LowStockItem[]>([
    { id: "1", name: "Packaging Nylon Bags - Small", stock: 50, threshold: 100 },
    { id: "2", name: "Adhesive Tape - 50m rolls", stock: 25, threshold: 50 },
    { id: "3", name: "Paper Bags - Medium", stock: 75, threshold: 150 },
  ]);

  const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

  return (
    <div className="bd-grid" style={{ gap: 24 }}>
      {/* Page Header */}
      <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="bd-h1">Wholesaler Dashboard</h1>
          <p className="bd-p" style={{ opacity: 0.7 }}>Manage products, stock, and orders</p>
        </div>
        <Link href="/wholesaler/products">
          <Button variant="primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icons.Plus size={16} /> Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="bd-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        <Link href="/wholesaler/products">
          <Card style={{ cursor: "pointer" }}>
            <CardBody>
              <div style={{ textAlign: "center" }}>
                <Icons.Product size={24} style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: 28, fontWeight: 900 }}>{stats.totalProducts}</div>
                <div className="bd-small" style={{ opacity: 0.7 }}>Products</div>
              </div>
            </CardBody>
          </Card>
        </Link>

        <Link href="/wholesaler/orders">
          <Card style={{ cursor: "pointer" }}>
            <CardBody>
              <div style={{ textAlign: "center" }}>
                <Icons.Orders size={24} style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-warning))" }}>{stats.activeOrders}</div>
                <div className="bd-small" style={{ opacity: 0.7 }}>Active Orders</div>
              </div>
            </CardBody>
          </Card>
        </Link>

        <Link href="/wholesaler/stock">
          <Card style={{ cursor: "pointer" }}>
            <CardBody>
              <div style={{ textAlign: "center" }}>
                <Icons.Stock size={24} style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-danger))" }}>{stats.lowStockItems}</div>
                <div className="bd-small" style={{ opacity: 0.7 }}>Low Stock</div>
              </div>
            </CardBody>
          </Card>
        </Link>

        <Card>
          <CardBody>
            <div style={{ textAlign: "center" }}>
              <Icons.Check size={24} style={{ margin: "0 auto 8px" }} />
              <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-success))" }}>{stats.completedThisMonth}</div>
              <div className="bd-small" style={{ opacity: 0.7 }}>Completed (MTD)</div>
            </div>
          </CardBody>
        </Card>

        <Link href="/wholesaler/wallet">
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

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <Card style={{ borderColor: "hsl(var(--bd-danger))" }}>
          <CardHeader>
            <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div className="bd-h3" style={{ display: "flex", alignItems: "center", gap: 8, color: "hsl(var(--bd-danger))" }}>
                <Icons.Warning size={18} /> Low Stock Alert
              </div>
              <Link href="/wholesaler/stock">
                <Button variant="ghost" size="sm">Manage Stock</Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody className="bd-grid" style={{ gap: 12 }}>
            {lowStock.map((item) => (
              <div
                key={item.id}
                className="bd-row"
                style={{
                  justifyContent: "space-between",
                  padding: 12,
                  background: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "var(--bd-radius)",
                }}
              >
                <span style={{ fontWeight: 600 }}>{item.name}</span>
                <div className="bd-row" style={{ gap: 12 }}>
                  <Badge variant="danger">{item.stock} / {item.threshold}</Badge>
                  <Button variant="soft" size="sm">Restock</Button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="bd-h3">Quick Actions</div>
        </CardHeader>
        <CardBody>
          <div className="bd-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <Link href="/wholesaler/products">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Product size={16} /> Products
              </Button>
            </Link>
            <Link href="/wholesaler/stock">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Stock size={16} /> Stock
              </Button>
            </Link>
            <Link href="/wholesaler/messages">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Message size={16} /> Messages
              </Button>
            </Link>
            <Link href="/wholesaler/wallet">
              <Button variant="soft" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <Icons.Wallet size={16} /> Wallet
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
