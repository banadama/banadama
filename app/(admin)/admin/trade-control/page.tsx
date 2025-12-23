// app/(admin)/admin/studio/trade-control/page.tsx - Admin Trade Control
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { TradeControlEditor } from "@/components/admin/actions";
import { Icons } from "@/components/icons/icons";

async function getTradeControl() {
    try {
        const res = await apiGet<{ ok: boolean; data: { config: any } }>("/api/admin/trade-control");
        return res.data?.config || {};
    } catch {
        return {
            globalBuyOnlyEnabled: true,
            countriesAllowedToBuy: ["NG", "BD"],
            countriesAllowedToSell: ["NG", "BD"],
            internationalSellingEnabled: false,
        };
    }
}

export default async function AdminTradeControlPage() {
    await requireRole("ADMIN");
    const config = await getTradeControl();

    return (
        <div className="bd-container bd-page">
            <div style={{ marginBottom: 20 }}>
                <h1 className="bd-h1">Trade Control</h1>
                <p className="bd-p" style={{ opacity: 0.7 }}>
                    Configure international trade settings and phase locks
                </p>
            </div>

            <TradeControlEditor config={config} />

            {/* Phase Info */}
            <div className="bd-card bd-card-pad" style={{ marginTop: 20, boxShadow: "none" }}>
                <div style={{ fontWeight: 950, marginBottom: 12 }}>
                    <Icons.Globe size={18} style={{ display: "inline", marginRight: 8 }} />
                    Trade Phases
                </div>
                <div style={{ display: "grid", gap: 12, fontSize: 14 }}>
                    <div className="bd-card bd-card-pad" style={{ background: "var(--bd-success)", color: "white" }}>
                        <div style={{ fontWeight: 700 }}>Phase 1 (Current): Global Buy-Only</div>
                        <div style={{ opacity: 0.9, marginTop: 4 }}>
                            Buyers from any country can buy from NG/BD suppliers. No international selling yet.
                        </div>
                    </div>
                    <div className="bd-card bd-card-pad" style={{ opacity: 0.5 }}>
                        <div style={{ fontWeight: 700 }}>Phase 2 (Future): International Selling</div>
                        <div style={{ opacity: 0.7, marginTop: 4 }}>
                            Suppliers can sell internationally with Ops-managed logistics.
                        </div>
                    </div>
                </div>
            </div>

            {/* Config Guide */}
            <div className="bd-card bd-card-pad" style={{ marginTop: 20, boxShadow: "none" }}>
                <div style={{ fontWeight: 950, marginBottom: 12 }}>Configuration Guide</div>
                <div style={{ display: "grid", gap: 10, fontSize: 14 }}>
                    <div>
                        <div style={{ fontWeight: 700 }}>globalBuyOnlyEnabled</div>
                        <div style={{ color: "var(--bd-muted)" }}>Allow buyers from any country to purchase from NG/BD suppliers</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700 }}>countriesAllowedToBuy</div>
                        <div style={{ color: "var(--bd-muted)" }}>Countries where buyers can place orders (array of country codes)</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700 }}>countriesAllowedToSell</div>
                        <div style={{ color: "var(--bd-muted)" }}>Countries where suppliers can list products (array of country codes)</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700 }}>internationalSellingEnabled</div>
                        <div style={{ color: "var(--bd-muted)" }}>Enable Phase 2: international selling (set to false for Phase 1)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
