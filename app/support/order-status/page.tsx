"use client";

import { Icons } from "@/components/icons/icons";
import { useState } from "react";

export default function OrderStatusPage() {
    const PackageIcon = Icons.get("Package");
    const SearchIcon = Icons.get("Search");
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would query the order status
        if (orderId.trim()) {
            window.location.href = `/buyer/orders?search=${orderId}`;
        }
    };

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <PackageIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Check Order Status</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Track your orders and view delivery status
                </p>
            </div>

            <div style={{ maxWidth: 600, margin: "40px auto" }}>
                <div className="bd-card bd-card-pad">
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Find Your Order</h2>

                    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Order ID</label>
                            <input
                                type="text"
                                className="bd-input"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter your order ID (e.g., ORD-12345)"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Email Address</label>
                            <input
                                type="email"
                                className="bd-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email used for the order"
                                required
                            />
                        </div>

                        <button type="submit" className="bd-btn bd-btn-primary bd-btn-lg">
                            <SearchIcon size={18} /> Track Order
                        </button>
                    </form>
                </div>

                <div className="bd-card bd-card-pad" style={{ marginTop: 24 }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Order Status Guide</h3>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div style={{ padding: 12, borderLeft: "3px solid var(--bd-brand)" }}>
                            <div style={{ fontWeight: 800 }}>Pending Payment</div>
                            <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Awaiting payment confirmation</div>
                        </div>
                        <div style={{ padding: 12, borderLeft: "3px solid #f59e0b" }}>
                            <div style={{ fontWeight: 800 }}>Paid - Escrow</div>
                            <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Payment secured in escrow, order being processed</div>
                        </div>
                        <div style={{ padding: 12, borderLeft: "3px solid #3b82f6" }}>
                            <div style={{ fontWeight: 800 }}>Shipped</div>
                            <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Order in transit to your delivery address</div>
                        </div>
                        <div style={{ padding: 12, borderLeft: "3px solid #10b981" }}>
                            <div style={{ fontWeight: 800 }}>Delivered</div>
                            <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Order delivered, awaiting confirmation</div>
                        </div>
                        <div style={{ padding: 12, borderLeft: "3px solid #10b981" }}>
                            <div style={{ fontWeight: 800 }}>Confirmed</div>
                            <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Order completed, funds released to supplier</div>
                        </div>
                    </div>
                </div>

                <div className="bd-card bd-card-pad" style={{ marginTop: 24, background: "var(--bd-muted-bg)" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Need Help?</h3>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <a href="/support/live-chat" className="bd-btn">Live Chat</a>
                        <a href="/help" className="bd-btn">Help Center</a>
                        <a href="mailto:support@banadama.com" className="bd-btn">Email Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
