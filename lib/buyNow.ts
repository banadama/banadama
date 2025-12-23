// lib/buyNow.ts - Buy Now entry logic
import { apiPost } from "@/lib/api";

/**
 * Buy Now Entry:
 * - creates an order draft (or cart checkout intent)
 * - returns orderId
 *
 * NOTE: update endpoint/path to match your backend canonical route.
 */
export async function createBuyNowOrder(productId: string, qty: number) {
    // Canonical: POST /api/orders/buy-now
    // Creates an order draft and returns the orderId
    const res = await apiPost("/api/orders/buy-now", { productId, qty });
    return res as { orderId: string };
}
