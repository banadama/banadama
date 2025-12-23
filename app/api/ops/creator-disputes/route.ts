import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const me = await requireRole("OPS");
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "OPEN").toUpperCase();

    const rows = await db.query(
        `
        SELECT
            d.id,
            d.order_id AS "orderId",
            d.status,
            d.reason,
            d.created_at AS "createdAt",
            d.assigned_ops_account_id AS "assignedOpsId",
            COALESCE(un.unread, 0)::int AS "unread"
        FROM creator_disputes d
        LEFT JOIN chat_threads t ON t.dispute_id = d.id
        LEFT JOIN LATERAL (
            SELECT COUNT(m.id)::int AS unread
            FROM chat_messages m
            LEFT JOIN chat_thread_reads r
                ON r.thread_id = t.id AND r.account_id = $1
            WHERE m.thread_id = t.id
                AND m.created_at > COALESCE(r.last_read_at, '1970-01-01'::timestamptz)
                AND m.sender_account_id <> $1
        ) un ON TRUE
        WHERE ($2::text IS NULL OR d.status=$2::text)
        ORDER BY d.created_at DESC
        LIMIT 200
        `,
        [me.id, status || null]
    );

    return NextResponse.json({ ok: true, data: { disputes: rows ?? [] } });
}
