export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { db } from "@/lib/db";


function toInt(v: string | null, def: number) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : def;
}
function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}
function safe(v: string | null) {
    const t = v?.trim();
    return t ? t : null;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const type = (searchParams.get("type") || "").toUpperCase(); // DIGITAL|LOCAL_SERVICE
    const country = (searchParams.get("country") || "").toUpperCase(); // NG|BD
    const state = safe(searchParams.get("state"));
    const city = safe(searchParams.get("city"));
    const category = safe(searchParams.get("category"))?.toUpperCase() ?? null;
    const q = safe(searchParams.get("q"));

    const page = toInt(searchParams.get("page"), 1);
    const limit = clamp(toInt(searchParams.get("limit"), 24), 1, 60);
    const offset = (page - 1) * limit;

    if (type !== "DIGITAL" && type !== "LOCAL_SERVICE") {
        return NextResponse.json({ ok: false, error: "type is required" }, { status: 400 });
    }

    // SAME-COUNTRY ONLY RULE (Local services must be NG/BD and must match)
    if (type === "LOCAL_SERVICE") {
        if (country !== "NG" && country !== "BD") {
            return NextResponse.json({ ok: false, error: "country=NG|BD required for LOCAL_SERVICE" }, { status: 400 });
        }
    }

    try {
        // Build query
        const rows = await db.query(
      /* sql */ `
      WITH base AS (
        SELECT
          cl.id,
          cl.type,
          cl.category,
          cl.title,
          cl.description,
          cl.price_type AS "priceType",
          cl.currency,
          cl.price,
          cl.media,
          cl.country,
          cl.state,
          cl.city,
          cl.status,
          cl.created_at AS "createdAt",
          COALESCE(cp.display_name,'Creator') AS "creatorName",
          cp.has_blue_tick AS "hasBlueTick",
          cp.has_green_tick AS "hasGreenTick"
        FROM creator_listings cl
        JOIN creator_profiles cp ON cp.id = cl.creator_id
        WHERE cl.status = 'ACTIVE'
          AND cl.type = $1::text
          AND (
            $1::text = 'DIGITAL'
            OR (cl.country = $2::text)   -- same country only
          )
          AND ($3::text IS NULL OR cl.category = $3::text)
          AND ($4::text IS NULL OR cl.state = $4::text)
          AND ($5::text IS NULL OR cl.city = $5::text)
          AND (
            $6::text IS NULL OR
            (cl.title ILIKE ('%'||$6::text||'%')) OR
            (cl.description ILIKE ('%'||$6::text||'%')) OR
            (COALESCE(cp.display_name,'') ILIKE ('%'||$6::text||'%'))
          )
      ),
      counted AS (SELECT COUNT(*)::int AS total FROM base)
      SELECT (SELECT total FROM counted) AS total, b.*
      FROM base b
      ORDER BY b."createdAt" DESC
      LIMIT $7 OFFSET $8
      `,
            [
                type,
                type === "LOCAL_SERVICE" ? country : null,
                category,
                state,
                city,
                q,
                limit,
                offset,
            ]
        );

        const total = rows?.length ? Number(rows[0].total) : 0;
        const listings = (rows ?? []).map(({ total: _t, hasBlueTick, hasGreenTick, ...rest }: any) => ({
            ...rest,
            creatorTick: hasBlueTick ? "BLUE_TICK" : hasGreenTick ? "GREEN_TICK" : "NONE",
        }));

        return NextResponse.json({
            ok: true,
            data: { listings, page, limit, total, hasMore: offset + listings.length < total },
        });
    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
