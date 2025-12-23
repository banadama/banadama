// app/(retail)/retail/dashboard/page.tsx - Retail Dashboard
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { Icons } from "@/components/icons/icons";

export default async function RetailDashboardPage() {
    await requireRole("RETAIL");

    // Keep minimal: show quick counts (optional endpoints)
    let products: any[] = [];
    let orders: any[] = [];

    try {
        const res = await apiGet("/api/supplier/products");
        products = res?.products ?? [];
    } catch { }

    try {
        const res = await apiGet("/api/supplier/purchase-orders");
        orders = res?.orders ?? [];
    } catch { }

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div className="bd-card bd-card-pad">
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Icons.Store size={20} />
                    <div>
                        <div style={{ fontWeight: 950, fontSize: 18 }}>Retail Dashboard</div>
                        <div style={{ color: "var(--bd-muted)", marginTop: 4 }}>
                            Manage products and fulfill purchase orders through Ops.
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
                <div className="bd-card bd-card-pad">
                    <div style={{ color: "var(--bd-muted)" }}>Products</div>
                    <div style={{ fontWeight: 950, fontSize: 22 }}>{products.length}</div>
                </div>
                <div className="bd-card bd-card-pad">
                    <div style={{ color: "var(--bd-muted)" }}>Active POs</div>
                    <div style={{ fontWeight: 950, fontSize: 22 }}>{orders.length}</div>
                </div>
                <div className="bd-card bd-card-pad">
                    <div style={{ color: "var(--bd-muted)" }}>Messages</div>
                    <div style={{ fontWeight: 950, fontSize: 22 }}>—</div>
                </div>
            </div>
        </div>
    );
}
