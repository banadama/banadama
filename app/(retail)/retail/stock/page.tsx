// app/(retail)/retail/stock/page.tsx - Retail Stock Management
"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Icons } from "@/components/icons";

interface StockItem {
    id: string;
    name: string;
    sku: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    status: string;
}

export default function RetailStockPage() {
    const [items] = useState<StockItem[]>([
        { id: "1", name: "Office Supplies Bundle", sku: "OSB-001", currentStock: 25, minStock: 10, maxStock: 50, status: "OK" },
        { id: "2", name: "Cleaning Products Pack", sku: "CPP-002", currentStock: 50, minStock: 20, maxStock: 100, status: "OK" },
        { id: "3", name: "Stationery Set x10", sku: "SS-003", currentStock: 100, minStock: 30, maxStock: 150, status: "OK" },
        { id: "4", name: "Paper Ream Bundle", sku: "PRB-004", currentStock: 8, minStock: 15, maxStock: 50, status: "LOW" },
        { id: "5", name: "Printer Ink Set", sku: "PIS-005", currentStock: 5, minStock: 10, maxStock: 30, status: "CRITICAL" },
    ]);

    const lowStockCount = items.filter(i => i.status !== "OK").length;

    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 className="bd-h1">Stock Management</h1>
                    <p className="bd-p" style={{ opacity: 0.7 }}>Monitor and manage inventory levels</p>
                </div>
                {lowStockCount > 0 && (
                    <Badge variant="danger">{lowStockCount} items need attention</Badge>
                )}
            </div>

            {/* Stats */}
            <div className="bd-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                            <Icons.Stock size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Total Items</div>
                                <div style={{ fontSize: 28, fontWeight: 900 }}>{items.length}</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                            <Icons.Check size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>In Stock</div>
                                <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-success))" }}>
                                    {items.filter(i => i.status === "OK").length}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                            <Icons.Warning size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Low Stock</div>
                                <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-warning))" }}>
                                    {items.filter(i => i.status === "LOW").length}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                            <Icons.X size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Critical</div>
                                <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-danger))" }}>
                                    {items.filter(i => i.status === "CRITICAL").length}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Stock Table */}
            <Card>
                <CardHeader>
                    <div className="bd-h3">Inventory</div>
                </CardHeader>
                <CardBody>
                    <DataTable
                        columns={[
                            { key: "product", label: "Product" },
                            { key: "sku", label: "SKU" },
                            { key: "current", label: "Current" },
                            { key: "min", label: "Min" },
                            { key: "max", label: "Max" },
                            { key: "status", label: "Status" },
                            { key: "actions", label: "Actions" },
                        ]}
                        rows={items.map((item) => ({
                            product: <span style={{ fontWeight: 700 }}>{item.name}</span>,
                            sku: <span style={{ fontFamily: "monospace", fontSize: 12 }}>{item.sku}</span>,
                            current: item.currentStock,
                            min: item.minStock,
                            max: item.maxStock,
                            status: (
                                <Badge variant={
                                    item.status === "OK" ? "success" :
                                        item.status === "LOW" ? "warning" : "danger"
                                }>
                                    {item.status}
                                </Badge>
                            ),
                            actions: (
                                <Button variant="soft" size="sm">Update</Button>
                            ),
                        }))}
                    />
                </CardBody>
            </Card>
        </div>
    );
}
