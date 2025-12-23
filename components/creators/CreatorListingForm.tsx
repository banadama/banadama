"use client";

import * as React from "react";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";

const CATEGORIES = [
    "GRAPHIC_DESIGNER",
    "MOCK_DESIGNER",
    "AI_AGENT_DEV",
    "MODELLING",
    "PHOTOGRAPHER",
    "VIDEOGRAPHER",
] as const;

export function CreatorListingForm({
    mode,
    listingId,
}: {
    mode: "create" | "edit";
    listingId?: string;
}) {
    const router = useRouter();
    const toast = useToast();

    const [loading, setLoading] = React.useState(false);
    const [form, setForm] = React.useState<any>({
        type: "DIGITAL",
        category: "GRAPHIC_DESIGNER",
        title: "",
        description: "",
        price_type: "FIXED",
        currency: "USD",
        price: "",
        country: "NG",
        state: "",
        city: "",
        status: "ACTIVE",
    });

    React.useEffect(() => {
        if (mode !== "edit" || !listingId) return;
        (async () => {
            try {
                const res = await apiGet(`/api/creator/listings/${listingId}`);
                const l = res?.data?.listing ?? res?.listing ?? null;
                if (l) setForm({
                    ...form,
                    ...l,
                    price: l.price ?? "",
                    country: l.country ?? "NG",
                    state: l.state ?? "",
                    city: l.city ?? "",
                });
            } catch {
                toast.push({ type: "error", title: "Failed to load listing" });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, listingId]);

    const isLocal = form.type === "LOCAL_SERVICE";

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: any = {
                type: form.type,
                category: form.category,
                title: form.title,
                description: form.description,
                price_type: form.price_type,
                currency: form.currency,
                price: form.price_type === "QUOTED" ? null : (form.price ? Number(form.price) : null),
                status: form.status ?? "ACTIVE",
            };

            if (isLocal) {
                payload.country = form.country;
                payload.state = form.state;
                payload.city = form.city;
            } else {
                payload.country = null;
                payload.state = null;
                payload.city = null;
            }

            if (mode === "create") {
                await apiPost("/api/creator/listings", payload);
                toast.push({ type: "success", title: "Listing created" });
            } else {
                await apiPatch(`/api/creator/listings/${listingId}`, payload);
                toast.push({ type: "success", title: "Listing updated" });
            }

            router.push("/creator/listings");
        } catch (err: any) {
            toast.push({ type: "error", title: "Save failed", message: err?.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="bd-card bd-card-pad" style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                <select className="bd-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="DIGITAL">Digital</option>
                    <option value="LOCAL_SERVICE">Local service (NG/BD)</option>
                </select>

                <select className="bd-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <input className="bd-input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <select className="bd-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PAUSED">PAUSED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                </select>

                <textarea
                    className="bd-input"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    style={{ gridColumn: "span 2", minHeight: 120 }}
                />
            </div>

            <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Pricing</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                    <select className="bd-input" value={form.price_type} onChange={(e) => setForm({ ...form, price_type: e.target.value })}>
                        <option value="FIXED">FIXED</option>
                        <option value="STARTING_FROM">STARTING_FROM</option>
                        <option value="QUOTED">QUOTED</option>
                    </select>

                    <input className="bd-input" placeholder="Currency (USD/NGN)" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
                    <input
                        className="bd-input"
                        placeholder={form.price_type === "QUOTED" ? "Price disabled" : "Price"}
                        value={form.price}
                        disabled={form.price_type === "QUOTED"}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                </div>
            </div>

            {isLocal ? (
                <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 10 }}>
                    <div style={{ fontWeight: 950 }}>Location (required for Local service)</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                        <select className="bd-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                            <option value="NG">NG</option>
                            <option value="BD">BD</option>
                        </select>
                        <input className="bd-input" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                        <input className="bd-input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    </div>
                </div>
            ) : null}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="bd-btn bd-btn-primary" disabled={loading} style={{ justifyContent: "center" }}>
                    <Icons.Check size={18} /> {loading ? "Saving" : "Save"}
                </button>
                <a className="bd-btn" href="/creator/listings">
                    <Icons.X size={18} /> Cancel
                </a>
            </div>
        </form>
    );
}
