import { requireRole } from "@/lib/auth";
import { NotificationSettingsCard } from "@/components/settings/NotificationSettingsCard";

export default async function OpsSettings() {
    await requireRole("OPS");
    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontWeight: 950, fontSize: 20 }}>Settings</div>
            <NotificationSettingsCard />
        </div>
    );
}
