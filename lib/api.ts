// lib/api.ts - Typed API Client for Banadama
// All API calls use credentials: 'include' for JWT cookie auth

/**
 * API Error structure
 */
export interface ApiError {
    message: string;
    status: number;
    details?: unknown;
}

/**
 * Convert failed response to ApiError
 */
async function toApiError(res: Response): Promise<ApiError> {
    let message = `HTTP ${res.status}: ${res.statusText}`;
    let details: unknown;

    try {
        const json = await res.json();
        message = json.error || json.message || message;
        details = json;
    } catch {
        // Response is not JSON, use status text
    }

    return {
        message,
        status: res.status,
        details,
    };
}

/**
 * GET request with typed response
 * 
 * @param path - API path (e.g., "/api/users/123")
 * @returns Parsed JSON response
 * @throws ApiError on non-2xx status
 * 
 * @example
 * ```ts
 * const user = await apiGet<User>("/api/users/123");
 * ```
 */
export async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(path, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw await toApiError(res);
    }

    return res.json() as Promise<T>;
}

/**
 * POST request with typed response
 * 
 * @param path - API path
 * @param body - Request body (will be JSON stringified)
 * @returns Parsed JSON response
 * @throws ApiError on non-2xx status
 * 
 * @example
 * ```ts
 * const result = await apiPost<LoginResponse>("/api/auth/login", {
 *   email: "user@example.com",
 *   password: "password123"
 * });
 * ```
 */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(path, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : "{}",
    });

    if (!res.ok) {
        throw await toApiError(res);
    }

    return res.json() as Promise<T>;
}

/**
 * PATCH request with typed response
 * 
 * @param path - API path
 * @param body - Request body (will be JSON stringified)
 * @returns Parsed JSON response
 * @throws ApiError on non-2xx status
 * 
 * @example
 * ```ts
 * const updated = await apiPatch<User>("/api/users/123", {
 *   name: "New Name"
 * });
 * ```
 */
export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(path, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : "{}",
    });

    if (!res.ok) {
        throw await toApiError(res);
    }

    return res.json() as Promise<T>;
}

/**
 * PUT request with typed response
 */
export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(path, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : "{}",
    });

    if (!res.ok) {
        throw await toApiError(res);
    }

    return res.json() as Promise<T>;
}

/**
 * DELETE request with typed response
 */
export async function apiDelete<T>(path: string): Promise<T> {
    const res = await fetch(path, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw await toApiError(res);
    }

    return res.json() as Promise<T>;
}

/**
 * Check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        "status" in error
    );
}
