import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase env vars");
}

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null;

export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured (missing env vars)" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase shipments error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // simple mapping for frontend
    const shipments = (data ?? []).map((row: any) => ({
      id: row.id as string,
      orderNumber: row.order_id ? String(row.order_id) : "Unknown",
      stage: row.stage as string,
      carrier: row.carrier as string | null,
      trackingNumber: row.tracking_number as string | null,
      eta: row.eta ? new Date(row.eta).toISOString().slice(0, 10) : null,
    }));

    return NextResponse.json({ shipments });
  } catch (err: any) {
    console.error("Shipments API fatal error:", err);
    return NextResponse.json(
      { error: "Failed to load shipments" },
      { status: 500 }
    );
  }
}
