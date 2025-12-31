import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/supplier/products/[id]/duplicate
 * Duplicate a product
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(["FACTORY", "WHOLESALER", "RETAILER", "CREATOR", "AFFILIATE"]);

    // Get original product
    const originalProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        variants: true,
        attributes: true,
        pricingTiers: true,
        servicePackages: true,
      },
    });

    if (!originalProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify ownership
    if (originalProduct.supplierId !== user.supplierId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Create duplicate
    const duplicatedProduct = await prisma.product.create({
      data: {
        name: `${originalProduct.name} (Copy)`,
        description: originalProduct.description,
        categorySlug: originalProduct.categorySlug,
        categoryName: originalProduct.categoryName,
        brand: originalProduct.brand,
        basePrice: originalProduct.basePrice,
        compareAtPrice: originalProduct.compareAtPrice,
        moq: originalProduct.moq,
        stockQuantity: originalProduct.stockQuantity,
        images: originalProduct.images,
        status: "DRAFT", // Always start as draft
        supplierId: user.supplierId,
        supplierRole: originalProduct.supplierRole,
        // Copy all other fields
        shortDescription: originalProduct.shortDescription,
        tags: originalProduct.tags,
        costPrice: originalProduct.costPrice,
        pricingType: originalProduct.pricingType,
        productionCapacity: originalProduct.productionCapacity,
        leadTime: originalProduct.leadTime,
        deliveryTime: originalProduct.deliveryTime,
        revisionsIncluded: originalProduct.revisionsIncluded,
        serviceType: originalProduct.serviceType,
        hourlyRate: originalProduct.hourlyRate,
        customQuoteAvailable: originalProduct.customQuoteAvailable,
        originalProductId: originalProduct.originalProductId,
        commissionRate: originalProduct.commissionRate,
        lowStockAlert: originalProduct.lowStockAlert,
        allowBackorder: originalProduct.allowBackorder,
        continueSellingOutOfStock: originalProduct.continueSellingOutOfStock,
        videoUrl: originalProduct.videoUrl,
        mainImageUrl: originalProduct.mainImageUrl,
        weight: originalProduct.weight,
        length: originalProduct.length,
        width: originalProduct.width,
        height: originalProduct.height,
        shippingMode: originalProduct.shippingMode,
        shippingFee: originalProduct.shippingFee,
        estimatedDeliveryMin: originalProduct.estimatedDeliveryMin,
        estimatedDeliveryMax: originalProduct.estimatedDeliveryMax,
        metaTitle: originalProduct.metaTitle,
        metaDescription: originalProduct.metaDescription,
        countryOfOrigin: originalProduct.countryOfOrigin,
        country: originalProduct.country,
      },
    });

    // Duplicate variants
    if (originalProduct.variants.length > 0) {
      await prisma.productVariant.createMany({
        data: originalProduct.variants.map((v) => ({
          productId: duplicatedProduct.id,
          sku: `${v.sku}-COPY`,
          name: v.name,
          price: v.price,
          stockQuantity: v.stockQuantity,
          imageUrl: v.imageUrl,
          attributes: v.attributes,
        })),
      });
    }

    // Duplicate attributes
    if (originalProduct.attributes.length > 0) {
      await prisma.productAttribute.createMany({
        data: originalProduct.attributes.map((a) => ({
          productId: duplicatedProduct.id,
          attributeName: a.attributeName,
          attributeValue: a.attributeValue,
          displayOrder: a.displayOrder,
        })),
      });
    }

    // Duplicate pricing tiers
    if (originalProduct.pricingTiers.length > 0) {
      await prisma.productPricingTier.createMany({
        data: originalProduct.pricingTiers.map((t) => ({
          productId: duplicatedProduct.id,
          minQuantity: t.minQuantity,
          maxQuantity: t.maxQuantity,
          pricePerUnit: t.pricePerUnit,
        })),
      });
    }

    // Duplicate service packages
    if (originalProduct.servicePackages.length > 0) {
      await prisma.servicePackage.createMany({
        data: originalProduct.servicePackages.map((p) => ({
          productId: duplicatedProduct.id,
          name: p.name,
          description: p.description,
          price: p.price,
          deliveryTime: p.deliveryTime,
          revisions: p.revisions,
          features: p.features,
          displayOrder: p.displayOrder,
        })),
      });
    }

    const result = await prisma.product.findUnique({
      where: { id: duplicatedProduct.id },
      include: {
        variants: true,
        attributes: true,
        pricingTiers: true,
        servicePackages: true,
      },
    });

    return NextResponse.json(
      { success: true, data: result },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to duplicate product" },
      { status: 400 }
    );
  }
}
