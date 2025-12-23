// components/checkout/CartItemRow.tsx - Cart item row component
"use client";

import * as React from "react";
import { Icons } from "@/components/icons/icons";
import { VerificationTick } from "@/components/trust/VerificationTick";
import { QtyStepper } from "./QtyStepper";

export interface CartItem {
    id: string;
    productId: string;
    title: string;
    image?: string;
    unitPrice: number;
    qty: number;
    supplier: {
        name: string;
        verification: "NONE" | "BLUE_TICK" | "GREEN_TICK";
    };
    moq?: number;
}

export function CartItemRow({
    item,
    onQtyChange,
    onRemove,
    disabled = false,
}: {
    item: CartItem;
    onQtyChange: (qty: number) => void;
    onRemove: () => void;
    disabled?: boolean;
}) {
    const lineTotal = item.unitPrice * item.qty;

    return (
        <div className="bd-card bd-card-pad" style={{ display: "grid", gridTemplateColumns: "80px 1fr auto auto auto", gap: 16, alignItems: "center" }}>
            {/* Image */}
            <div style={{ width: 80, height: 80, borderRadius: 12, overflow: "hidden", background: "var(--bd-surface)" }}>
                {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                        <Icons.Package size={32} style={{ opacity: 0.3 }} />
                    </div>
                )}
            </div>

            {/* Title + Supplier */}
            <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="bd-small" style={{ opacity: 0.7 }}>{item.supplier.name}</span>
                    <VerificationTick level={item.supplier.verification} />
                </div>
                <div className="bd-small" style={{ marginTop: 4 }}>
                    ₦{item.unitPrice.toLocaleString()} / unit
                </div>
            </div>

            {/* Qty */}
            <QtyStepper
                value={item.qty}
                onChange={onQtyChange}
                min={item.moq || 1}
                disabled={disabled}
            />

            {/* Line Total */}
            <div style={{ fontWeight: 900, fontSize: 16, minWidth: 100, textAlign: "right" }}>
                ₦{lineTotal.toLocaleString()}
            </div>

            {/* Remove */}
            <button
                type="button"
                className="bd-btn"
                onClick={onRemove}
                disabled={disabled}
                style={{ padding: 8 }}
                title="Remove item"
            >
                <Icons.X size={16} />
            </button>
        </div>
    );
}
