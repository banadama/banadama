// app/(factory)/factory/products/[id]/edit/page.tsx - Edit Factory Product
import { requireRole } from "@/lib/auth";
import { SupplierProductForm } from "@/components/suppliers/SupplierProductForm";

export default async function FactoryEditProductPage({ params }: { params: Promise<{ id: string }> }) {
    await requireRole("FACTORY");
    const { id } = await params;
    return <SupplierProductForm mode="edit" productId={id} basePath="/factory/products" />;
}
