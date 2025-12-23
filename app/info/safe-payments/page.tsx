import { Icons } from "@/components/icons/icons";

export default function SafePaymentsPage() {
    const ShieldCheckIcon = Icons.get("ShieldCheck");
    const LockIcon = Icons.get("Lock");
    const CreditCardIcon = Icons.get("CreditCard");
    const CheckCircleIcon = Icons.get("Check");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <ShieldCheckIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Safe and Easy Payments</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Your payment security is our top priority
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Hero Section */}
                <section>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                            <LockIcon size={32} style={{ color: "#10b981", flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontWeight: 900, marginBottom: 8 }}>100% Secure Transactions</h3>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Every payment on Banadama is protected by industry-standard encryption and our escrow system. Your money is safe until you confirm delivery.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>How Our Payment System Works</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>1</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>You Make a Purchase</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Select your items and proceed to checkout. Choose from multiple payment methods.
                                </p>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>2</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Payment Held in Escrow</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Your payment is securely held in our escrow system. The supplier doesn't receive funds yet.
                                </p>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>3</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Order Processed & Shipped</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    The supplier processes and ships your order while your payment remains protected.
                                </p>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>4</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Delivery Confirmation</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    You receive your order and confirm it meets your expectations.
                                </p>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "#10b981", minWidth: 40 }}>5</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Funds Released to Supplier</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Only after your confirmation, funds are released from escrow to the supplier.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Accepted Payment Methods */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Accepted Payment Methods</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                        <div className="bd-card bd-card-pad">
                            <CreditCardIcon size={32} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Credit & Debit Cards</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Visa, Mastercard, Verve, and other major cards accepted
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <CreditCardIcon size={32} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Bank Transfer</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Direct bank transfers for Nigerian and Bangladeshi banks
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <CreditCardIcon size={32} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Mobile Money</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                bKash, Nagad (Bangladesh) and mobile wallets (Nigeria)
                            </p>
                        </div>
                    </div>
                </section>

                {/* Security Features */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Security Features</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>SSL/TLS Encryption:</strong> All transactions encrypted with industry-standard protocols
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>PCI DSS Compliant:</strong> We never store your full card details
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Escrow Protection:</strong> Funds held until delivery confirmation
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Fraud Detection:</strong> AI-powered fraud detection systems
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Secure Payment Gateways:</strong> Partnerships with trusted payment processors
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQs */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Payment FAQs</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Is my payment information safe?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                Yes! We use bank-level encryption and never store your full card details. All payment processing is handled by certified payment gateways.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>When will the supplier receive payment?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                Funds are released from escrow only after you confirm delivery or after the standard confirmation period (7 days for physical goods, 3 days for digital).
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>What if I don't receive my order?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                Your funds remain in escrow until delivery is confirmed. If you don't receive your order, you can file a dispute and get a full refund.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Are there any hidden fees?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                No. All fees are displayed clearly before checkout. What you see is what you pay.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Start Shopping with Confidence</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                        Your payments are protected every step of the way
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/marketplace" className="bd-btn bd-btn-primary">Browse Marketplace</a>
                        <a href="/help" className="bd-btn">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
