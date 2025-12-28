// lib/queries/marketplace.ts
// Product marketplace queries - Products only (NO creators)

import { db } from '@/lib/db';

export interface ProductFilters {
  category?: string;
  region?: 'NG' | 'BD' | 'GLOBAL';
  logistics?: 'local' | 'international';
  search?: string;
  page?: number;
  limit?: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  image?: string;
  supplier: {
    id: string;
    name: string;
    rating: number;
  };
  logistics?: string;
  region?: string;
  createdAt: string;
}

export interface ProductsResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Get marketplace products (NOT creators)
 * Filters: category, region, logistics, search
 * Excludes creator listings completely
 */
export async function getMarketplaceProducts(filters: ProductFilters): Promise<ProductsResult> {
  const {
    category,
    region = 'GLOBAL',
    logistics,
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
      console.log('[Marketplace Query] Development mode - returning empty products');
      return {
        products: [],
        total: 0,
        page: pageNum,
        limit: limitNum,
        hasMore: false,
      };
    }

    // Build query for products table
    // Note: Assumes products table has:
    // - id, title, description, category, price, currency, image
    // - supplier_id (FK to supplier profile)
    // - logistics (local | international)
    // - region (NG | BD | GLOBAL or null)
    // - status (ACTIVE, INACTIVE, DRAFT)
    // - created_at

    let query = `
      WITH base AS (
        SELECT
          p.id,
          p.title,
          p.description,
          p.category,
          p.price,
          p.currency,
          p.image,
          p.logistics,
          COALESCE(p.region, 'GLOBAL') as region,
          p.created_at,
          sp.id as supplier_id,
          sp.company_name as supplier_name,
          COALESCE(sp.rating, 0) as supplier_rating
        FROM products p
        LEFT JOIN supplier_profiles sp ON p.supplier_id = sp.id
        WHERE p.status = 'ACTIVE'
          -- Enforce canonical listing type: treat NULL as 'product'
          AND COALESCE(p.listing_type, 'product') = 'product'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Category filter
    if (category) {
      query += ` AND p.category = $${paramIndex}::text`;
      params.push(category);
      paramIndex++;
    }

    // Region filter
    if (region !== 'GLOBAL') {
      // For regional domains: show region-specific + international products
      query += ` AND (p.region = $${paramIndex}::text OR p.logistics = 'international')`;
      params.push(region);
      paramIndex++;
    }

    // Logistics filter
    if (logistics) {
      query += ` AND p.logistics = $${paramIndex}::text`;
      params.push(logistics);
      paramIndex++;
    }

    // Search filter
    if (search) {
      const searchPattern = `%${search}%`;
      query += ` AND (
        p.title ILIKE $${paramIndex}::text OR
        p.description ILIKE $${paramIndex}::text OR
        sp.company_name ILIKE $${paramIndex}::text
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
        products: [],
        total: 0,
        page: pageNum,
        limit: limitNum,
        hasMore: false,
      };
    }

    const firstRow = results[0];
    const total = firstRow.total || 0;

    const products: Product[] = results.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      price: row.price,
      currency: row.currency,
      image: row.image,
      logistics: row.logistics,
      region: row.region,
      supplier: {
        id: row.supplier_id,
        name: row.supplier_name || 'Unknown Supplier',
        rating: row.supplier_rating || 0,
      },
      createdAt: row.created_at,
    }));

    return {
      products,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: offset + limitNum < total,
    };
  } catch (error) {
    console.error('[getMarketplaceProducts] Error:', error);
    // In case of database error, return empty results instead of crashing
    return {
      products: [],
      total: 0,
      page: pageNum,
      limit: limitNum,
      hasMore: false,
    };
  }
}

/**
 * Get marketplace categories (Industrial, Retail, Supplies)
 * These are product categories ONLY, not creator types
 */
export async function getMarketplaceCategories(): Promise<string[]> {
  const categories = ['Industrial', 'Retail', 'Supplies'];
  // If you need to fetch from DB:
  // return await db.product_categories.findMany()
  return categories;
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    const query = `
      SELECT
        p.id,
        p.title,
        p.description,
        p.category,
        p.price,
        p.currency,
        p.image,
        p.logistics,
        COALESCE(p.region, 'GLOBAL') as region,
        p.created_at,
        sp.id as supplier_id,
        sp.company_name as supplier_name,
        COALESCE(sp.rating, 0) as supplier_rating
      FROM products p
      LEFT JOIN supplier_profiles sp ON p.supplier_id = sp.id
      WHERE p.id = $1::uuid AND p.status = 'ACTIVE'
        AND COALESCE(p.listing_type, 'product') = 'product'
    `;

    const results = await (db as any).query(query, [id]);

    if (!results || results.length === 0) return null;

    const row = results[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      price: row.price,
      currency: row.currency,
      image: row.image,
      logistics: row.logistics,
      region: row.region,
      supplier: {
        id: row.supplier_id,
        name: row.supplier_name || 'Unknown Supplier',
        rating: row.supplier_rating || 0,
      },
      createdAt: row.created_at,
    };
  } catch (error) {
    console.error('[getProductById] Error:', error);
    return null;
  }
}
