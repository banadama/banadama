export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { requireRole, getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { releaseCreatorEscrow, refundCreatorEscrow } from "@/lib/escrow";


export async function GET(req: Request, { params }: { params: { id: string } }) {
    await requireRole("OPS");

    const d = (await db.query(`SELECT * FROM creator_disputes WHERE id=$1`, [params.id]))?.[0];
    if (!d) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    const events = await db.query(
        `SELECT id, type, note, meta, created_at AS "createdAt"
     FROM creator_dispute_events WHERE dispute_id=$1 ORDER BY created_at ASC`,
        [params.id]
    );

    return NextResponse.json({ ok: true, data: { dispute: d, events: events ?? [] } });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    await requireRole("OPS");
    const me = await getCurrentUser();
    const body = await req.json().catch(() => ({}));

    const action = String(body.action || "").toUpperCase();

    if (action === "ASSIGN") {
        const opsId = body.opsId ? String(body.opsId) : me?.id;
        await db.query(
            `UPDATE creator_disputes SET assigned_ops_account_id=$2, status='IN_REVIEW', updated_at=now() WHERE id=$1`,
            [params.id, opsId]
        );
        await db.query(
            `INSERT INTO creator_dispute_events (dispute_id, actor_account_id, type, note)
       VALUES ($1,$2,'STATUS_CHANGED',$3)`,
            [params.id, me?.id, "Assigned / In review"]
        );
        return NextResponse.json({ ok: true });
    }

    if (action === "RESOLVE") {
        const resolution = String(body.resolution || "").toUpperCase();
        const note = body.note ? String(body.note) : null;
        const meta = body.meta ?? {};

        const allowed = new Set(["REFUND_BUYER", "PARTIAL_REFUND", "REDELIVER", "RELEASE_PAYOUT", "CANCEL_ORDER"]);
        if (!allowed.has(resolution)) return NextResponse.json({ ok: false, error: "Invalid resolution" }, { status: 400 });

        const d = (await db.query(`SELECT * FROM creator_disputes WHERE id=$1`, [params.id]))?.[0];
        if (!d) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

        // Load order & escrow
        const o = (await db.query(
            `SELECT id, status, escrow_id AS "escrowId"
       FROM creator_orders WHERE id=$1`,
            [d.order_id]
        ))?.[0];

        if (!o) return NextResponse.json({ ok: false, error: "Order missing" }, { status: 404 });

        // Update dispute status
        await db.query(
            `UPDATE creator_disputes SET status='RESOLVED', resolution=$2, updated_at=now() WHERE id=$1`,
            [params.id, resolution]
        );

        await db.query(
            `INSERT INTO creator_dispute_events (dispute_id, actor_account_id, type, note, meta)
       VALUES ($1,$2,'RESOLVED',$3,$4::jsonb)`,
            [params.id, me?.id, note, JSON.stringify({ resolution, ...meta })]
        );

        // ESCROW POLICY HOOKS
        if (resolution === "REDELIVER") {
            await db.query(`UPDATE creator_orders SET status='IN_PROGRESS', updated_at=now() WHERE id=$1`, [o.id]);
        } else if (resolution === "RELEASE_PAYOUT") {
            await db.query(`UPDATE creator_orders SET status='CONFIRMED', updated_at=now() WHERE id=$1`, [o.id]);
            await releaseCreatorEscrow({ orderId: o.id, description: `Payout released via dispute resolution: ${note}` });
        } else if (resolution === "REFUND_BUYER" || resolution === "CANCEL_ORDER") {
            await db.query(`UPDATE creator_orders SET status='CANCELLED', updated_at=now() WHERE id=$1`, [o.id]);
            await refundCreatorEscrow({ orderId: o.id, reason: `Refunded via dispute resolution: ${note}` });
        } else if (resolution === "PARTIAL_REFUND") {
            await db.query(`UPDATE creator_orders SET status='CONFIRMED', updated_at=now() WHERE id=$1`, [o.id]);
            if (meta.refundAmount && meta.refundAmount > 0) {
                // 1. Refund specified amount to buyer
                await refundCreatorEscrow({ orderId: o.id, amount: meta.refundAmount, reason: `Partial refund: ${note}` });

                // 2. Release remaining subtotal to creator (if any)
                // Order: Subtotal 100, Total 110. Refund 40. Creator gets 60.
                const orderData = (await db.query(`SELECT subtotal FROM creator_orders WHERE id=$1`, [o.id]))?.[0];
                const subtotal = Number(orderData?.subtotal || 0);
                const remainingToCreator = Math.max(0, subtotal - meta.refundAmount);

                if (remainingToCreator > 0) {
                    await releaseCreatorEscrow({
                        orderId: o.id,
                        amount: remainingToCreator,
                        description: `Remaining payout after partial refund of ${meta.refundAmount}`
                    });
                }
            } else {
                // If no amount specified, treat as full release? Or error?
                // For now, if no amount, just release everything.
                await releaseCreatorEscrow({ orderId: o.id, description: `Full release (partial refund requested but no amount given): ${note}` });
            }
        }

        return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
