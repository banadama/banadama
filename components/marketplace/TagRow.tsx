import { Icons } from "@/components/icons/icons";
import { VerificationTick } from "@/components/trust/VerificationTick";

export function TagRow({
    categoryLabel,
    supplierName,
    supplierTick,
    supplierCity,
    supplierState,
}: {
    categoryLabel?: string | null;
    supplierName?: string | null;
    supplierTick?: "NONE" | "GREEN_TICK" | "BLUE_TICK";
    supplierCity?: string | null;
    supplierState?: string | null;
}) {
    const TagIcon = Icons.get("Tag");
    const UsersIcon = Icons.get("Users");
    const MapPinIcon = Icons.get("MapPin");

    return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
            {categoryLabel ? (
                <span className="bd-badge">
                    <TagIcon size={14} /> {categoryLabel}
                </span>
            ) : null}

            {supplierName ? (
                <span className="bd-badge" style={{ gap: 8, maxWidth: "100%" }}>
                    <UsersIcon size={14} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{supplierName}</span>
                    <VerificationTick level={supplierTick ?? "NONE"} />
                </span>
            ) : null}

            {(supplierCity || supplierState) ? (
                <span className="bd-badge">
                    <MapPinIcon size={14} />
                    {supplierCity ? `${supplierCity}` : ""}
                    {supplierState ? (supplierCity ? `, ${supplierState}` : supplierState) : ""}
                </span>
            ) : null}
        </div>
    );
}
