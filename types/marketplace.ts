// types/marketplace.ts - Marketplace Types (LOCKED)

/**
 * MARKETPLACE MODES
 */
export type MarketplaceMode = "LOCAL" | "GLOBAL";

/**
 * COUNTRY SCOPE
 */
export type Country = "NG" | "BD" | "GLOBAL";

/**
 * SUPPLIER TYPES (includes Creator)
 */
export type SupplierType = "FACTORY" | "WHOLESALER" | "RETAIL" | "CREATOR";

/**
 * CREATOR TYPES
 */
export type CreatorType =
    | "GRAPHIC_DESIGNER"
    | "MOCK_DESIGNER"
    | "PHOTOGRAPHER"
    | "VIDEOGRAPHER"
    | "MODEL";

/**
 * DELIVERY TYPES
 */
export type DeliveryType = "PHYSICAL" | "DIGITAL" | "LOCAL_SERVICE";

/**
 * VERIFICATION LEVEL
 */
export type VerificationLevel = "NONE" | "GREEN_TICK" | "BLUE_TICK";

/**
 * PRODUCT MODE FLAGS
 */
export interface ProductModeFlags {
    buyNowEnabled: boolean;
    rfqEnabled: boolean;
}

/**
 * MARKETPLACE PRODUCT (Generic)
 */
export interface MarketplaceProduct {
    id: string;
    title: string;
    slug: string;
    description?: string;
    images: string[];
    category: string;
    categorySlug: string;

    // Commerce flags
    buyNowEnabled: boolean;
    rfqEnabled: boolean;
    priceBuyNow?: number | null;
    moq: number;
    stockQty?: number | null;
    leadTimeDays?: number | null;

    // Supplier info
    supplier: {
        id: string;
        name: string;
        type: SupplierType;
        country: Country;
        verification: VerificationLevel;
    };

    // Visibility
    country: Country;
    globalVisible: boolean;

    // Delivery
    deliveryType: DeliveryType;

    // Creator specific (optional)
    creatorType?: CreatorType;
    availability?: string;
    location?: string;

    // Supplier location (for Near Me filtering)
    supplierState?: string;
    supplierCity?: string;

    createdAt: string;
    updatedAt: string;
}

/**
 * MARKETPLACE FILTERS
 */
export interface MarketplaceFilters {
    search?: string;
    country?: Country | "ALL";
    category?: string;
    supplierType?: SupplierType | "ALL";
    creatorType?: CreatorType | "ALL";
    deliveryType?: DeliveryType | "ALL";
    verification?: VerificationLevel | "ALL";
    mode?: "BUY_NOW" | "RFQ" | "BOTH" | "ALL";
    moqMin?: number;
    moqMax?: number;
    priceMin?: number;
    priceMax?: number;
}

/**
 * MARKETPLACE SORT
 */
export type MarketplaceSort =
    | "BEST_MATCH"
    | "VERIFIED_FIRST"
    | "FAST_DELIVERY"
    | "MOQ_LOW_HIGH"
    | "PRICE_LOW_HIGH";

/**
 * SUPPLIER TYPE DEFAULTS
 */
export const SUPPLIER_TYPE_DEFAULTS: Record<SupplierType, ProductModeFlags> = {
    FACTORY: {
        buyNowEnabled: false,
        rfqEnabled: true,
    },
    WHOLESALER: {
        buyNowEnabled: true,
        rfqEnabled: false,
    },
    RETAIL: {
        buyNowEnabled: true,
        rfqEnabled: false,
    },
    CREATOR: {
        buyNowEnabled: true,
        rfqEnabled: false,
    },
};

/**
 * CREATOR TYPE CONFIG
 */
export const CREATOR_TYPE_CONFIG: Record<CreatorType, {
    label: string;
    icon: string;
    deliveryType: DeliveryType;
    globalVisible: boolean;
    localOnly: boolean;
}> = {
    GRAPHIC_DESIGNER: {
        label: "Graphic Designer",
        icon: "🎨",
        deliveryType: "DIGITAL",
        globalVisible: true,
        localOnly: false,
    },
    MOCK_DESIGNER: {
        label: "Mock Designer",
        icon: "🖼️",
        deliveryType: "DIGITAL",
        globalVisible: true,
        localOnly: false,
    },
    PHOTOGRAPHER: {
        label: "Photographer",
        icon: "📸",
        deliveryType: "LOCAL_SERVICE",
        globalVisible: false,
        localOnly: true,
    },
    VIDEOGRAPHER: {
        label: "Videographer",
        icon: "🎬",
        deliveryType: "LOCAL_SERVICE",
        globalVisible: false,
        localOnly: true,
    },
    MODEL: {
        label: "Model",
        icon: "🧑‍🎤",
        deliveryType: "LOCAL_SERVICE",
        globalVisible: false,
        localOnly: true,
    },
};

/**
 * COUNTRY RULES
 */
export const COUNTRY_RULES = {
    NG: {
        allowedSupplierTypes: ["WHOLESALER", "RETAIL", "CREATOR"] as SupplierType[],
        allowedCreatorTypes: ["PHOTOGRAPHER", "VIDEOGRAPHER", "MODEL"] as CreatorType[],
        buyNowAllowed: true,
        rfqAllowed: true,
        sellingEnabled: true,
    },
    BD: {
        allowedSupplierTypes: ["FACTORY", "WHOLESALER", "CREATOR"] as SupplierType[],
        allowedCreatorTypes: ["PHOTOGRAPHER", "VIDEOGRAPHER", "MODEL"] as CreatorType[],
        buyNowAllowed: true,
        rfqAllowed: true,
        sellingEnabled: true,
    },
    GLOBAL: {
        allowedSupplierTypes: ["CREATOR"] as SupplierType[],
        allowedCreatorTypes: ["GRAPHIC_DESIGNER", "MOCK_DESIGNER"] as CreatorType[],
        buyNowAllowed: true,
        rfqAllowed: false,
        sellingEnabled: false,
    },
};

/**
 * Check if creator type is digital
 */
export function isDigitalCreator(type: CreatorType): boolean {
    return type === "GRAPHIC_DESIGNER" || type === "MOCK_DESIGNER";
}

/**
 * Check if creator type is local
 */
export function isLocalCreator(type: CreatorType): boolean {
    return type === "PHOTOGRAPHER" || type === "VIDEOGRAPHER" || type === "MODEL";
}
