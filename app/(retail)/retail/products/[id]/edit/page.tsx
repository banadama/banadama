// app/(retail)/retail/products/[id]/edit/page.tsx - Edit Retail Product
import { requireRole } from "@/lib/auth";
import { SupplierProductForm } from "@/components/suppliers/SupplierProductForm";

export default async function RetailEditProductPage({ params }: { params: Promise<{ id: string }> }) {
    await requireRole("RETAIL");
    const { id } = await params;
    return <SupplierProductForm mode="edit" productId={id} basePath="/retail/products" />;
}
