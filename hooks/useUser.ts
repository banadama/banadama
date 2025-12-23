"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";

interface User {
    id: string;
    email: string;
    role: string;
    supplierProfile?: {
        id: string;
        businessName: string;
    };
    buyerProfile?: {
        id: string;
    };
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const data = await apiGet<any>("/api/auth/me");
                setUser(data.user || data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch user");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading, error };
}
