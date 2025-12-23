import { Icons } from "@/components/icons/icons";

export default function OnTimeShippingPage() {
    const TruckIcon = Icons.get("Truck");
    const ClockIcon = Icons.get("Clock");
    const CheckCircleIcon = Icons.get("Check");
    const MapPinIcon = Icons.get("MapPin");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <TruckIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>On-Time Shipping Guarantee</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    We ensure your orders arrive when promised
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Guarantee */}
                <section>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                            <ClockIcon size={32} style={{ color: "#10b981", flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Delivery Time Guarantee</h3>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Every order comes with a delivery estimate. If we miss that deadline without good reason, you may be eligible for compensation or a full refund.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>How Shipping Works on Banadama</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>1</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Delivery Estimate Provided</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Before you purchase, you'll see a clear delivery timeframe (e.g., "5-7 business days").
                                </p>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>2</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Ops Team Coordinates</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Our operations team works with the supplier and logistics partners to arrange shipping.
                                </p>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>3</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Real-Time Tracking</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Track your shipment from dispatch to delivery with live updates in your dashboard.
                                </p>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "#10b981", minWidth: 40 }}>4</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Delivery Confirmation</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    You receive your order and confirm delivery, triggering escrow release.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Delivery Timeframes */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Typical Delivery Timeframes</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                        <MapPinIcon size={18} style={{ color: "var(--bd-brand)" }} />
                                        <h4 style={{ fontWeight: 900, margin: 0 }}>Local (Same City)</h4>
                                    </div>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Nigeria & Bangladesh
                                    </p>
                                </div>
                                <div style={{ fontWeight: 900, fontSize: 20, color: "var(--bd-brand)" }}>1-3 Days</div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                        <MapPinIcon size={18} style={{ color: "var(--bd-brand)" }} />
                                        <h4 style={{ fontWeight: 900, margin: 0 }}>Domestic (Same Country)</h4>
                                    </div>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Within Nigeria or Bangladesh
                                    </p>
                                </div>
                                <div style={{ fontWeight: 900, fontSize: 20, color: "var(--bd-brand)" }}>3-7 Days</div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                        <MapPinIcon size={18} style={{ color: "var(--bd-brand)" }} />
                                        <h4 style={{ fontWeight: 900, margin: 0 }}>International</h4>
                                    </div>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Cross-border shipments
                                    </p>
                                </div>
                                <div style={{ fontWeight: 900, fontSize: 20, color: "var(--bd-brand)" }}>10-21 Days</div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                        <MapPinIcon size={18} style={{ color: "var(--bd-brand)" }} />
                                        <h4 style={{ fontWeight: 900, margin: 0 }}>Digital Products</h4>
                                    </div>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Instant download or email delivery
                                    </p>
                                </div>
                                <div style={{ fontWeight: 900, fontSize: 20, color: "#10b981" }}>Instant</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Guarantee */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>What We Guarantee</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Accurate Estimates:</strong> Delivery times are based on supplier location, your address, and logistics data
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Ops Management:</strong> Our team actively monitors and coordinates every shipment
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Proactive Updates:</strong> You'll be notified of any delays immediately
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Compensation for Delays:</strong> Significant delays may result in partial refunds or credits
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Full Refund if Not Delivered:</strong> If your order never arrives, you get your money back
                            </div>
                        </div>
                    </div>
                </section>

                {/* Delays & Exceptions */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Delays & Exceptions</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.3)" }}>
                        <h4 style={{ fontWeight: 900, marginBottom: 12 }}>Factors That May Cause Delays:</h4>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                            <li><strong>Customs Clearance:</strong> International shipments may be delayed by customs (beyond our control)</li>
                            <li><strong>Weather Events:</strong> Natural disasters, severe storms, flooding</li>
                            <li><strong>Public Holidays:</strong> Local or national holidays affecting logistics</li>
                            <li><strong>Remote Locations:</strong> Hard-to-reach areas may take longer</li>
                            <li><strong>Force Majeure:</strong> Wars, pandemics, civil unrest</li>
                        </ul>
                        <p style={{ marginTop: 16, color: "var(--bd-muted)", fontSize: 14 }}>
                            <strong>Note:</strong> In these cases, we'll keep you informed and work to minimize delays. Your funds remain in escrow until delivery.
                        </p>
                    </div>
                </section>

                {/* Track Your Order */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Track Your Order</h2>
                    <div className="bd-card bd-card-pad">
                        <p style={{ color: "var(--bd-muted)", marginBottom: 16 }}>
                            Stay updated on your shipment status:
                        </p>
                        <div style={{ display: "grid", gap: 8 }}>
                            <div>✓ Order Confirmed</div>
                            <div>✓ Processing (Supplier preparing your order)</div>
                            <div>✓ Shipped (In transit)</div>
                            <div>✓ Out for Delivery</div>
                            <div>✓ Delivered</div>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <a href="/support/order-status" className="bd-btn bd-btn-primary">
                                Track My Order
                            </a>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Questions About Shipping?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                        Our support team is ready to help
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/support/live-chat" className="bd-btn bd-btn-primary">Live Chat</a>
                        <a href="/help" className="bd-btn">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
