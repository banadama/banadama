/**
 * Domain routing utilities for multi-domain Banadama setup
 */

export type DomainType = 'main' | 'supplier' | 'regional' | 'admin' | 'ops';
export type Region = 'NG' | 'BD' | 'GLOBAL';

/**
 * Get domain type and region from request headers
 * Headers are set by middleware.ts
 */
export function getDomainInfo(headers: Record<string, string> | Headers): {
    type: DomainType;
    region: Region;
} {
    const domainType = (headers instanceof Headers 
        ? headers.get('x-domain-type')
        : headers['x-domain-type']) as DomainType || 'main';
    const region = (headers instanceof Headers 
        ? headers.get('x-region')
        : headers['x-region']) as Region || 'GLOBAL';

    return { type: domainType, region };
}

/**
 * Build query filters based on domain context
 * Used in API routes and server components
 */
export function buildMarketplaceFilters(region: Region) {
    return {
        listingType: 'product', // Only products, not creators
        ...(region !== 'GLOBAL' && { region }),
    };
}

/**
 * Build query filters for creator listings
 */
export function buildCreatorFilters(region?: Region, creatorType?: string) {
    const filters: any = {
        listingType: 'creator',
    };

    // For local services, filter by region
    if (region && region !== 'GLOBAL' && creatorType === 'LOCAL_SERVICE') {
        filters.region = region;
    }

    if (creatorType) {
        filters.type = creatorType;
    }

    return filters;
}

/**
 * Get breadcrumb domain name for UI
 */
export function getDomainLabel(type: DomainType, region?: Region): string {
    if (type === 'supplier') return 'Supplier Hub';
    if (type === 'admin') return 'Admin Panel';
    if (type === 'ops') return 'Operations';
    if (type === 'regional') {
        if (region === 'NG') return 'Banadama Nigeria';
        if (region === 'BD') return 'Banadama Bangladesh';
    }
    return 'Banadama Marketplace';
}

/**
 * Check if current domain allows creator management
 * Suppliers and creators can manage their listings
 */
export function canManageCreatorListings(type: DomainType): boolean {
    return type === 'supplier' || type === 'main';
}

/**
 * Check if current domain is a supplier-specific view
 */
export function isSupplierDomain(type: DomainType): boolean {
    return type === 'supplier';
}

/**
 * Check if current domain is regional
 */
export function isRegionalDomain(type: DomainType): boolean {
    return type === 'regional';
}
