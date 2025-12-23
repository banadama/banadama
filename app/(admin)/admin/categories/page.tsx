// app/(admin)/admin/categories/page.tsx - Admin Categories Management
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { CategoryEditor } from "@/components/admin/actions";
import { Icons } from "@/components/icons/icons";

async function getCategories() {
    try {
        const res = await apiGet<{ ok: boolean; data: { categories: any[] } }>("/api/admin/categories");
        return res.data?.categories || [];
    } catch {
        return [];
    }
}

export default async function AdminCategoriesPage() {
    await requireRole("ADMIN");
    const categories = await getCategories();

    return (
        <div className="bd-container bd-page">
            <div style={{ marginBottom: 20 }}>
                <h1 className="bd-h1">Product Categories</h1>
                <p className="bd-p" style={{ opacity: 0.7 }}>
                    Manage product categories for suppliers (Factory, Wholesaler, Retail)
                </p>
            </div>

            {/* New Category Form */}
            <div style={{ marginBottom: 30 }}>
                <CategoryEditor />
            </div>

            {/* Categories List */}
            <div style={{ display: "grid", gap: 12 }}>
                <h2 className="bd-h2">Existing Categories ({categories.length})</h2>
                {categories.length === 0 ? (
                    <div className="bd-card bd-card-pad" style={{ textAlign: "center", padding: 40 }}>
                        <Icons.Tag size={32} style={{ opacity: 0.3, margin: "0 auto 12px" }} />
                        <div style={{ color: "var(--bd-muted)" }}>No categories yet</div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: 10 }}>
                        {categories.map((cat: any) => (
                            <div key={cat.id} className="bd-card bd-card-pad">
                                <CategoryEditor initial={cat} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
