import { NextResponse } from "next/server";
import { prisma, db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";

export async function GET() {
    const { user, error } = await requireApiRole("BUYER");
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const orders = await prisma.creatorOrder.findMany({
            where: { buyerUserId: user.id },
            include: {
                creator: {
                    select: { displayName: true }
                },
                listing: {
                    select: { title: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        const unreadRows = await db.query(
            `
            SELECT
              o.id AS "orderId",
              COUNT(m.id)::int AS "unread"
            FROM creator_orders o
            JOIN creator_disputes d ON d.order_id = o.id
            JOIN chat_threads t ON t.dispute_id = d.id
            LEFT JOIN chat_thread_reads r ON r.thread_id = t.id AND r.account_id = $1
            JOIN chat_messages m ON m.thread_id = t.id
            WHERE o.buyer_account_id = $1
              AND m.created_at > COALESCE(r.last_read_at, '1970-01-01'::timestamptz)
              AND m.sender_account_id <> $1
            GROUP BY o.id
            `,
            [user.id]
        );

        const unreadMap = new Map((unreadRows || []).map((x: any) => [x.orderId, x.unread]));

        const formatted = orders.map(o => ({
            ...o,
            listingTitle: o.listing?.title,
            creatorName: o.creator?.displayName,
            disputeUnread: unreadMap.get(o.id) ?? 0
        }));

        return NextResponse.json({ ok: true, data: { orders: formatted } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { user, error } = await requireApiRole("BUYER");
    if (error) return NextResponse.json({ error: error.message }, { status: error.status });

    try {
        const body = await req.json();
        const listing = await prisma.creatorListing.findUnique({
            where: { id: body.listingId },
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        // Basic fee calculation (example: 10% platform fee)
        const subtotal = body.price || listing.price || 0;
        const fees = subtotal * 0.1;
        const total = subtotal + fees;

        const order = await prisma.creatorOrder.create({
            data: {
                buyerUserId: user.id,
                creatorId: listing.creatorId,
                listingId: listing.id,
                type: listing.type,
                subtotal,
                fees,
                total,
                currency: listing.currency,
                status: "PENDING",
                serviceDate: body.serviceDate ? new Date(body.serviceDate) : null,
                location: body.location || {},
            },
        });

        return NextResponse.json({ order });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
