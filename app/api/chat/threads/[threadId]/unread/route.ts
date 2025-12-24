export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { requireRole, getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";


export async function GET(req: Request, { params }: { params: { id: string } }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const role = me.role;
  if (role !== "BUYER" && role !== "OPS" && role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  // Ensure thread is a dispute thread
  const t = (await db.query(`SELECT id, dispute_id AS "disputeId" FROM chat_threads WHERE id=$1`, [params.id]))?.[0];
  if (!t) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  if (!t.disputeId) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  // If BUYER, ensure they own the dispute
  if (role === "BUYER") {
    const owns = (await db.query(
      `SELECT 1
         FROM creator_disputes d
         JOIN creator_orders o ON o.id = d.order_id
         WHERE d.id=$1 AND o.buyer_account_id=$2`,
      [t.disputeId, me.id]
    ))?.[0];

    if (!owns) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const row = (await db.query(
    `
    SELECT COUNT(m.id)::int AS unread
    FROM chat_messages m
    LEFT JOIN chat_thread_reads r
      ON r.thread_id = $1 AND r.account_id = $2
    WHERE m.thread_id = $1
      AND m.created_at > COALESCE(r.last_read_at, '1970-01-01'::timestamptz)
      AND m.sender_account_id <> $2
    `,
    [params.id, me.id]
  ))?.[0];

  return NextResponse.json({ ok: true, data: { unread: row?.unread ?? 0 } });
}
