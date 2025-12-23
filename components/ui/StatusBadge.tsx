// components/ui/StatusBadge.tsx
import { Badge } from "./Badge";

type Status =
    | "PENDING" | "ACTIVE" | "CONFIRMED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED"
    | "IN_PRODUCTION" | "READY" | "SHIPPED" | "COMPLETED" | "DISPUTED"
    | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK"
    | "VERIFIED" | "SUSPENDED" | "REJECTED";

const STATUS_CONFIG: Record<Status, { icon: string; variant: "default" | "success" | "warning" | "danger" }> = {
    PENDING: { icon: "⏳", variant: "warning" },
    ACTIVE: { icon: "🟢", variant: "success" },
    CONFIRMED: { icon: "🧾", variant: "success" },
    IN_TRANSIT: { icon: "🚚", variant: "warning" },
    DELIVERED: { icon: "✅", variant: "success" },
    CANCELLED: { icon: "⛔", variant: "danger" },
    IN_PRODUCTION: { icon: "🏭", variant: "warning" },
    READY: { icon: "✓", variant: "success" },
    SHIPPED: { icon: "🚚", variant: "warning" },
    COMPLETED: { icon: "✅", variant: "success" },
    DISPUTED: { icon: "⚠️", variant: "danger" },
    IN_STOCK: { icon: "🟢", variant: "success" },
    LOW_STOCK: { icon: "🟡", variant: "warning" },
    OUT_OF_STOCK: { icon: "🔴", variant: "danger" },
    VERIFIED: { icon: "✓", variant: "success" },
    SUSPENDED: { icon: "⏸️", variant: "danger" },
    REJECTED: { icon: "✗", variant: "danger" },
};

export function StatusBadge({ status }: { status: Status }) {
    const config = STATUS_CONFIG[status] || { icon: "•", variant: "default" as const };
    return (
        <Badge variant={config.variant}>
            {config.icon} {status.replace(/_/g, " ")}
        </Badge>
    );
}
