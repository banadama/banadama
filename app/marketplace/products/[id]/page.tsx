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

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductDetailPage({ params, searchParams }: Props) {
    const { id: slugOrId } = await params;
    const sp = await searchParams;

    const PackageIcon = Icons.get("Package");

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

    // Fallback to mock data if DB fails or empty (for development)
    if (!product) {
        // If it's a mock ID like p1, p2, etc. (we'll show a basic version)
        if (slugOrId.startsWith("p") || slugOrId.startsWith("g") || slugOrId.startsWith("dc")) {
            return (
                <div className="bd-container bd-page">
                    <div className="bd-card bd-card-pad" style={{ textAlign: "center" }}>
                        <PackageIcon size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                        <h2 className="bd-h2">Mock Product Detail</h2>
                        <p className="bd-p">Development mode: Product data for "{slugOrId}" would be fetched here.</p>
                        <BackToResults />
                    </div>
                </div>
            );
        }
        return notFound();
    }

    // Extract supplier location from JSONB address
    const address = product.account?.SupplierProfile?.address as any;
    const supplierState = address?.state || null;
    const supplierCity = address?.city || null;

    // Breadcrumb logic
    const from = (typeof sp?.from === "string" ? sp.from : "marketplace") as any;
    const p = new URLSearchParams();
    Object.entries(sp).forEach(([k, v]) => {
        if (v && k !== "mode") p.set(k, String(v));
    });
    const resultsQueryString = p.toString();

    const verificationLevel = product.account?.verificationLevel || "NONE";
    const priceLabel = product.buyNowPrice ? `₦${product.buyNowPrice.toLocaleString()}` : undefined;
    const categoryName = await resolveCategoryName(product.categorySlug);

    // Determine CTA context
    const ctx = from === "global" ? "GLOBAL" : "PRODUCT_DETAIL";
    const ctas = getCtas({
        buyNowEnabled: !!product.buyNowEnabled,
        rfqEnabled: !!product.rfqEnabled,
        context: ctx
    });

    return (
        <div className="bd-container bd-page">
            <div style={{ marginBottom: 12 }}>
                <Breadcrumbs
                    from={from}
                    resultsQueryString={resultsQueryString}
                    categorySlug={product.categorySlug}
                    categoryName={categoryName || product.categorySlug}
                    productTitle={product.title}
                />
            </div>

            <div style={{ marginBottom: 16 }}>
                <BackToResults />
            </div>

            <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
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
        </div>
    );
}

