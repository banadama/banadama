export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";


export async function POST(req: Request) {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const endpoint = String(body.endpoint || "");
    if (!endpoint) return NextResponse.json({ ok: false, error: "Missing endpoint" }, { status: 400 });

    await db.query(`DELETE FROM push_subscriptions WHERE account_id=$1 AND endpoint=$2`, [me.id, endpoint]);
    return NextResponse.json({ ok: true });
}
