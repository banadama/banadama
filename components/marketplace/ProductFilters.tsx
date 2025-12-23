// components/marketplace/ProductFilters.tsx - Marketplace Filters (SVG icons, no emojis)
"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Icons } from "../icons/icons";
import type { MarketplaceFilters, MarketplaceSort, CreatorType } from "@/types/marketplace";
import { CREATOR_TYPE_CONFIG } from "@/types/marketplace";

interface ProductFiltersProps {
    filters: MarketplaceFilters;
    sort: MarketplaceSort;
    onFiltersChange: (filters: MarketplaceFilters) => void;
    onSortChange: (sort: MarketplaceSort) => void;
    categories: { slug: string; name: string }[];
    showCreatorFilters?: boolean;
}

export function ProductFilters({
    filters,
    sort,
    onFiltersChange,
    onSortChange,
    categories,
    showCreatorFilters = true,
}: ProductFiltersProps) {
    const [expanded, setExpanded] = useState(false);

    const updateFilter = <K extends keyof MarketplaceFilters>(
        key: K,
        value: MarketplaceFilters[K]
    ) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFiltersChange({});
    };

    const hasActiveFilters = Object.values(filters).some(
        (v) => v !== undefined && v !== "" && v !== "ALL"
    );

    const isCreatorSelected = filters.supplierType === "CREATOR";

    const SearchIcon = Icons.get("Search");
    const FilterIcon = Icons.get("Filter");
    const XIcon = Icons.get("X");
    const ShieldIcon = Icons.get("Shield");
    const BrushIcon = Icons.get("Brush");

    return (
        <div className="bd-grid" style={{ gap: 16 }}>
            {/* Search + Sort Row */}
            <div className="bd-row" style={{ gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                    <SearchIcon size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} />
                    <input
                        type="text"
                        className="bd-input"
                        placeholder="Search products & services..."
                        value={filters.search || ""}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        style={{ paddingLeft: 36 }}
                    />
                </div>

                <select
                    className="bd-input"
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value as MarketplaceSort)}
                    style={{ width: 180 }}
                >
                    <option value="BEST_MATCH">Best Match</option>
                    <option value="VERIFIED_FIRST">Verified First</option>
                    <option value="FAST_DELIVERY">Fast Delivery</option>
                    <option value="MOQ_LOW_HIGH">MOQ: Low to High</option>
                    <option value="PRICE_LOW_HIGH">Price: Low to High</option>
                </select>

                <Button variant="soft" onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <FilterIcon size={16} />
                    {expanded ? "Hide Filters" : "Show Filters"}
                </Button>

                {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <XIcon size={16} />
                        Clear All
                    </Button>
                )}
            </div>

            {/* Quick Filters */}
            <div className="bd-row" style={{ gap: 8, flexWrap: "wrap" }}>
                <Badge
                    variant={filters.country === "NG" ? "success" : "default"}
                    style={{ cursor: "pointer" }}
                    onClick={() => updateFilter("country", filters.country === "NG" ? "ALL" : "NG")}
                >
                    NG
                </Badge>
                <Badge
                    variant={filters.country === "BD" ? "success" : "default"}
                    style={{ cursor: "pointer" }}
                    onClick={() => updateFilter("country", filters.country === "BD" ? "ALL" : "BD")}
                >
                    BD
                </Badge>
                <span style={{ opacity: 0.3 }}>|</span>
                <Badge
                    variant={filters.mode === "BUY_NOW" ? "success" : "default"}
                    style={{ cursor: "pointer" }}
                    onClick={() => updateFilter("mode", filters.mode === "BUY_NOW" ? "ALL" : "BUY_NOW")}
                >
                    Buy Now
                </Badge>
                <Badge
                    variant={filters.mode === "RFQ" ? "success" : "default"}
                    style={{ cursor: "pointer" }}
                    onClick={() => updateFilter("mode", filters.mode === "RFQ" ? "ALL" : "RFQ")}
                >
                    RFQ
                </Badge>
                <span style={{ opacity: 0.3 }}>|</span>
                <Badge
                    variant={filters.verification === "GREEN_TICK" ? "success" : "default"}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                    onClick={() =>
                        updateFilter(
                            "verification",
                            filters.verification === "GREEN_TICK" ? "ALL" : "GREEN_TICK"
                        )
                    }
                >
                    <ShieldIcon size={12} /> Verified
                </Badge>
                {showCreatorFilters && (
                    <>
                        <span style={{ opacity: 0.3 }}>|</span>
                        <Badge
                            variant={filters.supplierType === "CREATOR" ? "success" : "default"}
                            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                            onClick={() =>
                                updateFilter(
                                    "supplierType",
                                    filters.supplierType === "CREATOR" ? "ALL" : "CREATOR"
                                )
                            }
                        >
                            <BrushIcon size={12} /> Creators
                        </Badge>
                    </>
                )}
            </div>

            {/* Creator Type Quick Filters (when Creator selected) */}
            {isCreatorSelected && (
                <div className="bd-row" style={{ gap: 8, flexWrap: "wrap", paddingLeft: 16 }}>
                    <span className="bd-small" style={{ opacity: 0.6 }}>Creator Type:</span>
                    {(Object.entries(CREATOR_TYPE_CONFIG) as [CreatorType, typeof CREATOR_TYPE_CONFIG[CreatorType]][]).map(
                        ([key, config]) => (
                            <Badge
                                key={key}
                                variant={filters.creatorType === key ? "success" : "default"}
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                    updateFilter("creatorType", filters.creatorType === key ? "ALL" : key)
                                }
                            >
                                {config.label}
                            </Badge>
                        )
                    )}
                </div>
            )}

            {/* Expanded Filters */}
            {expanded && (
                <div
                    className="bd-card bd-card-pad"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 16,
                    }}
                >
                    {/* Category */}
                    <div>
                        <label className="bd-label">Category</label>
                        <select
                            className="bd-input"
                            value={filters.category || ""}
                            onChange={(e) => updateFilter("category", e.target.value || undefined)}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.slug} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                            <option value="services">Services / Creators</option>
                        </select>
                    </div>

                    {/* Supplier Type */}
                    <div>
                        <label className="bd-label">Supplier Type</label>
                        <select
                            className="bd-input"
                            value={filters.supplierType || "ALL"}
                            onChange={(e) =>
                                updateFilter("supplierType", e.target.value as any)
                            }
                        >
                            <option value="ALL">All Types</option>
                            <option value="FACTORY">Factory</option>
                            <option value="WHOLESALER">Wholesaler</option>
                            <option value="RETAIL">Retail</option>
                            <option value="CREATOR">Creator</option>
                        </select>
                    </div>

                    {/* Creator Type (visible only when Creator selected) */}
                    {isCreatorSelected && (
                        <div>
                            <label className="bd-label">Creator Type</label>
                            <select
                                className="bd-input"
                                value={filters.creatorType || "ALL"}
                                onChange={(e) =>
                                    updateFilter("creatorType", e.target.value as any)
                                }
                            >
                                <option value="ALL">All Creators</option>
                                <option value="GRAPHIC_DESIGNER">Graphic Designer</option>
                                <option value="MOCK_DESIGNER">Mock Designer</option>
                                <option value="PHOTOGRAPHER">Photographer</option>
                                <option value="VIDEOGRAPHER">Videographer</option>
                                <option value="MODEL">Model</option>
                            </select>
                        </div>
                    )}

                    {/* Delivery Type */}
                    <div>
                        <label className="bd-label">Delivery Type</label>
                        <select
                            className="bd-input"
                            value={filters.deliveryType || "ALL"}
                            onChange={(e) =>
                                updateFilter("deliveryType", e.target.value as any)
                            }
                        >
                            <option value="ALL">All</option>
                            <option value="PHYSICAL">Physical Delivery</option>
                            <option value="DIGITAL">Digital Delivery</option>
                            <option value="LOCAL_SERVICE">Local Service</option>
                        </select>
                    </div>

                    {/* Verification */}
                    <div>
                        <label className="bd-label">Verification</label>
                        <select
                            className="bd-input"
                            value={filters.verification || "ALL"}
                            onChange={(e) =>
                                updateFilter("verification", e.target.value as any)
                            }
                        >
                            <option value="ALL">All</option>
                            <option value="BLUE_TICK">Blue Tick (Verified)</option>
                            <option value="GREEN_TICK">Green Tick (Trusted)</option>
                            <option value="NONE">None</option>
                        </select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="bd-label">Price Range (₦)</label>
                        <div className="bd-row" style={{ gap: 8 }}>
                            <input
                                type="number"
                                className="bd-input"
                                placeholder="Min"
                                value={filters.priceMin || ""}
                                onChange={(e) =>
                                    updateFilter("priceMin", e.target.value ? Number(e.target.value) : undefined)
                                }
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                className="bd-input"
                                placeholder="Max"
                                value={filters.priceMax || ""}
                                onChange={(e) =>
                                    updateFilter("priceMax", e.target.value ? Number(e.target.value) : undefined)
                                }
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
