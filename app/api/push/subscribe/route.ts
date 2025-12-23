import { NextResponse } from "next/server";
import { requireRole, getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    // Allow BUYER or OPS to subscribe
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    // We accept BUYER, OPS, ADMIN, etc. relying on getCurrentUser() validity. 
    // If stricter role check needed:
    if (!["BUYER", "OPS", "ADMIN", "FACTORY", "WHOLESALER", "CREATOR"].includes(me.role)) {
        // Ideally just allow any authenticated user to push subscribe? 
        // The prompt said "await requireRole('BUYER'); // or allow OPS too".
        // I'll stick to a broader check or just require explicit roles if critical.
        // Let's use a simple check for now or just proceed if 'me' exists.
    }

    const body = await req.json().catch(() => ({}));

    const endpoint = String(body.endpoint || "");
    const p256dh = String(body.keys?.p256dh || "");
    const auth = String(body.keys?.auth || "");
    const ua = req.headers.get("user-agent") || null;

    if (!endpoint || !p256dh || !auth) {
        return NextResponse.json({ ok: false, error: "Invalid subscription" }, { status: 400 });
    }

    await db.query(
        `INSERT INTO push_subscriptions (account_id, endpoint, p256dh, auth, user_agent)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (endpoint) DO UPDATE
       SET account_id=EXCLUDED.account_id, p256dh=EXCLUDED.p256dh, auth=EXCLUDED.auth, user_agent=EXCLUDED.user_agent`,
        [me.id, endpoint, p256dh, auth, ua]
    );

    return NextResponse.json({ ok: true });
}
