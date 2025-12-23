import { apiGet, apiPost } from "@/lib/api";

export async function getCreatorListing(id: string) {
    try {
        const res = await apiGet<any>(`/api/creators/listings/${id}`);
        return res?.listing || res;
    } catch (e) {
        return null;
    }
}

export async function createCreatorOrder(payload: any) {
    return apiPost<any>("/api/buyer/creator-orders", payload);
}

export async function getCreatorOrdersBuyer() {
    try {
        const res = await apiGet<any>("/api/buyer/creator-orders");
        return res?.orders || [];
    } catch (e) {
        return [];
    }
}

export async function getCreatorOrder(id: string) {
    try {
        const res = await apiGet<any>(`/api/buyer/creator-orders/${id}`);
        return res?.order || res;
    } catch (e) {
        return null;
    }
}

export async function payCreatorOrder(id: string) {
    return apiPost(`/api/buyer/creator-orders/${id}/pay`, {});
}

export async function confirmCreatorOrder(id: string) {
    return apiPost(`/api/buyer/creator-orders/${id}/confirm`, {});
}

export async function getCreatorDeliveries(id: string) {
    try {
        const res = await apiGet<any>(`/api/buyer/creator-orders/${id}/deliveries`);
        return res?.deliveries || [];
    } catch (e) {
        return [];
    }
}
