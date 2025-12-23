// components/trust/SupplierBadge.tsx - Supplier Badge with Verification Tick
import { VerificationTick } from "@/components/trust/VerificationTick";
import { Icons } from "@/components/icons/icons";

export function SupplierBadge({
    name,
    tick,
}: {
    name: string;
    tick: "NONE" | "GREEN_TICK" | "BLUE_TICK";
}) {
    const Users = Icons.get("Users");

    return (
        <span className="bd-badge" style={{ gap: 8, maxWidth: "100%" }}>
            <Users size={14} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
            <VerificationTick level={tick} />
        </span>
    );
}
