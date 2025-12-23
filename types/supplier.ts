// Supplier and Product Types

export type SupplierType = "FACTORY" | "WHOLESALER";

export interface Supplier {
    id: string;
    userId: string;
    type: SupplierType;
    companyName: string;
    displayName: string;
    logo?: string;
    tagline?: string;
    description?: string;

    // Location
    country: string;
    city?: string;
    address?: string;

    // Categories
    mainCategories: string[];

    // Business details
    productionCapacity?: string;
    leadTime?: string; // e.g., "7-14 days"
    minOrderValue?: number;
    supportedCurrencies: string[];
    supportsCredit: boolean; // Bashi through Banadama

    // Trust indicators
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    completedOrders: number;

    // Status
    isActive: boolean;
    isApproved: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface SupplierProduct {
    id: string;
    supplierId: string;

    name: string;
    description?: string;
    images: string[];

    // Pricing
    priceMin: number;
    priceMax: number;
    currency: string;

    // Order details
    minOrderQuantity: number;
    moqUnit: string; // e.g., "pieces", "units", "kg"

    // Categorization
    category: string;
    subCategory?: string;
    tags: string[];

    // Variants
    availableColors?: string[];
    availableSizes?: string[];

    // Status
    isActive: boolean;
    inStock: boolean;

    // Stats
    views: number;
    inquiries: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface SupplierFilter {
    type?: SupplierType;
    country?: string;
    city?: string;
    categories?: string[];
    minRating?: number;
    supportsCredit?: boolean;
    search?: string;
}

export interface ProductFilter {
    category?: string;
    subCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
}

export interface SupplierStats {
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    completedOrders: number;
    averageRating: number;
    reviewCount: number;
    responseTime?: string; // e.g., "< 2 hours"
}

export interface SupplierCertification {
    id: string;
    supplierId: string;
    type: string; // e.g., "ISO 9001", "Fair Trade"
    issuer: string;
    issuedAt: Date;
    expiresAt?: Date;
    documentUrl?: string;
}

export interface SupplierReview {
    id: string;
    supplierId: string;
    buyerId: string;
    buyerName: string;
    rating: number;
    comment?: string;
    orderId?: string;
    createdAt: Date;
}

export interface SavedSupplier {
    id: string;
    buyerId: string;
    supplierId: string;
    notes?: string;
    createdAt: Date;
}
