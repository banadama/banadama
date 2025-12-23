// app/api/products/route.ts - Products API with Supplier Location
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");
  const country = searchParams.get("country");
  const category = searchParams.get("category");
  const state = searchParams.get("state");
  const city = searchParams.get("city");
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    // Single product by slug or id
    if (slug || id) {
      const product = await db.product.findFirst({
        where: slug ? { slug } : { id },
        include: {
          account: {
            include: {
              SupplierProfile: true,
            },
          },
        },
      });

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      // Extract supplier address
      const address = product.account?.SupplierProfile?.address as any;

      return NextResponse.json({
        ...product,
        supplierName: product.account?.SupplierProfile?.displayName || product.account?.name || "Supplier",
        supplierType: product.account?.type || "FACTORY",
        supplierTick: product.account?.verificationLevel || "NONE",
        supplierState: address?.state || null,
        supplierCity: address?.city || null,
      });
    }

    // Build where clause for list
    const where: any = {
      status: "ACTIVE",
    };

    if (country) where.country = country.toUpperCase();
    if (category) where.categorySlug = category;

    // Fetch products with supplier info
    const products = await db.product.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        account: {
          include: {
            SupplierProfile: true,
          },
        },
      },
    });

    // Enrich with supplier location
    const enriched = products.map((p: any) => {
      const address = p.account?.SupplierProfile?.address as any;
      return {
        ...p,
        supplierName: p.account?.SupplierProfile?.displayName || p.account?.name || "Supplier",
        supplierType: p.account?.type || "FACTORY",
        supplierTick: p.account?.verificationLevel || "NONE",
        supplierState: address?.state || null,
        supplierCity: address?.city || null,
      };
    });

    // Apply state/city filter (client-side for now, can be optimized)
    let filtered = enriched;
    if (state) {
      filtered = filtered.filter((p: any) => p.supplierState === state);
    }
    if (city) {
      filtered = filtered.filter((p: any) => p.supplierCity === city);
    }

    return NextResponse.json({
      products: filtered,
      total: filtered.length,
      limit,
      offset,
    });
  } catch (error) {
    // Fallback to mock data for development
    const mockProducts = [
      {
        id: "p1",
        title: "Cotton Fabric Roll",
        slug: "cotton-fabric-roll",
        categorySlug: "textile",
        country: "BD",
        buyNowEnabled: true,
        rfqEnabled: true,
        priceBuyNow: 2500,
        moq: 50,
        images: ["/placeholder-product.png"],
        supplierName: "Dhaka Textile Works",
        supplierType: "FACTORY",
        supplierTick: "GREEN_TICK",
        supplierState: "Dhaka",
        supplierCity: "Gulshan",
        globalVisible: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "p2",
        title: "Packaging Tape Industrial",
        slug: "packaging-tape-industrial",
        categorySlug: "packaging",
        country: "NG",
        buyNowEnabled: true,
        rfqEnabled: true,
        priceBuyNow: 8500,
        moq: 24,
        images: ["/placeholder-product.png"],
        supplierName: "Ikeja Packaging",
        supplierType: "WHOLESALER",
        supplierTick: "BLUE_TICK",
        supplierState: "Lagos",
        supplierCity: "Ikeja",
        globalVisible: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "p3",
        title: "Fashion Dress Collection",
        slug: "fashion-dress-collection",
        categorySlug: "fashion",
        country: "NG",
        buyNowEnabled: true,
        rfqEnabled: false,
        priceBuyNow: 15000,
        moq: 10,
        images: ["/placeholder-product.png"],
        supplierName: "Lagos Fashion Hub",
        supplierType: "RETAIL",
        supplierTick: "GREEN_TICK",
        supplierState: "Lagos",
        supplierCity: "Victoria Island",
        globalVisible: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "p4",
        title: "Premium Leather Shoes",
        slug: "premium-leather-shoes",
        categorySlug: "footwear",
        country: "BD",
        buyNowEnabled: false,
        rfqEnabled: true,
        priceBuyNow: null,
        moq: 100,
        images: ["/placeholder-product.png"],
        supplierName: "BD Footwear Factory",
        supplierType: "FACTORY",
        supplierTick: "NONE",
        supplierState: "Chittagong",
        supplierCity: "Chittagong City",
        globalVisible: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Apply filters to mock data
    let filtered = mockProducts;
    if (country) {
      filtered = filtered.filter(p => p.country === country.toUpperCase());
    }
    if (category) {
      filtered = filtered.filter(p => p.categorySlug === category);
    }
    if (state) {
      filtered = filtered.filter(p => p.supplierState === state);
    }
    if (city) {
      filtered = filtered.filter(p => p.supplierCity === city);
    }

    // Single product
    if (slug) {
      const product = mockProducts.find(p => p.slug === slug);
      return product
        ? NextResponse.json(product)
        : NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (id) {
      const product = mockProducts.find(p => p.id === id);
      return product
        ? NextResponse.json(product)
        : NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      products: filtered,
      total: filtered.length,
      limit,
      offset,
    });
  }
}
