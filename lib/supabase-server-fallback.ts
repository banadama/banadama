// src/lib/supabase-server-fallback.ts
// Alternative fallback: direct supabase-js
import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
}
