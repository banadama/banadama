// app/(retail)/retail/products/page.tsx - Retail Products List
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { Icons } from "@/components/icons/icons";

export default async function RetailProductsPage() {
    await requireRole("RETAIL");

    let products = [];
    try {
        const res = await apiGet("/api/supplier/products");
        products = res?.products ?? [];
    } catch { }

    return (
        <div className="bd-card bd-card-pad">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
                <div>
                    <div style={{ fontWeight: 950, fontSize: 18 }}>Products</div>
                    <div style={{ color: "var(--bd-muted)", marginTop: 4 }}>
                        Your listings appear in Marketplace based on enabled modes.
                    </div>
                </div>
                <a className="bd-btn bd-btn-primary" href="/retail/products/new">
                    <Icons.Plus size={18} /> New Product
                </a>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
                {products.length ? products.map((p: any) => (
                    <a key={p.id} href={`/retail/products/${p.id}/edit`} className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 6 }}>
                        <div style={{ fontWeight: 900 }}>{p.title}</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", color: "var(--bd-muted)" }}>
                            <span className="bd-badge"><Icons.Tag size={14} /> {p.categorySlug ?? "—"}</span>
                            <span className="bd-badge"><Icons.Cart size={14} /> {p.buyNowEnabled ? "Buy Now" : "—"}</span>
                            <span className="bd-badge"><Icons.Document size={14} /> {p.rfqEnabled ? "RFQ" : "—"}</span>
                        </div>
                    </a>
                )) : (
                    <div className="bd-card bd-card-pad" style={{ boxShadow: "none", color: "var(--bd-muted)" }}>
                        No products yet. Create your first listing.
                    </div>
                )}
            </div>
        </div>
    );
}
