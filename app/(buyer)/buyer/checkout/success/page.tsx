// app/(buyer)/buyer/checkout/success/page.tsx - Checkout Success Page
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icons } from "@/components/icons/icons";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams?.get("orderId");

    return (
        <div className="bd-container bd-page" style={{ textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="bd-card bd-card-pad" style={{ maxWidth: 500, margin: "0 auto" }}>
                {/* Success Icon */}
                <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(34, 197, 94, 0.15)",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 24px",
                }}>
                    <Icons.Check size={40} style={{ color: "var(--bd-success)" }} />
                </div>

                <h1 className="bd-h2" style={{ marginBottom: 8 }}>Order Placed Successfully!</h1>
                <p className="bd-p" style={{ opacity: 0.7, marginBottom: 24 }}>
                    Your payment is now locked in escrow. Funds will be released to the supplier after you confirm delivery.
                </p>

                {orderId && (
                    <div className="bd-badge bd-badge-success" style={{ marginBottom: 24 }}>
                        <Icons.Receipt size={14} /> Order ID: {orderId}
                    </div>
                )}

                <div style={{ display: "grid", gap: 12 }}>
                    {orderId && (
                        <Link href={`/buyer/orders/${orderId}`} className="bd-btn bd-btn-primary" style={{ justifyContent: "center" }}>
                            <Icons.Package size={16} /> View Order Details
                        </Link>
                    )}
                    <Link href="/buyer/orders" className="bd-btn" style={{ justifyContent: "center" }}>
                        <Icons.Document size={16} /> All Orders
                    </Link>
                    <Link href="/marketplace" className="bd-btn" style={{ justifyContent: "center" }}>
                        <Icons.Product size={16} /> Continue Shopping
                    </Link>
                </div>

                {/* Trust Notice */}
                <div style={{ marginTop: 24, borderTop: "1px solid var(--bd-border)", paddingTop: 16 }}>
                    <div className="bd-small" style={{ opacity: 0.7, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <Icons.Lock size={14} />
                        Escrow protected · Ops-managed fulfillment
                    </div>
                </div>
            </div>
        </div>
    );
}
