import { NextResponse } from "next/server";
import { requireRole, getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    await requireRole("BUYER");
    const me = await getCurrentUser();
    const body = await req.json().catch(() => ({}));

    const reason = String(body.reason || "").toUpperCase();
    const details = body.details ? String(body.details) : null;

    const allowed = new Set(["NOT_AS_DESCRIBED", "LATE_DELIVERY", "INCOMPLETE", "QUALITY_ISSUE", "OTHER"]);
    if (!allowed.has(reason)) return NextResponse.json({ ok: false, error: "Invalid reason" }, { status: 400 });

    // Load order and verify buyer owns it
    const rows = await db.query(
        `SELECT id, buyer_account_id AS "buyerId", status, escrow_id AS "escrowId"
     FROM creator_orders WHERE id=$1`,
        [params.id]
    );
    const order = rows?.[0];
    if (!order) return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    if (order.buyerId !== me?.id) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

    // Policy: allow dispute only if escrow locked and not already confirmed
    const canOpen = ["PAID_ESCROW", "IN_PROGRESS", "DELIVERED"].includes(order.status);
    if (!canOpen) return NextResponse.json({ ok: false, error: "Dispute not allowed for this status" }, { status: 409 });

    // Create dispute (unique per order)
    const created = await db.query(
        `INSERT INTO creator_disputes (order_id, opened_by_account_id, reason, details, status)
     VALUES ($1,$2,$3,$4,'OPEN')
     ON CONFLICT (order_id) DO NOTHING
     RETURNING id, order_id AS "orderId", status, reason, details, created_at AS "createdAt"`,
        [order.id, me?.id, reason, details]
    );
    const dispute = created?.[0];
    if (!dispute) return NextResponse.json({ ok: false, error: "Dispute already exists" }, { status: 409 });

    // Mark order disputed + keep escrow locked (do not release)
    await db.query(`UPDATE creator_orders SET status='DISPUTED', updated_at=now() WHERE id=$1`, [order.id]);

    await db.query(
        `INSERT INTO creator_dispute_events (dispute_id, actor_account_id, type, note)
     VALUES ($1,$2,'OPENED',$3)`,
        [dispute.id, me?.id, details]
    );

    return NextResponse.json({ ok: true, data: { dispute } });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await requireRole("BUYER");
    const me = await getCurrentUser();

    const orderRows = await db.query(
        `SELECT id, buyer_account_id AS "buyerId" FROM creator_orders WHERE id=$1`,
        [params.id]
    );
    const order = orderRows?.[0];
    if (!order) return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    if (order.buyerId !== me?.id) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

    const dRows = await db.query(
        `SELECT * FROM creator_disputes WHERE order_id=$1`,
        [params.id]
    );
    const dispute = dRows?.[0] ?? null;
    if (!dispute) return NextResponse.json({ ok: true, data: { dispute: null, events: [] } });

    const events = await db.query(
        `SELECT id, type, note, meta, created_at AS "createdAt"
     FROM creator_dispute_events WHERE dispute_id=$1 ORDER BY created_at ASC`,
        [dispute.id]
    );

    return NextResponse.json({ ok: true, data: { dispute, events } });
}
