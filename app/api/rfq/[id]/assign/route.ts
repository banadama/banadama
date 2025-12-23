// app/api/rfq/[id]/assign/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// POST - Assign supplier to RFQ (Ops only)
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only Ops and Admin can assign suppliers
        if (user.role !== "OPS" && user.role !== "ADMIN") {
            return NextResponse.json({ error: "Only Ops can assign suppliers" }, { status: 403 });
        }

        const { id } = params;
        const body = await req.json();
        const { supplierId } = body;

        if (!supplierId) {
            return NextResponse.json({ error: "supplierId is required" }, { status: 400 });
        }

        // Check RFQ exists and is pending
        const rfq = await db.request.findUnique({
            where: { id },
        });

        if (!rfq) {
            return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
        }

        if (rfq.status !== "PENDING") {
            return NextResponse.json(
                { error: "Can only assign supplier to pending RFQs" },
                { status: 400 }
            );
        }

        // Check supplier exists
        const supplier = await db.supplierProfile.findUnique({
            where: { id: supplierId },
            include: { user: true },
        });

        if (!supplier) {
            return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
        }

        // Assign supplier
        const updatedRfq = await db.request.update({
            where: { id },
            data: {
                supplierId,
                // Keep status as PENDING until quote is generated
            },
            include: {
                supplier: {
                    include: {
                        user: { select: { email: true } },
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Supplier assigned successfully",
            rfq: {
                id: updatedRfq.id,
                supplierId: updatedRfq.supplierId,
                supplierEmail: updatedRfq.supplier?.user.email,
            },
        });

    } catch (error) {
        console.error("Error assigning supplier:", error);
        return NextResponse.json({ error: "Failed to assign supplier" }, { status: 500 });
    }
}

// GET - Get available suppliers for RFQ category (Ops only)
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (user.role !== "OPS" && user.role !== "ADMIN") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const { id } = params;

        const rfq = await db.request.findUnique({
            where: { id },
        });

        if (!rfq) {
            return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
        }

        // Get verified suppliers matching the category
        const suppliers = await db.supplierProfile.findMany({
            where: {
                isVerified: true,
                // Could filter by category if we have category on supplier
            },
            include: {
                user: {
                    select: { email: true, country: true },
                },
            },
            take: 20,
        });

        return NextResponse.json({
            rfqId: id,
            category: rfq.categorySlug,
            suppliers: suppliers.map((s) => ({
                id: s.id,
                businessName: s.businessName,
                country: s.user.country,
                type: s.type,
                isVerified: s.isVerified,
            })),
        });

    } catch (error) {
        console.error("Error fetching suppliers:", error);
        return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
    }
}
