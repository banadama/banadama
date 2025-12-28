import { Icons } from "@/components/icons/icons";
import { VerificationBadge, VerificationLevel } from "../verification/VerificationBadge";
import { Badge } from "../ui/Badge";

export function TagRow({
    categoryLabel,
    supplierName,
    supplierTick,
    supplierCity,
    supplierState,
}: {
    categoryLabel?: string | null;
    supplierName?: string | null;
    supplierTick?: "NONE" | "GREEN_TICK" | "BLUE_TICK" | "GOLD_TICK";
    supplierCity?: string | null;
    supplierState?: string | null;
}) {
    // Map legacy tick names to new VerificationLevel
    const mapTickToLevel = (tick: string): VerificationLevel => {
        if (tick === "BLUE_TICK") return "IDENTITY";
        if (tick === "GREEN_TICK") return "BUSINESS";
        if (tick === "GOLD_TICK") return "PREMIUM";
        return "NONE";
    };

    const level = mapTickToLevel(supplierTick || "NONE");

    return (
        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-0.5">
            {categoryLabel && (
                <span className="text-[11px] text-[#007185] hover:text-[#C45500] cursor-pointer">
                    {categoryLabel}
                </span>
            )}

            {supplierName && (
                <div className="flex items-center gap-1">
                    <span className="text-[11px] text-gray-600 truncate">by {supplierName}</span>
                    <VerificationBadge level={level} />
                </div>
            )}

            {(supplierCity || supplierState) && (
                <span className="text-[11px] text-gray-500">
                    ({supplierCity || ""}{supplierCity && supplierState ? ", " : ""}{supplierState || ""})
                </span>
            )}
        </div>

    );
}

