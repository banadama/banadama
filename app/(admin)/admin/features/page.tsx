// app/(admin)/admin/features/page.tsx - Admin Feature Flags
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { FeatureFlagEditor } from "@/components/admin/actions";
import { Icons } from "@/components/icons/icons";

async function getFeatureFlags() {
    try {
        const flags = await apiGet<{ flags: any[] }>("/api/admin/feature-flags");
        // Convert array to object for editor
        const flagsObj: Record<string, boolean> = {};
        flags.flags?.forEach((flag: any) => {
            flagsObj[flag.key] = flag.enabled;
        });
        return flagsObj;
    } catch {
        return {
            NEAR_ME_ENABLED: true,
            GLOBAL_MARKET_ENABLED: true,
            CREATORS_ENABLED: true,
            AFFILIATE_ENABLED: true,
            CART_ENABLED: false,
            RFQ_ENABLED: true,
        };
    }
}

export default async function AdminFeaturesPage() {
    await requireRole("ADMIN");
    const flags = await getFeatureFlags();

    return (
        <div className="bd-container bd-page">
            <div style={{ marginBottom: 20 }}>
                <h1 className="bd-h1">Feature Flags</h1>
                <p className="bd-p" style={{ opacity: 0.7 }}>
                    Enable or disable platform features globally
                </p>
            </div>

            <FeatureFlagEditor flags={flags} />

            {/* Feature Descriptions */}
            <div className="bd-card bd-card-pad" style={{ marginTop: 20, boxShadow: "none" }}>
                <div style={{ fontWeight: 950, marginBottom: 12 }}>Feature Descriptions</div>
                <div style={{ display: "grid", gap: 10, fontSize: 14 }}>
                    <div style={{ display: "grid", gap: 4 }}>
                        <div style={{ fontWeight: 700 }}>NEAR_ME_ENABLED</div>
                        <div style={{ color: "var(--bd-muted)" }}>Enables "Buy Near Me" local trading mode</div>
                    </div>
                    <div style={{ display: "grid", gap: 4 }}>
                        <div style={{ fontWeight: 700 }}>GLOBAL_MARKET_ENABLED</div>
                        <div style={{ color: "var(--bd-muted)" }}>Enables Global Marketplace (buy-only mode)</div>
                    </div>
                    <div style={{ display: "grid", gap: 4 }}>
                        <div style={{ fontWeight: 700 }}>CREATORS_ENABLED</div>
                        <div style={{ color: "var(--bd-muted)" }}>Enables Creators marketplace and job posts</div>
                    </div>
                    <div style={{ display: "grid", gap: 4 }}>
                        <div style={{ fontWeight: 700 }}>AFFILIATE_ENABLED</div>
                        <div style={{ color: "var(--bd-muted)" }}>Enables Affiliate program</div>
                    </div>
                    <div style={{ display: "grid", gap: 4 }}>
                        <div style={{ fontWeight: 700 }}>CART_ENABLED</div>
                        <div style={{ color: "var(--bd-muted)" }}>Enables shopping cart (optional - Buy Now still works)</div>
                    </div>
                    <div style={{ display: "grid", gap: 4 }}>
                        <div style={{ fontWeight: 700 }}>RFQ_ENABLED</div>
                        <div style={{ color: "var(--bd-muted)" }}>Enables Request for Quote flow</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
