// components/sections/TrustBadges.tsx
import { Badge } from "../ui/Badge";

const badges = [
    { icon: "🔒", label: "Escrow Protected" },
    { icon: "✓", label: "Verified Suppliers" },
    { icon: "🎯", label: "Ops-Managed" },
    { icon: "🌍", label: "NG + BD" },
];

export function TrustBadges() {
    return (
        <section className="bd-container" style={{ padding: "0 16px 40px" }}>
            <div
                className="bd-row"
                style={{
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 12,
                }}
            >
                {badges.map((b) => (
                    <Badge key={b.label} variant="success">
                        {b.icon} {b.label}
                    </Badge>
                ))}
            </div>
        </section>
    );
}
