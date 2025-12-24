// app/api/locations/route.ts - Public Locations Endpoint

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const country = (searchParams.get("country") || "").toUpperCase();

    if (country !== "NG" && country !== "BD") {
        return NextResponse.json(
            { ok: false, error: { code: "BAD_REQUEST", message: "country must be NG or BD" } },
            { status: 400 }
        );
    }

    try {
        // Try to get from database
        const locations = await db.location.findMany({
            where: {
                country: country as "NG" | "BD",
                enabled: true,
            },
            select: {
                id: true,
                country: true,
                state: true,
                city: true,
            },
            orderBy: [
                { state: "asc" },
                { city: "asc" },
            ],
        });

        return NextResponse.json({ ok: true, data: { locations } });
    } catch {
        // Fallback data if database fails
        const fallback = country === "NG"
            ? [
                { id: "ng-1", country: "NG", state: "Lagos", city: "Ikeja" },
                { id: "ng-2", country: "NG", state: "Lagos", city: "Victoria Island" },
                { id: "ng-3", country: "NG", state: "Lagos", city: "Lekki" },
                { id: "ng-4", country: "NG", state: "Ogun", city: "Sagamu" },
                { id: "ng-5", country: "NG", state: "Oyo", city: "Ibadan" },
            ]
            : [
                { id: "bd-1", country: "BD", state: "Dhaka", city: "Dhaka City" },
                { id: "bd-2", country: "BD", state: "Dhaka", city: "Gazipur" },
                { id: "bd-3", country: "BD", state: "Chittagong", city: "Chittagong City" },
                { id: "bd-4", country: "BD", state: "Narayanganj", city: "Narayanganj City" },
            ];

        return NextResponse.json({ ok: true, data: { locations: fallback } });
    }
}
