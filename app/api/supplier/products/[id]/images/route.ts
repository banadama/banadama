import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { promises as fs } from 'fs';
import path from 'path';

/**
 * POST /api/supplier/products/[id]/images
 * Upload product images
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const formData = await request.formData();
    // accept both 'files' and 'images' keys for compatibility
    let files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      files = formData.getAll("images") as File[];
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Validate file count
    const currentImages = product.images?.length || 0;
    if (currentImages + files.length > 10) {
      return NextResponse.json(
        {
          error: `Maximum 10 images allowed. Currently have ${currentImages}.`,
        },
        { status: 400 }
      );
    }

    // Save files to local `public/uploads/products/:id/` for local development
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products', params.id);
    await fs.mkdir(uploadDir, { recursive: true });

    const imageUrls: string[] = [];
    for (const file of files) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`File ${file.name} exceeds 5MB limit`);
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        throw new Error(`File ${file.name} has invalid type`);
      }

      // Write file to disk
      const arrayBuffer = await (file as any).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-z0-9_.-]/gi, '-')}`;
      const filePath = path.join(uploadDir, safeName);
      await fs.writeFile(filePath, buffer);

      // Publicly accessible URL (served from /public)
      const publicUrl = `/uploads/products/${params.id}/${safeName}`;
      imageUrls.push(publicUrl);
    }

    // Update product with new images
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        images: {
          push: imageUrls,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          images: updatedProduct.images,
          count: imageUrls.length,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to upload images" },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/supplier/products/[id]/images/reorder
 * Reorder product images
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);
    const body = await request.json();

    const { imageUrls } = body;

    if (!Array.isArray(imageUrls)) {
      return NextResponse.json(
        { error: "imageUrls must be an array" },
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

    // Update image order
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        images: imageUrls,
        mainImageUrl: imageUrls[0], // First image is main
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct.images,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to reorder images" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/supplier/products/[id]/images
 * Delete a specific image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("imageUrl");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl query parameter is required" },
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

    // Remove image
    const updatedImages = (product.images || []).filter((img) => img !== imageUrl);

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        images: updatedImages,
        mainImageUrl: updatedImages[0] || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct.images,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete image" },
      { status: 400 }
    );
  }
}
