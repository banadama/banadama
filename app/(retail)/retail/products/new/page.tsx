// app/(retail)/retail/products/new/page.tsx - Create New Retail Product
import { requireRole } from "@/lib/auth";
import { SupplierProductForm } from "@/components/suppliers/SupplierProductForm";

export default async function RetailNewProductPage() {
    await requireRole("RETAIL");
    return <SupplierProductForm mode="create" basePath="/retail/products" />;
}
