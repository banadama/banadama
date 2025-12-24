// app/(wholesaler)/wholesaler/products/page.tsx - Wholesaler Products
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default async function WholesalerProducts() {
    const products = [
        { id: "w1", title: "Carton Boxes", price: "₦25,000 / bale", stock: 12, status: "IN_STOCK" },
        { id: "w2", title: "Packaging Tape", price: "₦8,500 / dozen", stock: 3, status: "LOW_STOCK" },
        { id: "w3", title: "Bubble Wrap Roll", price: "₦15,000 / roll", stock: 0, status: "OUT_OF_STOCK" },
    ];

    const getStockBadge = (status: string) => {
        switch (status) {
            case "IN_STOCK":
                return <Badge variant="success">🟢 In Stock</Badge>;
            case "LOW_STOCK":
                return <Badge variant="warning">🟡 Low Stock</Badge>;
            case "OUT_OF_STOCK":
                return <Badge variant="danger">🔴 Out of Stock</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="bd-grid" style={{ gap: 20 }}>
            <div className="bd-row" style={{ justifyContent: "space-between" }}>
                <div className="bd-h2">📦 My Products</div>
                <Link href="/wholesaler/products/new">
                    <Button variant="primary">+ Add Product</Button>
                </Link>
            </div>

            <div
                className="bd-grid"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}
            >
                {products.map((p) => (
                    <Card key={p.id}>
                        <CardBody className="bd-grid" style={{ gap: 12 }}>
                            <div style={{ fontWeight: 900 }}>{p.title}</div>
                            <div style={{ opacity: 0.85 }}>{p.price}</div>
                            <div className="bd-row" style={{ justifyContent: "space-between" }}>
                                {getStockBadge(p.status)}
                                <span className="bd-small">Qty: {p.stock}</span>
                            </div>
                            <div className="bd-row" style={{ gap: 8 }}>
                                <Link href={`/wholesaler/products/${p.id}/edit`} style={{ flex: 1 }}>
                                    <Button variant="soft" style={{ width: "100%" }}>Edit</Button>
                                </Link>
                                <Button style={{ flex: 1 }}>Hide</Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
