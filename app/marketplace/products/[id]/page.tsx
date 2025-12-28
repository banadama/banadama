// app/marketplace/products/[id]/page.tsx - VERSION 2 (LIQUID GLASS)
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductDetailShell } from "@/components/marketplace/ProductDetailShell";
import { Breadcrumbs } from "@/components/marketplace/Breadcrumbs";
import { BackToResults } from "@/components/marketplace/BackToResults";
import { resolveCategoryName } from "@/lib/categoriesCache";
import { Icons } from "@/components/icons/icons";
import { SpecBlock } from "@/components/product/SpecBlock";
import { TrustInfoBlock } from "@/components/product/TrustInfoBlock";
import { TagRow } from "@/components/marketplace/TagRow";
import { ModeBadges } from "@/components/marketplace/ModeBadges";
import { getCtas } from "@/components/marketplace/ctaRules";
import { Card, CardBody } from "@/components/ui/Card";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductDetailPage({ params, searchParams }: Props) {
    const { id: slugOrId } = await params;
    const sp = await searchParams;

    // Fetch product with supplier info from database
    const product = await db.product.findFirst({
        where: {
            OR: [
                { id: slugOrId },
                { slug: slugOrId }
            ],
            status: "ACTIVE",
        },
        include: {
            account: {
                include: {
                    SupplierProfile: true,
                },
            },
        },
    });

    if (!product) {
        if (slugOrId.startsWith("p") || slugOrId.startsWith("g") || slugOrId.startsWith("dc")) {
            return (
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <Card className="border-white/5 bg-white/[0.02] py-20">
                        <CardBody className="flex flex-col items-center text-center">
                            <Icons.Package size={48} className="text-slate-600 mb-6" />
                            <h2 className="text-2xl font-bold text-white mb-4">Mock Product Detail</h2>
                            <p className="text-slate-400 max-w-sm mb-10">Development mode: Product data for "{slugOrId}" would be fetched here.</p>
                            <BackToResults />
                        </CardBody>
                    </Card>
                </div>
            );
        }
        return notFound();
    }

    const address = product.account?.SupplierProfile?.address as any;
    const supplierState = address?.state || null;
    const supplierCity = address?.city || null;

    const from = (typeof sp?.from === "string" ? sp.from : "marketplace") as any;
    const p = new URLSearchParams();
    Object.entries(sp).forEach(([k, v]) => {
        if (v && k !== "mode") p.set(k, String(v));
    });
    const resultsQueryString = p.toString();

    const verificationLevel = product.account?.verificationLevel || "NONE";
    const priceLabel = product.buyNowPrice ? `₦${product.buyNowPrice.toLocaleString()}` : undefined;
    const categoryName = await resolveCategoryName(product.categorySlug);

    const ctx = from === "global" ? "GLOBAL" : "PRODUCT_DETAIL";

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col gap-6 mb-8">
                <Breadcrumbs
                    from={from}
                    resultsQueryString={resultsQueryString}
                    categorySlug={product.categorySlug}
                    categoryName={categoryName || product.categorySlug}
                    productTitle={product.title}
                />
                <BackToResults />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                {/* Header Information Wrap */}
                <div className="space-y-6 mb-4">
                    <TagRow
                        categoryLabel={categoryName || product.categorySlug}
                        supplierName={product.account?.SupplierProfile?.displayName || product.account?.name || "Supplier"}
                        supplierTick={verificationLevel as any}
                        supplierCity={supplierCity}
                        supplierState={supplierState}
                    />

                    <ModeBadges
                        buyNowEnabled={!!product.buyNowEnabled}
                        rfqEnabled={!!product.rfqEnabled}
                        context={ctx === "GLOBAL" ? "GLOBAL" : "MARKETPLACE"}
                    />
                </div>

                {/* Main Product Shell (Includes Image Gallery & Description) */}
                <ProductDetailShell
                    productId={product.id}
                    title={product.title}
                    images={product.images || []}
                    supplierName={product.account?.SupplierProfile?.displayName || product.account?.name || "Supplier"}
                    supplierTick={verificationLevel as any}
                    description={product.description || ""}
                    buyNowEnabled={!!product.buyNowEnabled}
                    rfqEnabled={!!product.rfqEnabled}
                    priceLabel={priceLabel}
                    categoryName={categoryName || product.categorySlug}
                    categorySlug={product.categorySlug}
                    supplierState={supplierState}
                    supplierCity={supplierCity}
                    context={ctx}
                />

                {/* Specifications & Trust Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <SpecBlock
                        buyNowEnabled={!!product.buyNowEnabled}
                        rfqEnabled={!!product.rfqEnabled}
                        buyNowPrice={product.buyNowPrice}
                        currency={product.currency}
                        moq={product.moq}
                        leadTimeDays={product.leadTimeDays}
                    />
                    <TrustInfoBlock
                        country={product.country}
                        context={ctx}
                    />
                </div>
            </div>
        </div>
    );
}


