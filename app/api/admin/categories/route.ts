// app/api/admin/categories/route.ts - Admin Categories API

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { logAdminAction, createSnapshot } from "@/lib/audit";


// GET /api/admin/categories
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole("ADMIN");
    if (error) {
        return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: error.message } }, { status: error.status });
    }

    try {
        const categories = await db.category.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json({
            ok: true,
            data: { categories },
        });
    } catch (err) {
        console.error("Error fetching categories:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to fetch categories" } }, { status: 500 });
    }
}

// POST /api/admin/categories
export async function POST(request: NextRequest) {
    const { user: admin, error } = await requireApiRole("ADMIN");
    if (error) {
        return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: error.message } }, { status: error.status });
    }

    try {
        const body = await request.json();
        const { name, slug, enabled = true } = body;

        if (!name || !slug) {
            return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Name and slug are required" } }, { status: 400 });
        }

        // Check for duplicate slug
        const existing = await db.category.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ ok: false, error: { code: "CONFLICT", message: "Category slug already exists" } }, { status: 409 });
        }

        const category = await db.category.create({
            data: { name, slug, enabled },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: "CREATE_CATEGORY",
            targetType: "CATEGORY",
            targetId: category.id,
            after: createSnapshot(category),
        });

        return NextResponse.json({
            ok: true,
            data: { category },
        }, { status: 201 });
    } catch (err) {
        console.error("Error creating category:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to create category" } }, { status: 500 });
    }
}
