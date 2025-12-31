import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/supplier/products/[id]
 * Get single product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        variants: true,
        attributes: true,
        pricingTiers: true,
        servicePackages: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify ownership
    if (product.supplierId !== user.supplierId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/supplier/products/[id]
 * Update product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);
    const body = await request.json();

    // Verify ownership first
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.supplierId !== user.supplierId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: body,
      include: {
        variants: true,
        attributes: true,
        pricingTiers: true,
        servicePackages: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/supplier/products/[id]
 * Delete product (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);

    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.supplierId !== user.supplierId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Soft delete
    const deletedProduct = await prisma.product.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 400 }
    );
  }
}
