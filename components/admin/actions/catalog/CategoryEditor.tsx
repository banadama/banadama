// components/admin/actions/catalog/CategoryEditor.tsx
"use client";

import * as React from "react";
import { apiPost, apiPatch } from "@/lib/api";
import { useAdminAction } from "@/components/admin/useAdminAction";
import { Icons } from "@/components/icons/icons";

export function CategoryEditor({
    initial,
}: {
    initial?: { id?: string; name?: string; slug?: string; enabled?: boolean };
}) {
    const { loading, run } = useAdminAction();
    const [form, setForm] = React.useState({
        name: initial?.name ?? "",
        slug: initial?.slug ?? "",
        enabled: initial?.enabled ?? true,
    });

    async function save() {
        const isEdit = Boolean(initial?.id);
        await run(
            () =>
                isEdit
                    ? apiPatch(`/api/admin/categories/${initial!.id}`, form)
                    : apiPost(`/api/admin/categories`, form),
            { start: isEdit ? "Updating category" : "Creating category", ok: "Category saved", fail: "Save failed" }
        );
        location.reload();
    }

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
            <div style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>{initial?.id ? "Edit Category" : "New Category"}</div>

                <input className="bd-input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="bd-input" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />

                <label style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--bd-muted)" }}>
                    <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
                    Enabled
                </label>

                <button className="bd-btn bd-btn-primary" onClick={save} disabled={loading} style={{ justifyContent: "center" }}>
                    <Icons.Tag size={18} /> {loading ? "Saving..." : "Save Category"}
                </button>
            </div>
        </div>
    );
}
