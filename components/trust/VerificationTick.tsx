// components/trust/VerificationTick.tsx - Verification Tick Display
import { Icons } from "@/components/icons/icons";

export function VerificationTick({ level }: { level: "NONE" | "GREEN_TICK" | "BLUE_TICK" }) {
    if (level === "NONE") return null;

    const TickBlue = Icons.get("TickBlue");
    const TickGreen = Icons.get("TickGreen");
    const Icon = level === "BLUE_TICK" ? TickBlue : TickGreen;
    return (
        <span
            title={level === "BLUE_TICK" ? "Verified (Blue)" : "Verified (Green)"}
            style={{ display: "inline-grid", placeItems: "center" }}
        >
            <Icon size={16} />
        </span>
    );
}
