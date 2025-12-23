// components/admin/actions/catalog/LocationEditor.tsx
"use client";

import * as React from "react";
import { apiPost, apiPatch } from "@/lib/api";
import { useAdminAction } from "@/components/admin/useAdminAction";
import { Icons } from "@/components/icons/icons";

export function LocationEditor({
    initial,
}: {
    initial?: { id?: string; country?: "NG" | "BD"; state?: string; city?: string; enabled?: boolean };
}) {
    const { loading, run } = useAdminAction();
    const [form, setForm] = React.useState({
        country: initial?.country ?? "NG",
        state: initial?.state ?? "",
        city: initial?.city ?? "",
        enabled: initial?.enabled ?? true,
    });

    async function save() {
        const isEdit = Boolean(initial?.id);
        await run(
            () =>
                isEdit
                    ? apiPatch(`/api/admin/locations/${initial!.id}`, form)
                    : apiPost(`/api/admin/locations`, form),
            { start: isEdit ? "Updating location" : "Creating location", ok: "Location saved", fail: "Save failed" }
        );
        location.reload();
    }

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
            <div style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>{initial?.id ? "Edit Location" : "New Location"}</div>

                <select className="bd-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value as any })}>
                    <option value="NG">Nigeria</option>
                    <option value="BD">Bangladesh</option>
                </select>

                <input className="bd-input" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                <input className="bd-input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />

                <label style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--bd-muted)" }}>
                    <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
                    Enabled
                </label>

                <button className="bd-btn bd-btn-primary" onClick={save} disabled={loading} style={{ justifyContent: "center" }}>
                    <Icons.Location size={18} /> {loading ? "Saving..." : "Save Location"}
                </button>
            </div>
        </div>
    );
}
