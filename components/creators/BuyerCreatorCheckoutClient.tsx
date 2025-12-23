"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";
import { createCreatorOrder } from "@/lib/creatorApi";

export function BuyerCreatorCheckoutClient({ listing }: { listing: any }) {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);

    const isLocal = listing.type === "LOCAL_SERVICE";
    const [serviceDate, setServiceDate] = React.useState("");
    const [notes, setNotes] = React.useState("");

    async function submit() {
        setLoading(true);
        try {
            // Validate required date for local services
            if (isLocal && !serviceDate) {
                throw new Error("Service date is required for local booking.");
            }

            // Country lock for local services
            let buyerCountry: string | null = null;
            try {
                const me = await fetch("/api/user", { credentials: "include" }).then(r => r.ok ? r.json() : null);
                buyerCountry = me?.data?.user?.country ?? me?.user?.country ?? me?.country ?? null;
            } catch { }

            if (isLocal) {
                const lc = (listing.country ?? "").toUpperCase();
                if (lc !== "NG" && lc !== "BD") {
                    throw new Error("Local services are available only in NG/BD.");
                }
                if (buyerCountry && buyerCountry.toUpperCase() !== lc) {
                    throw new Error(`This service is only available for buyers in ${lc}.`);
                }
            }

            const payload: any = {
                listingId: listing.id,
                notes: notes || null,
                type: isLocal ? "LOCAL_SERVICE" : "DIGITAL",
            };

            if (isLocal) {
                payload.serviceDate = serviceDate;
                payload.country = listing.country;
            }

            const res = await createCreatorOrder(payload);
            const orderId = res?.id || res?.order?.id;

            if (!orderId) throw new Error("Order creation failed");

            toast.push({ type: "success", title: "Order created" });
            router.push(`/buyer/creator-orders/${orderId}`);
        } catch (e: any) {
            toast.push({ type: "error", title: "Checkout failed", message: e?.message });
        } finally {
            setLoading(false);
        }
    }

    const priceLabel =
        listing.priceType === "QUOTED"
            ? "Quoted"
            : listing.price
                ? `${listing.currency ?? "USD"} ${Number(listing.price).toFixed(2)}`
                : "—";

    return (
        <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 950, fontSize: 16 }}>{listing.title}</div>
                <span className="bd-badge">
                    <Icons.Tag size={14} /> {listing.category}
                </span>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="bd-badge">
                    {isLocal ? <Icons.MapPin size={14} /> : <Icons.Layers size={14} />}
                    {isLocal ? "Local service" : "Digital"}
                </span>
                <span className="bd-badge">
                    <Icons.CreditCard size={14} /> {priceLabel}
                </span>
            </div>

            {isLocal ? (
                <>
                    <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 10 }}>
                        <div style={{ fontWeight: 950 }}>Booking</div>
                        <input
                            className="bd-input"
                            type="datetime-local"
                            value={serviceDate}
                            onChange={(e) => setServiceDate(e.target.value)}
                        />
                        <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>
                            Location locked: {listing.country} · {listing.city ?? ""}{listing.city && listing.state ? ", " : ""}{listing.state ?? ""}
                        </div>
                        <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>
                            Ops-managed. Creator payout releases after delivery confirmation.
                        </div>
                    </div>

                    <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 8, background: "var(--bd-muted-bg)" }}>
                        <div style={{ fontWeight: 950 }}>Country locked</div>
                        <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>
                            This booking is locked to {String(listing.country ?? "").toUpperCase()}.
                            If your buyer country differs, booking will be blocked.
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>
                    Digital delivery is protected by escrow. Funds release after confirmation.
                </div>
            )}

            <textarea
                className="bd-input"
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ minHeight: 90 }}
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="bd-btn bd-btn-primary" onClick={submit} disabled={loading} style={{ justifyContent: "center" }}>
                    <Icons.Check size={18} /> {loading ? "Creating" : "Create order"}
                </button>
                <button className="bd-btn" onClick={() => router.back()}>
                    <Icons.ChevronLeft size={18} /> Back
                </button>
            </div>
        </div>
    );
}
