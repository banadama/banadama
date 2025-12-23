// app/(admin)/admin/market-control/page.tsx - Admin Market Control
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { MarketControlEditor } from "@/components/admin/actions";
import { Icons } from "@/components/icons/icons";

async function getMarketControl() {
    try {
        const res = await apiGet<{ ok: boolean; data: { config: any } }>("/api/admin/market-control");
        return res.data?.config || {};
    } catch {
        return {
            defaultCurrency: "USD",
            maxUploadSizeMb: 25,
            minOrderValue: 0,
            search: { maxResults: 60 },
        };
    }
}

export default async function AdminMarketControlPage() {
    await requireRole("ADMIN");
    const config = await getMarketControl();

    return (
        <div className="bd-container bd-page">
            <div style={{ marginBottom: 20 }}>
                <h1 className="bd-h1">Market Control</h1>
                <p className="bd-p" style={{ opacity: 0.7 }}>
                    Configure global marketplace settings and limits
                </p>
            </div>

            <MarketControlEditor config={config} />

            {/* Config Guide */}
            <div className="bd-card bd-card-pad" style={{ marginTop: 20, boxShadow: "none" }}>
                <div style={{ fontWeight: 950, marginBottom: 12 }}>Configuration Guide</div>
                <div style={{ display: "grid", gap: 10, fontSize: 14 }}>
                    <div>
                        <div style={{ fontWeight: 700 }}>defaultCurrency</div>
                        <div style={{ color: "var(--bd-muted)" }}>Primary currency for global marketplace (USD, NGN, BDT)</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700 }}>maxUploadSizeMb</div>
                        <div style={{ color: "var(--bd-muted)" }}>Maximum file upload size in megabytes</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700 }}>minOrderValue</div>
                        <div style={{ color: "var(--bd-muted)" }}>Minimum order value (0 for no limit)</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700 }}>search.maxResults</div>
                        <div style={{ color: "var(--bd-muted)" }}>Maximum results per search page</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
