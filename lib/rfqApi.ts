/**
 * RFQ API Helper
 * 
 * Uses canonical /api/rfq endpoints.
 */

import { apiGet, apiPost } from "./api";

/**
 * List RFQs - GET /api/rfq
 */
export async function listRfqs<T = any>(): Promise<T> {
    return await apiGet<T>("/api/rfq");
}

/**
 * Create RFQ - POST /api/rfq
 */
export async function createRfq<T = any>(body: unknown): Promise<T> {
    return await apiPost<T>("/api/rfq", body);
}

/**
 * Get RFQ by ID - GET /api/rfq/[id]
 */
export async function getRfq<T = any>(id: string): Promise<T> {
    return await apiGet<T>(`/api/rfq/${id}`);
}

/**
 * Confirm RFQ - POST /api/rfq/[id]/confirm
 */
export async function confirmRfq<T = any>(id: string, body?: unknown): Promise<T> {
    return await apiPost<T>(`/api/rfq/${id}/confirm`, body || {});
}
