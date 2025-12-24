export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { requireRole, getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";


/**
 * POST /api/creator/orders/[id]/dispute/thread
 * Gets or creates the chat thread for a dispute.
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
    await requireRole("BUYER");
    const me = await getCurrentUser();

    // 1. Verify dispute exists and belongs to this order/buyer
    const dRows = await db.query(
        `SELECT d.id, d.status, o.buyer_account_id AS "buyerId"
         FROM creator_disputes d
         JOIN creator_orders o ON o.id = d.order_id
         WHERE o.id = $1`,
        [params.id]
    );

    const dispute = dRows?.[0];
    if (!dispute) return NextResponse.json({ ok: false, error: "Dispute not found" }, { status: 404 });
    if (dispute.buyerId !== me?.id) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

    // 2. Check if thread already exists for this dispute
    let thread = (await db.query(
        `SELECT id FROM chat_threads WHERE dispute_id = $1 LIMIT 1`,
        [dispute.id]
    ))?.[0];

    if (!thread) {
        // 3. Create a new thread for the dispute
        const created = await db.query(
            `INSERT INTO chat_threads (type, title, dispute_id, created_at, updated_at)
             VALUES ('DISPUTE', $1, $2, now(), now())
             RETURNING id`,
            [`Dispute: Order ${params.id.slice(0, 8)}`, dispute.id]
        );
        thread = created?.[0];

        // 4. Add buyer as participant
        await db.query(
            `INSERT INTO chat_thread_reads (thread_id, account_id, joined_at)
             VALUES ($1, $2, now())`,
            [thread.id, me.id]
        );
    }

    return NextResponse.json({ ok: true, data: { threadId: thread.id } });
}
