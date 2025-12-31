import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/supplier/products/bulk-action
 * Perform bulk operations on products
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);
    const body = await request.json();

    const { action, productIds } = body;

    if (!action || !productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "action and productIds array are required" },
        { status: 400 }
      );
    }

    // Verify all products belong to this supplier
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const unauthorized = products.some((p) => p.supplierId !== user.supplierId);
    if (unauthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    let result;

    switch (action) {
      case "activate":
        result = await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { status: "ACTIVE", isActive: true },
        });
        break;

      case "deactivate":
        result = await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { status: "INACTIVE", isActive: false },
        });
        break;

      case "delete":
        result = await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { deletedAt: new Date() },
        });
        break;

      case "draft":
        result = await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { status: "DRAFT" },
        });
        break;

      case "export":
        // Return products in CSV format
        const productsForExport = await prisma.product.findMany({
          where: { id: { in: productIds } },
        });

        const csv = convertToCSV(productsForExport);
        return new NextResponse(csv, {
          status: 200,
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=products.csv",
          },
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}d ${result.count} product(s)`,
      count: result.count,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Bulk action failed" },
      { status: 400 }
    );
  }
}

function convertToCSV(products: any[]): string {
  if (products.length === 0) {
    return "No products";
  }

  const headers = [
    "ID",
    "Name",
    "Brand",
    "Category",
    "Base Price",
    "Stock Quantity",
    "Status",
    "Created At",
  ];

  const rows = products.map((p) => [
    p.id,
    p.name,
    p.brand || "",
    p.categoryName || "",
    p.basePrice || "",
    p.stockQuantity || 0,
    p.status,
    p.createdAt.toISOString(),
  ]);

  const csvHeader = headers.join(",");
  const csvRows = rows.map((row) =>
    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  );

  return [csvHeader, ...csvRows].join("\n");
}
