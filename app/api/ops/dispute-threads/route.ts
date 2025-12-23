import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const { user: me, error } = await requireApiRole("OPS");
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "OPEN").toUpperCase(); // OPEN | IN_REVIEW | BOTH
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 50), 1), 200);

    const statusFilter =
        status === "BOTH" ? ["OPEN", "IN_REVIEW"] :
            status === "IN_REVIEW" ? ["IN_REVIEW"] :
                ["OPEN"];

    // Dispute threads only (t.dispute_id not null), join disputes + unread + last message timestamp.
    const rows = await db.query(
        `
    WITH last_msg AS (
      SELECT
        m.thread_id,
        MAX(m.created_at) AS last_message_at
      FROM chat_messages m
      GROUP BY m.thread_id
    ),
    unread AS (
      SELECT
        t.id AS thread_id,
        COUNT(m.id)::int AS unread
      FROM chat_threads t
      JOIN chat_messages m ON m.thread_id = t.id
      LEFT JOIN chat_thread_reads r
        ON r.thread_id = t.id AND r.account_id = $1
      WHERE t.dispute_id IS NOT NULL
        AND m.created_at > COALESCE(r.last_read_at, '1970-01-01'::timestamptz)
        AND m.sender_account_id <> $1
      GROUP BY t.id
    )
    SELECT
      t.id AS "threadId",
      t.dispute_id AS "disputeId",

      d.order_id AS "orderId",
      d.status AS "disputeStatus",
      d.reason AS "reason",
      d.assigned_ops_account_id AS "assignedOpsId",
      d.created_at AS "createdAt",

      COALESCE(u.unread, 0)::int AS "unread",
      lm.last_message_at AS "lastMessageAt"
    FROM chat_threads t
    JOIN creator_disputes d ON d.id = t.dispute_id
    LEFT JOIN last_msg lm ON lm.thread_id = t.id
    LEFT JOIN unread u ON u.thread_id = t.id
    WHERE d.status = ANY($2::text[])
    ORDER BY
      (COALESCE(u.unread, 0) > 0) DESC,
      COALESCE(u.unread, 0) DESC,
      COALESCE(lm.last_message_at, d.created_at) DESC
    LIMIT $3
    `,
        [me.id, statusFilter, limit]
    );

    return NextResponse.json({ ok: true, data: { threads: rows ?? [] } });
}
