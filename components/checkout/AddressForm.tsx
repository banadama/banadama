// components/checkout/AddressForm.tsx - Delivery address form
"use client";

import * as React from "react";
import { Icons } from "@/components/icons/icons";

export interface AddressData {
    name: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    addressLine: string;
    notes: string;
}

export function AddressForm({
    value,
    onChange,
    disabled = false,
}: {
    value: AddressData;
    onChange: (data: AddressData) => void;
    disabled?: boolean;
}) {
    const update = (field: keyof AddressData, val: string) => {
        onChange({ ...value, [field]: val });
    };

    return (
        <div className="bd-card bd-card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Icons.Location size={20} />
                <div style={{ fontWeight: 800 }}>Delivery Address</div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                        <span className="bd-small">Full Name *</span>
                        <input
                            className="bd-input"
                            value={value.name}
                            onChange={(e) => update("name", e.target.value)}
                            placeholder="Your full name"
                            disabled={disabled}
                            required
                        />
                    </label>
                    <label style={{ display: "grid", gap: 6 }}>
                        <span className="bd-small">Phone *</span>
                        <input
                            className="bd-input"
                            type="tel"
                            value={value.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder="+234..."
                            disabled={disabled}
                            required
                        />
                    </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                        <span className="bd-small">Country *</span>
                        <select
                            className="bd-input"
                            value={value.country}
                            onChange={(e) => update("country", e.target.value)}
                            disabled={disabled}
                            required
                        >
                            <option value="">Select</option>
                            <option value="NG">Nigeria</option>
                            <option value="BD">Bangladesh</option>
                        </select>
                    </label>
                    <label style={{ display: "grid", gap: 6 }}>
                        <span className="bd-small">State *</span>
                        <input
                            className="bd-input"
                            value={value.state}
                            onChange={(e) => update("state", e.target.value)}
                            placeholder="State/Region"
                            disabled={disabled}
                            required
                        />
                    </label>
                    <label style={{ display: "grid", gap: 6 }}>
                        <span className="bd-small">City *</span>
                        <input
                            className="bd-input"
                            value={value.city}
                            onChange={(e) => update("city", e.target.value)}
                            placeholder="City"
                            disabled={disabled}
                            required
                        />
                    </label>
                </div>

                <label style={{ display: "grid", gap: 6 }}>
                    <span className="bd-small">Address Line *</span>
                    <input
                        className="bd-input"
                        value={value.addressLine}
                        onChange={(e) => update("addressLine", e.target.value)}
                        placeholder="Street address, building, etc."
                        disabled={disabled}
                        required
                    />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                    <span className="bd-small">Delivery Notes (optional)</span>
                    <textarea
                        className="bd-input"
                        value={value.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        placeholder="Any special instructions for delivery..."
                        disabled={disabled}
                        rows={2}
                    />
                </label>
            </div>
        </div>
    );
}
