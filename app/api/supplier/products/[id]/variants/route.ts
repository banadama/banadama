import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/supplier/products/[id]/variants/generate
 * Auto-generate variants from attributes
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);
    const body = await request.json();

    const { attributes } = body;

    if (!Array.isArray(attributes)) {
      return NextResponse.json(
        { error: "attributes must be an array" },
        { status: 400 }
      );
    }

    // Verify product ownership
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.supplierId !== user.supplierId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Generate all combinations
    const combinations = generateCombinations(attributes);

    // Create variants
    const variants = await Promise.all(
      combinations.map((combo, index) =>
        prisma.productVariant.create({
          data: {
            productId: params.id,
            sku: `${product.id?.slice(0, 4)}-${index + 1}`,
            name: Object.values(combo).join(" / "),
            attributes: combo,
            price: product.basePrice,
            stockQuantity: product.stockQuantity || 0,
          },
        })
      )
    );

    return NextResponse.json(
      { success: true, data: variants, count: variants.length },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate variants" },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/supplier/products/[id]/variants/[variantId]
 * Update a variant
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; variantId: string } }
) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);
    const body = await request.json();

    // Verify product ownership
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.supplierId !== user.supplierId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const variant = await prisma.productVariant.update({
      where: { id: params.variantId },
      data: body,
    });

    return NextResponse.json({ success: true, data: variant });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update variant" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/supplier/products/[id]/variants/[variantId]
 * Delete a variant
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; variantId: string } }
) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);

    // Verify product ownership
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.supplierId !== user.supplierId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.productVariant.delete({
      where: { id: params.variantId },
    });

    return NextResponse.json({
      success: true,
      message: "Variant deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete variant" },
      { status: 400 }
    );
  }
}

// Helper function to generate all combinations
function generateCombinations(attributes: any[]): Record<string, string>[] {
  if (attributes.length === 0) return [{}];

  const [first, ...rest] = attributes;
  const values = first.values.split(",").map((v: string) => v.trim());
  const subCombinations = generateCombinations(rest);

  return values.flatMap((value: string) =>
    subCombinations.map((combo: any) => ({
      [first.name]: value,
      ...combo,
    }))
  );
}
