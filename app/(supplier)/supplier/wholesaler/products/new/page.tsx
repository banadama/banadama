// app/(wholesaler)/wholesaler/products/new/page.tsx - Create New Wholesaler Product
import { requireRole } from "@/lib/auth";
import { SupplierProductForm } from "@/components/suppliers/SupplierProductForm";

export default async function WholesalerNewProductPage() {
    await requireRole("WHOLESALER");
    return <SupplierProductForm mode="create" basePath="/wholesaler/products" />;
}
