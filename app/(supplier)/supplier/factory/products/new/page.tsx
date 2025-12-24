// app/(factory)/factory/products/new/page.tsx - Create New Factory Product
import { requireRole } from "@/lib/auth";
import { SupplierProductForm } from "@/components/suppliers/SupplierProductForm";

export default async function FactoryNewProductPage() {
    await requireRole("FACTORY");
    return <SupplierProductForm mode="create" basePath="/factory/products" />;
}
