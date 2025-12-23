import { Icons } from "@/components/icons/icons";

export default function MoneyBackPolicyPage() {
    const RefreshIcon = Icons.get("Refresh");
    const ShieldIcon = Icons.get("Shield");
    const CheckCircleIcon = Icons.get("Check");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <RefreshIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Money-Back Policy</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Shop with confidence - your money is protected
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Guarantee */}
                <section>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                            <ShieldIcon size={32} style={{ color: "#10b981", flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontWeight: 900, marginBottom: 8 }}>100% Money-Back Guarantee</h3>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    If your order doesn't arrive or isn't as described, you'll get your money back. No questions asked.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Eligible Cases */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>When You Get Your Money Back</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Item Not Received</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        If your order never arrives by the expected delivery date, you get a full refund automatically.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Significantly Not as Described</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        If the item is materially different from the listing (wrong item, fake, damaged), you're entitled to a full refund.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Defective or Damaged</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        If the product arrives defective or damaged, we'll work with you for a replacement or full refund.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Supplier Cancellation</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        If the supplier cancels your order after payment, you receive an immediate full refund.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How to Request */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>How to Request a Refund</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>1</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Contact the Supplier First</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Try to resolve the issue directly with the supplier through the order messaging system.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>2</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Open a Dispute</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    If not resolved, open a dispute through your order page or visit our <a href="/support/refunds" style={{ color: "var(--bd-brand)" }}>Refunds page</a>.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>3</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Provide Evidence</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Upload photos, videos, or documents that support your claim (damaged item, wrong product, etc.).
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "#10b981", minWidth: 40 }}>4</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Ops Team Review</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Our operations team reviews the case and mediates a fair resolution within 24-48 hours.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "#10b981", minWidth: 40 }}>5</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Refund Processed</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Once approved, your refund is processed within 5-10 business days to your original payment method.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Protection Period */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Protection Period</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Physical Products</h4>
                            <div style={{ fontSize: 32, fontWeight: 900, color: "var(--bd-brand)", marginBottom: 8 }}>7 Days</div>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                You have 7 days after delivery to inspect and confirm your order
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Digital Products</h4>
                            <div style={{ fontSize: 32, fontWeight: 900, color: "var(--bd-brand)", marginBottom: 8 }}>3 Days</div>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Digital goods have a 3-day review period after delivery
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Services</h4>
                            <div style={{ fontSize: 32, fontWeight: 900, color: "var(--bd-brand)", marginBottom: 8 }}>Varies</div>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Service protection period agreed upon booking
                            </p>
                        </div>
                    </div>
                </section>

                {/* Important Notes */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Important Notes</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.3)" }}>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                            <li>Your payment stays in escrow during the protection period - the supplier doesn't have access to it</li>
                            <li>Automatic refund if you don't receive your order by the expected date</li>
                            <li>Returns may be required for certain refund cases - we'll coordinate with you</li>
                            <li>Refund decisions are final and binding</li>
                            <li>Abuse of the refund system may result in account limitations</li>
                        </ul>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Need Help with a Refund?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                        Our support team is here to assist you
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/support/refunds" className="bd-btn bd-btn-primary">Request Refund</a>
                        <a href="/support/live-chat" className="bd-btn">Live Chat</a>
                        <a href="/help" className="bd-btn">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
