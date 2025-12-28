// lib/queries/creators.ts
// Creator listings queries - Creators only (NO products)

import { db } from '@/lib/db';

export type CreatorType = 'DIGITAL' | 'LOCAL_SERVICE';
export type CreatorSubType = 
  | 'GRAPHIC_DESIGNER' 
  | 'MOCK_DESIGNER' 
  | 'AI_AGENT_DEV' 
  | 'MODELLING' 
  | 'PHOTOGRAPHER' 
  | 'VIDEOGRAPHER';

export interface CreatorFilters {
  type?: CreatorType;
  creatorType?: CreatorSubType;
  region?: 'NG' | 'BD' | 'GLOBAL';
  country?: string;
  state?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreatorListing {
  id: string;
  title: string;
  description: string;
  type: CreatorType;
  creatorType: CreatorSubType;
  price: number;
  priceType: 'FIXED' | 'STARTING_FROM' | 'QUOTED';
  currency: string;
  media?: string[];
  creator: {
    id: string;
    name: string;
    hasBlueTick: boolean;
    hasGreenTick: boolean;
  };
  location?: {
    country: string;
    state?: string;
    city?: string;
  };
  createdAt: string;
}

export interface CreatorsResult {
  listings: CreatorListing[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Get creator listings (NOT products)
 * Filters: type (DIGITAL/LOCAL_SERVICE), creatorType, region, search
 * Only queries creator_listings table
 */
export async function getCreatorListings(filters: CreatorFilters): Promise<CreatorsResult> {
  const {
    type,
    creatorType,
    region = 'GLOBAL',
    country,
    state,
    city,
    search,
    page = 1,
    limit = 24,
  } = filters;

  // Validate pagination
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(Math.max(1, limit), 100);
  const offset = (pageNum - 1) * limitNum;

  try {
    // Skip database query in development if unreachable
    if (process.env.NODE_ENV === 'development') {
      console.log('[Creators Query] Development mode - returning empty listings');
      return {
        listings: [],
        total: 0,
        page: pageNum,
        limit: limitNum,
        hasMore: false,
      };
    }

    // Build query for creator_listings table (already exists in schema)
    // Note: Assumes creator_listings has:
    // - id, title, description, type (DIGITAL | LOCAL_SERVICE), creator_type enum
    // - price, price_type, currency, media (JSON array)
    // - creator_id (FK to creator_profiles)
    // - country, state, city, status
    // - created_at

    let query = `
      WITH base AS (
        SELECT
          cl.id,
          cl.title,
          cl.description,
          cl.type,
          cl.creator_type,
          cl.price,
          cl.price_type,
          cl.currency,
          cl.media,
          cl.country,
          cl.state,
          cl.city,
          cl.created_at,
          cp.id as creator_id,
          cp.display_name as creator_name,
          cp.has_blue_tick,
          cp.has_green_tick
        FROM creator_listings cl
        JOIN creator_profiles cp ON cl.creator_id = cp.id
        WHERE cl.status = 'ACTIVE'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Type filter (DIGITAL or LOCAL_SERVICE)
    if (type) {
      query += ` AND cl.type = $${paramIndex}::text`;
      params.push(type);
      paramIndex++;
    }

    // Creator type filter (GRAPHIC_DESIGNER, PHOTOGRAPHER, etc.)
    if (creatorType) {
      query += ` AND cl.creator_type = $${paramIndex}::text`;
      params.push(creatorType);
      paramIndex++;
    }

    // Region filtering logic:
    // - DIGITAL creators: visible globally
    // - LOCAL_SERVICE creators: visible only in their region
    if (region !== 'GLOBAL') {
      // For regional domains (NG, BD): show only local services in that region + digital global
      query += ` AND (
        cl.type = 'DIGITAL'
        OR (cl.type = 'LOCAL_SERVICE' AND cl.country = $${paramIndex}::text)
      )`;
      params.push(region);
      paramIndex++;
    } else {
      // Global domain: show DIGITAL worldwide, LOCAL_SERVICE if country specified
      if (country) {
        query += ` AND (cl.type = 'DIGITAL' OR cl.country = $${paramIndex}::text)`;
        params.push(country);
        paramIndex++;
      } else {
        // Default: show DIGITAL creators on global domain
        query += ` AND cl.type = 'DIGITAL'`;
      }
    }

    // State filter (only if specified)
    if (state) {
      query += ` AND cl.state = $${paramIndex}::text`;
      params.push(state);
      paramIndex++;
    }

    // City filter (only if specified)
    if (city) {
      query += ` AND cl.city = $${paramIndex}::text`;
      params.push(city);
      paramIndex++;
    }

    // Search filter
    if (search) {
      const searchPattern = `%${search}%`;
      query += ` AND (
        cl.title ILIKE $${paramIndex}::text OR
        cl.description ILIKE $${paramIndex}::text OR
        cp.display_name ILIKE $${paramIndex}::text
      )`;
      params.push(searchPattern);
      paramIndex++;
    }

    query += `
      ),
      counted AS (
        SELECT COUNT(*)::int as total FROM base
      )
      SELECT (SELECT total FROM counted) as total, b.*
      FROM base b
      ORDER BY b.created_at DESC
      LIMIT $${paramIndex}::int OFFSET $${paramIndex + 1}::int
    `;
    params.push(limitNum, offset);

    const results = await (db as any).query(query, params);

    if (!results || results.length === 0) {
      return {
        listings: [],
        total: 0,
        page: pageNum,
        limit: limitNum,
        hasMore: false,
      };
    }

    const firstRow = results[0];
    const total = firstRow.total || 0;

    const listings: CreatorListing[] = results.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      creatorType: row.creator_type,
      price: row.price,
      priceType: row.price_type,
      currency: row.currency,
      media: row.media ? (Array.isArray(row.media) ? row.media : JSON.parse(row.media)) : [],
      creator: {
        id: row.creator_id,
        name: row.creator_name || 'Creator',
        hasBlueTick: row.has_blue_tick || false,
        hasGreenTick: row.has_green_tick || false,
      },
      location: {
        country: row.country || '',
        state: row.state || undefined,
        city: row.city || undefined,
      },
      createdAt: row.created_at,
    }));

    return {
      listings,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: offset + limitNum < total,
    };
  } catch (error) {
    console.error('[getCreatorListings] Error:', error);
    // In case of database error, return empty results instead of crashing
    return {
      listings: [],
      total: 0,
      page: pageNum,
      limit: limitNum,
      hasMore: false,
    };
  }
}

/**
 * Get creator types for filtering
 */
export async function getCreatorTypes(): Promise<CreatorSubType[]> {
  return [
    'GRAPHIC_DESIGNER',
    'MOCK_DESIGNER',
    'AI_AGENT_DEV',
    'MODELLING',
    'PHOTOGRAPHER',
    'VIDEOGRAPHER',
  ];
}

/**
 * Get a single creator listing by ID
 */
export async function getCreatorListingById(id: string): Promise<CreatorListing | null> {
  try {
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    const query = `
      SELECT
        cl.id,
        cl.title,
        cl.description,
        cl.type,
        cl.creator_type,
        cl.price,
        cl.price_type,
        cl.currency,
        cl.media,
        cl.country,
        cl.state,
        cl.city,
        cl.created_at,
        cp.id as creator_id,
        cp.display_name as creator_name,
        cp.has_blue_tick,
        cp.has_green_tick
      FROM creator_listings cl
      JOIN creator_profiles cp ON cl.creator_id = cp.id
      WHERE cl.id = $1::uuid AND cl.status = 'ACTIVE'
    `;

    const results = await (db as any).query(query, [id]);

    if (!results || results.length === 0) return null;

    const row = results[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      creatorType: row.creator_type,
      price: row.price,
      priceType: row.price_type,
      currency: row.currency,
      media: row.media ? (Array.isArray(row.media) ? row.media : JSON.parse(row.media)) : [],
      creator: {
        id: row.creator_id,
        name: row.creator_name || 'Creator',
        hasBlueTick: row.has_blue_tick || false,
        hasGreenTick: row.has_green_tick || false,
      },
      location: {
        country: row.country || '',
        state: row.state || undefined,
        city: row.city || undefined,
      },
      createdAt: row.created_at,
    };
  } catch (error) {
    console.error('[getCreatorListingById] Error:', error);
    return null;
  }
}
