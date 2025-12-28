// lib/utils/region.ts
// Region detection and utility functions

import { headers } from 'next/headers';

export type Region = 'NG' | 'BD' | 'GLOBAL';

/**
 * Get region from request headers set by middleware
 * Middleware adds 'x-region' header based on domain
 */
export function getRegionFromHeaders(): Region {
  try {
    const headersList = headers();
    const region = headersList.get('x-region') as Region | null;
    return region || 'GLOBAL';
  } catch (error) {
    // If headers() throws (e.g., in some contexts), default to GLOBAL
    return 'GLOBAL';
  }
}

/**
 * Get domain type from request headers
 * Types: 'main', 'supplier', 'regional', 'admin', 'ops'
 */
export function getDomainTypeFromHeaders(): string {
  try {
    const headersList = headers();
    return headersList.get('x-domain-type') || 'main';
  } catch (error) {
    return 'main';
  }
}

/**
 * Check if current domain is regional (NG or BD)
 */
export function isRegionalDomain(): boolean {
  const region = getRegionFromHeaders();
  return region !== 'GLOBAL';
}

/**
 * Get region display name
 */
export function getRegionDisplayName(region: Region): string {
  const names: Record<Region, string> = {
    'NG': '🇳🇬 Nigeria',
    'BD': '🇧🇩 Bangladesh',
    'GLOBAL': '🌍 Global',
  };
  return names[region] || 'Global';
}

/**
 * Get region country code
 */
export function getRegionCountryCode(region: Region): string {
  const codes: Record<Region, string> = {
    'NG': 'NG',
    'BD': 'BD',
    'GLOBAL': 'INT',
  };
  return codes[region];
}
