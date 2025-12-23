// components/checkout/PaymentMethodCard.tsx - Payment method selection
"use client";

import * as React from "react";
import { Icons } from "@/components/icons/icons";

export type PaymentMethod = "CARD" | "BANK_TRANSFER";

export function PaymentMethodCard({
    value,
    onChange,
    disabled = false,
}: {
    value: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
    disabled?: boolean;
}) {
    return (
        <div className="bd-card bd-card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Icons.Wallet size={20} />
                <div style={{ fontWeight: 800 }}>Payment Method</div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
                <label
                    className={`bd-card bd-card-pad ${value === "CARD" ? "bd-card-selected" : ""}`}
                    style={{
                        cursor: disabled ? "not-allowed" : "pointer",
                        border: value === "CARD" ? "2px solid var(--bd-success)" : undefined,
                        background: value === "CARD" ? "rgba(34, 197, 94, 0.05)" : undefined,
                    }}
                >
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="CARD"
                        checked={value === "CARD"}
                        onChange={() => onChange("CARD")}
                        disabled={disabled}
                        style={{ display: "none" }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Icons.Receipt size={24} />
                        <div>
                            <div style={{ fontWeight: 700 }}>Card Payment</div>
                            <div className="bd-small" style={{ opacity: 0.7 }}>Pay securely with your debit/credit card</div>
                        </div>
                        {value === "CARD" && (
                            <Icons.Check size={20} style={{ marginLeft: "auto", color: "var(--bd-success)" }} />
                        )}
                    </div>
                </label>

                <label
                    className={`bd-card bd-card-pad ${value === "BANK_TRANSFER" ? "bd-card-selected" : ""}`}
                    style={{
                        cursor: disabled ? "not-allowed" : "pointer",
                        border: value === "BANK_TRANSFER" ? "2px solid var(--bd-success)" : undefined,
                        background: value === "BANK_TRANSFER" ? "rgba(34, 197, 94, 0.05)" : undefined,
                    }}
                >
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="BANK_TRANSFER"
                        checked={value === "BANK_TRANSFER"}
                        onChange={() => onChange("BANK_TRANSFER")}
                        disabled={disabled}
                        style={{ display: "none" }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Icons.Bank size={24} />
                        <div>
                            <div style={{ fontWeight: 700 }}>Bank Transfer</div>
                            <div className="bd-small" style={{ opacity: 0.7 }}>Pay via direct bank transfer</div>
                        </div>
                        {value === "BANK_TRANSFER" && (
                            <Icons.Check size={20} style={{ marginLeft: "auto", color: "var(--bd-success)" }} />
                        )}
                    </div>
                </label>
            </div>
        </div>
    );
}
