"use client";

import { Icons } from "@/components/icons/icons";
import { useState } from "react";

export default function RefundsPage() {
    const CreditCardIcon = Icons.get("CreditCard");
    const CheckCircleIcon = Icons.get("Check");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <CreditCardIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Refunds & Returns</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Request a refund for eligible orders
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Refund Policy */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Our Refund Policy</h2>
                    <div className="bd-card bd-card-pad">
                        <p className="bd-p" style={{ marginBottom: 16 }}>
                            At Banadama, we're committed to ensuring your satisfaction. Our escrow system protects your payment until you confirm delivery.
                        </p>
                        <div style={{ display: "grid", gap: 16 }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>Full refund</strong> if item not received
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>Full or partial refund</strong> if item significantly different from description
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>Protection period:</strong> 7 days for physical goods, 3 days for digital products
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>Refunds processed</strong> within 5-10 business days
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Request Form */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Request a Refund</h2>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="bd-card bd-card-pad" style={{ display: "grid", gap: 16 }}>
                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Order ID *</label>
                                <input
                                    type="text"
                                    className="bd-input"
                                    placeholder="ORD-12345"
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Email Address *</label>
                                <input
                                    type="email"
                                    className="bd-input"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Reason for Refund *</label>
                                <select className="bd-input" required>
                                    <option value="">Select a reason</option>
                                    <option value="not-received">Item not received</option>
                                    <option value="defective">Item defective or damaged</option>
                                    <option value="wrong-item">Wrong item sent</option>
                                    <option value="not-described">Item not as described</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Details *</label>
                                <textarea
                                    className="bd-input"
                                    placeholder="Please provide details about your refund request..."
                                    rows={5}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Supporting Evidence (Optional)</label>
                                <input
                                    type="file"
                                    className="bd-input"
                                    accept="image/*,.pdf"
                                    multiple
                                />
                                <div style={{ fontSize: 13, color: "var(--bd-muted)", marginTop: 4 }}>
                                    Upload photos or documents that support your claim
                                </div>
                            </div>

                            <button type="submit" className="bd-btn bd-btn-primary bd-btn-lg">
                                Submit Refund Request
                            </button>
                        </form>
                    ) : (
                        <div className="bd-card bd-card-pad" style={{ textAlign: "center", padding: "60px 20px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                            <CheckCircleIcon size={64} style={{ margin: "0 auto 20px", color: "#10b981" }} />
                            <h3 style={{ fontWeight: 900, fontSize: 24, marginBottom: 12 }}>Request Submitted!</h3>
                            <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                                Your refund request has been received. Our team will review it and contact you within 24-48 hours.
                            </p>
                            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                                <a href="/buyer/orders" className="bd-btn">View My Orders</a>
                                <a href="/help" className="bd-btn">Help Center</a>
                            </div>
                        </div>
                    )}
                </section>

                {/* FAQs */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Refund FAQs</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>How long does a refund take?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6 }}>
                                Once approved, refunds are processed within 5-10 business days. The exact time depends on your payment method and bank.
                            </p>
                        </div>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Will I need to return the item?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6 }}>
                                It depends on the issue. Our Ops team will coordinate with you and the supplier if a return is necessary.
                            </p>
                        </div>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>What if the supplier doesn't agree?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6 }}>
                                Our Ops team mediates all disputes fairly. Your funds remain in escrow until the issue is resolved.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Need Help with Your Refund?</h3>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <a href="/support/live-chat" className="bd-btn bd-btn-primary">Live Chat</a>
                        <a href="mailto:support@banadama.com" className="bd-btn">Email Support</a>
                        <a href="/help" className="bd-btn">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
