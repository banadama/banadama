import { db } from "@/lib/db";
import { CreatorListingCard } from "@/components/creators/CreatorListingCard";

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

export default async function CreatorsHub({ searchParams }: { searchParams: Promise<any> }) {
    const params = await searchParams;

    const type = typeof params?.type === "string" ? params.type.toUpperCase() : "DIGITAL";
    const country = typeof params?.country === "string" ? params.country.toUpperCase() : "";
    const state = safe(typeof params?.state === "string" ? params.state : null);
    const city = safe(typeof params?.city === "string" ? params.city : null);
    const category = safe(typeof params?.category === "string" ? params.category.toUpperCase() : null);
    const q = safe(typeof params?.q === "string" ? params.q : null);

    const page = toInt(typeof params?.page === "string" ? params.page : null, 1);
    const limit = clamp(toInt(typeof params?.limit === "string" ? params.limit : null, 24), 1, 60);
    const offset = (page - 1) * limit;

    let listings: any[] = [];

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
                type === "LOCAL_SERVICE" ? (country || "NG") : null,
                category,
                state,
                city,
                q,
                limit,
                offset,
            ]
        );

        listings = (rows ?? []).map(({ total: _t, hasBlueTick, hasGreenTick, ...rest }: any) => ({
            ...rest,
            creatorTick: hasBlueTick ? "BLUE_TICK" : hasGreenTick ? "GREEN_TICK" : "NONE",
        }));
    } catch (error) {
        console.error("Error fetching creator listings:", error);
        listings = [];
    }

    return (
        <div className="bd-container" style={{ display: "grid", gap: 24, padding: "40px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
                <div style={{ fontWeight: 950, fontSize: 32 }}>Creators Hub</div>
                <div style={{ color: "var(--bd-muted)", fontSize: 16 }}>Digital products (global) + Local services (NG/BD)</div>
            </div>

            <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 10, flexWrap: "wrap", background: "var(--bd-muted-bg)" }}>
                <a className={`bd-btn ${type === "DIGITAL" ? "bd-btn-primary" : ""}`} href="/creators?type=DIGITAL">Digital Assets</a>
                <a className={`bd-btn ${type === "LOCAL_SERVICE" && country === "NG" ? "bd-btn-primary" : ""}`} href="/creators?type=LOCAL_SERVICE&country=NG">Local (Nigeria)</a>
                <a className={`bd-btn ${type === "LOCAL_SERVICE" && country === "BD" ? "bd-btn-primary" : ""}`} href="/creators?type=LOCAL_SERVICE&country=BD">Local (Bangladesh)</a>
            </div>

            {type === "LOCAL_SERVICE" ? (
                <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 10 }}>
                    <div style={{ fontWeight: 950 }}>Near Me (Local services)</div>

                    <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>
                        Showing only creators in {country || "NG"} (country locked). Use filters above to change country.
                    </div>
                </div>
            ) : null}

            {listings.length === 0 ? (
                <div className="bd-card bd-card-pad" style={{ textAlign: "center", color: "var(--bd-muted)", padding: "80px 0" }}>
                    No listings found in this category.
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                    {listings.map((l: any) => (
                        <CreatorListingCard key={l.id} listing={l} href={`/creators/listings/${l.id}`} />
                    ))}
                </div>
            )}
        </div>
    );
}
