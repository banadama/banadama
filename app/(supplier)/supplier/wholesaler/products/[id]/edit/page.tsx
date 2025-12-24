// app/(wholesaler)/wholesaler/products/[id]/edit/page.tsx - Edit Wholesaler Product
import { requireRole } from "@/lib/auth";
import { SupplierProductForm } from "@/components/suppliers/SupplierProductForm";

export default async function WholesalerEditProductPage({ params }: { params: Promise<{ id: string }> }) {
    await requireRole("WHOLESALER");
    const { id } = await params;
    return <SupplierProductForm mode="edit" productId={id} basePath="/wholesaler/products" />;
}
