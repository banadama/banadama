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
        // Skip database query in development if database is not accessible
        if (process.env.NODE_ENV === 'development') {
            // Return empty listings in dev mode when database is unreachable
            listings = [];
            console.log('Skipping database query in development mode (database not accessible)');
        } else {
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
        }
    } catch (error) {
        console.error("Error fetching creator listings:", error);
        listings = [];
    }

    return (
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh', paddingTop: '2rem' }}>
            {/* ============ HEADER ============ */}
            <div className="bd-container" style={{ paddingBottom: '2rem' }}>
                <div style={{ 
                    background: 'linear-gradient(135deg, #2b3d2d 0%, #1f2a20 100%)',
                    color: 'white',
                    padding: '4rem 2rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        marginBottom: '1rem',
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em'
                    }}>
                        Discover Creative <span style={{ color: '#5bc5cf' }}>Talents & Services</span>
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#d1d5db',
                        marginBottom: 0,
                        lineHeight: 1.6,
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}>
                        Browse digital products from creators worldwide or find local services in your region
                    </p>
                </div>
            </div>

            {/* ============ MAIN CONTENT ============ */}
            <div className="bd-container" style={{ display: "grid", gap: 24, padding: "40px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 950, fontSize: 32, color: 'white' }}>Filter by Type</div>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>Digital products (global) + Local services (NG/BD)</div>
                </div>

                <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 10, flexWrap: "wrap", background: "rgba(255,255,255,0.95)" }}>
                    <a className={`bd-btn ${type === "DIGITAL" ? "bd-btn-primary" : ""}`} href="/creators?type=DIGITAL" style={{ background: type === "DIGITAL" ? '#5bc5cf' : 'white', color: type === "DIGITAL" ? 'white' : '#333', border: '2px solid #5bc5cf', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}>Digital Assets</a>
                    <a className={`bd-btn ${type === "LOCAL_SERVICE" && country === "NG" ? "bd-btn-primary" : ""}`} href="/creators?type=LOCAL_SERVICE&country=NG" style={{ background: type === "LOCAL_SERVICE" && country === "NG" ? '#5bc5cf' : 'white', color: type === "LOCAL_SERVICE" && country === "NG" ? 'white' : '#333', border: '2px solid #5bc5cf', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}>Local (Nigeria)</a>
                    <a className={`bd-btn ${type === "LOCAL_SERVICE" && country === "BD" ? "bd-btn-primary" : ""}`} href="/creators?type=LOCAL_SERVICE&country=BD" style={{ background: type === "LOCAL_SERVICE" && country === "BD" ? '#5bc5cf' : 'white', color: type === "LOCAL_SERVICE" && country === "BD" ? 'white' : '#333', border: '2px solid #5bc5cf', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}>Local (Bangladesh)</a>
                </div>

                {type === "LOCAL_SERVICE" ? (
                    <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 10, background: "rgba(255,255,255,0.95)" }}>
                        <div style={{ fontWeight: 950, color: '#2b3d2d' }}>Near Me (Local services)</div>

                        <div style={{ color: "#666", fontSize: 13 }}>
                            Showing only creators in {country || "NG"} (country locked). Use filters above to change country.
                        </div>
                    </div>
                ) : null}

            {listings.length === 0 ? (
                <div className="bd-card bd-card-pad" style={{ textAlign: "center", color: "#666", padding: "80px 0", background: "rgba(255,255,255,0.95)" }}>
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
        </div>
    );
}
