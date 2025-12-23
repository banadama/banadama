// app/api/chat/threads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { createThread, getUserThreads, getAllowedThreadTypes } from "@/lib/chat";
import type { ThreadType } from "@/lib/chat";

// GET - Get user's threads/inbox
export async function GET(request: NextRequest) {
    try {
        const { user, error } = await requireApiRole([
            "BUYER",
            "SUPPLIER",
            "CREATOR",
            "OPS",
            "ADMIN",
        ]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as ThreadType | null;
        const unreadOnly = searchParams.get("unreadOnly") === "true";

        const threads = await getUserThreads(user!.id, {
            type: type || undefined,
            unreadOnly,
        });

        return NextResponse.json({
            threads,
            allowedThreadTypes: getAllowedThreadTypes(user!.role),
        });
    } catch (error) {
        console.error("Error fetching threads:", error);
        return NextResponse.json(
            { error: "Failed to fetch threads" },
            { status: 500 }
        );
    }
}

// POST - Create a new thread
export async function POST(request: NextRequest) {
    try {
        const { user, error } = await requireApiRole([
            "BUYER",
            "SUPPLIER",
            "CREATOR",
            "OPS",
            "ADMIN",
        ]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        const body = await request.json();
        const { type, participantIds, title, initialMessage } = body;

        if (!type) {
            return NextResponse.json(
                { error: "Thread type is required" },
                { status: 400 }
            );
        }

        if (!initialMessage) {
            return NextResponse.json(
                { error: "Initial message is required" },
                { status: 400 }
            );
        }

        const thread = await createThread({
            type,
            creatorId: user!.id,
            creatorRole: user!.role,
            participantIds: participantIds || [],
            title,
            initialMessage,
        });

        return NextResponse.json({
            success: true,
            thread: {
                id: thread.id,
                type: thread.type,
                title: thread.title,
                participants: thread.participants.map((p) => ({
                    id: p.user.id,
                    email: p.user.email,
                    role: p.user.role,
                })),
            },
        });
    } catch (error: any) {
        console.error("Error creating thread:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create thread" },
            { status: 400 }
        );
    }
}
