// app/api/categories/route.ts - Public Categories API
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const categories = await db.category.findMany({
            where: { enabled: true },
            orderBy: { name: "asc" },
        });

        return NextResponse.json({
            ok: true,
            data: { categories },
        });
    } catch (err) {
        console.error("Error fetching categories:", err);
        return NextResponse.json(
            { ok: false, error: { code: "ERROR", message: "Failed to fetch categories" } },
            { status: 500 }
        );
    }
}
