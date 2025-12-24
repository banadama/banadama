// app/api/admin/locations/route.ts - Admin Locations API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { logAdminAction, createSnapshot } from "@/lib/audit";


// GET /api/admin/locations
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole("ADMIN");
    if (error) {
        return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: error.message } }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");

    try {
        const where: any = {};
        if (country) {
            where.country = country;
        }

        const locations = await db.location.findMany({
            where,
            orderBy: [{ country: "asc" }, { state: "asc" }, { city: "asc" }],
        });

        return NextResponse.json({
            ok: true,
            data: { locations },
        });
    } catch (err) {
        console.error("Error fetching locations:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to fetch locations" } }, { status: 500 });
    }
}

// POST /api/admin/locations
export async function POST(request: NextRequest) {
    const { user: admin, error } = await requireApiRole("ADMIN");
    if (error) {
        return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: error.message } }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { country, state, city, enabled = true } = body;

        if (!country || !state) {
            return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Country and state are required" } }, { status: 400 });
        }

        const validCountries = ["NG", "BD"];
        if (!validCountries.includes(country)) {
            return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Country must be NG or BD" } }, { status: 400 });
        }

        const location = await db.location.create({
            data: { country, state, city: city || null, enabled },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: "CREATE_LOCATION",
            targetType: "LOCATION",
            targetId: location.id,
            after: createSnapshot(location),
        });

        return NextResponse.json({
            ok: true,
            data: { location },
        }, { status: 201 });
    } catch (err) {
        console.error("Error creating location:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to create location" } }, { status: 500 });
    }
}
