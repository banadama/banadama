// components/checkout/CheckoutSummaryCard.tsx - Order summary sidebar
import * as React from "react";
import { Icons } from "@/components/icons/icons";

export interface CheckoutSummary {
    subtotal: number;
    platformFee?: number;
    shippingEstimate?: number;
    shippingLabel?: string;
    total: number;
    tradeMode: "LOCAL" | "GLOBAL";
}

export function CheckoutSummaryCard({
    summary,
    onCheckout,
    loading = false,
    buttonLabel = "Proceed to Checkout",
}: {
    summary: CheckoutSummary;
    onCheckout?: () => void;
    loading?: boolean;
    buttonLabel?: string;
}) {
    return (
        <div className="bd-card bd-card-pad bd-sticky">
            <div style={{ fontWeight: 800, marginBottom: 16 }}>Order Summary</div>

            <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="bd-small">Subtotal</span>
                    <span style={{ fontWeight: 700 }}>₦{summary.subtotal.toLocaleString()}</span>
                </div>

                {typeof summary.platformFee === "number" && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className="bd-small">Platform Fee</span>
                        <span>₦{summary.platformFee.toLocaleString()}</span>
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <span className="bd-small">Shipping</span>
                        {summary.shippingLabel && (
                            <div className="bd-badge" style={{ marginTop: 4, fontSize: 11 }}>
                                {summary.tradeMode === "LOCAL" ? (
                                    <><Icons.Truck size={12} /> {summary.shippingLabel}</>
                                ) : (
                                    <><Icons.Globe size={12} /> {summary.shippingLabel}</>
                                )}
                            </div>
                        )}
                    </div>
                    {typeof summary.shippingEstimate === "number" ? (
                        <span>₦{summary.shippingEstimate.toLocaleString()}</span>
                    ) : (
                        <span className="bd-small" style={{ opacity: 0.6 }}>Calculated at checkout</span>
                    )}
                </div>

                <div style={{ borderTop: "1px solid var(--bd-border)", paddingTop: 12, marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 800 }}>Total</span>
                        <span style={{ fontWeight: 900, fontSize: 20, color: "var(--bd-success)" }}>
                            ₦{summary.total.toLocaleString()}
                        </span>
                    </div>
                </div>

                {summary.tradeMode === "GLOBAL" && (
                    <div className="bd-badge" style={{ marginTop: 8 }}>
                        <Icons.Globe size={14} /> Ops-coordinated international shipping
                    </div>
                )}

                {onCheckout && (
                    <button
                        className="bd-btn bd-btn-primary"
                        onClick={onCheckout}
                        disabled={loading}
                        style={{ width: "100%", marginTop: 12, justifyContent: "center" }}
                    >
                        {loading ? (
                            <>Processing...</>
                        ) : (
                            <><Icons.Lock size={16} /> {buttonLabel}</>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
