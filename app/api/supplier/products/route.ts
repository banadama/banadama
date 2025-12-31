import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/supplier/products
 * Get all products for the authenticated supplier
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { supplierId: user.supplierId };

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (category) {
      where.categorySlug = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.product.count({ where });

    // Get paginated products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        variants: true,
        attributes: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 400 }
    );
  }
}

/**
 * POST /api/supplier/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);
    const body = await request.json();

    const {
      name,
      description,
      categorySlug,
      categoryName,
      brand,
      basePrice,
      compareAtPrice,
      moq,
      stockQuantity,
      images,
      status = "DRAFT",
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        categorySlug,
        categoryName,
        brand,
        basePrice: basePrice || 0,
        compareAtPrice,
        moq,
        stockQuantity: stockQuantity || 0,
        images: images || [],
        status,
        supplierId: user.supplierId,
        supplierRole: user.role,
      },
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}
