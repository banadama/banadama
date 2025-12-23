// app/api/admin/trade-control/route.ts - Admin Trade Control API
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";
import { logAdminAction, createSnapshot } from "@/lib/audit";

const TRADE_CONTROL_KEY = "trade_control";

// GET /api/admin/trade-control
export async function GET(request: NextRequest) {
    const { error } = await requireApiRole("ADMIN");
    if (error) {
        return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: error.message } }, { status: error.status });
    }

    try {
        const setting = await db.siteSetting.findUnique({
            where: { key: TRADE_CONTROL_KEY },
        });

        const config = setting?.value ? JSON.parse(setting.value as string) : {
            globalBuyOnlyEnabled: true,
            countriesAllowedToBuy: ["NG", "BD"],
            countriesAllowedToSell: ["NG", "BD"],
            internationalSellingEnabled: false,
        };

        return NextResponse.json({
            ok: true,
            data: { config },
        });
    } catch (err) {
        console.error("Error fetching trade control:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to fetch trade control" } }, { status: 500 });
    }
}

// PATCH /api/admin/trade-control
export async function PATCH(request: NextRequest) {
    const { user: admin, error } = await requireApiRole("ADMIN");
    if (error) {
        return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: error.message } }, { status: error.status });
    }

    try {
        const body = await request.json();

        const existing = await db.siteSetting.findUnique({
            where: { key: TRADE_CONTROL_KEY },
        });

        const currentConfig = existing?.value ? JSON.parse(existing.value as string) : {};
        const newConfig = { ...currentConfig, ...body };

        await db.siteSetting.upsert({
            where: { key: TRADE_CONTROL_KEY },
            update: { value: JSON.stringify(newConfig) },
            create: { key: TRADE_CONTROL_KEY, value: JSON.stringify(newConfig) },
        });

        await logAdminAction({
            adminId: admin!.id,
            action: "UPDATE_TRADE_CONTROL",
            targetType: "SETTING",
            targetId: TRADE_CONTROL_KEY,
            before: createSnapshot(currentConfig),
            after: createSnapshot(newConfig),
        });

        return NextResponse.json({
            ok: true,
            data: { config: newConfig },
        });
    } catch (err) {
        console.error("Error updating trade control:", err);
        return NextResponse.json({ ok: false, error: { code: "ERROR", message: "Failed to update trade control" } }, { status: 500 });
    }
}
