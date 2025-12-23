// components/checkout/QtyStepper.tsx - Quantity selector with +/- buttons
"use client";

import * as React from "react";
import { Icons } from "@/components/icons/icons";

export function QtyStepper({
    value,
    onChange,
    min = 1,
    max = 9999,
    disabled = false,
}: {
    value: number;
    onChange: (qty: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
}) {
    const decrement = () => {
        if (value > min) onChange(value - 1);
    };

    const increment = () => {
        if (value < max) onChange(value + 1);
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
                type="button"
                className="bd-btn"
                onClick={decrement}
                disabled={disabled || value <= min}
                style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}
            >
                <Icons.Minus size={14} />
            </button>
            <input
                type="number"
                className="bd-input"
                value={value}
                onChange={(e) => {
                    const v = parseInt(e.target.value) || min;
                    onChange(Math.max(min, Math.min(max, v)));
                }}
                disabled={disabled}
                style={{ width: 60, textAlign: "center" }}
            />
            <button
                type="button"
                className="bd-btn"
                onClick={increment}
                disabled={disabled || value >= max}
                style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}
            >
                <Icons.Plus size={14} />
            </button>
        </div>
    );
}
