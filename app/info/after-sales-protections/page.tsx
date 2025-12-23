import { Icons } from "@/components/icons/icons";

export default function AfterSalesProtectionsPage() {
    const ShieldIcon = Icons.get("Shield");
    const HeadphonesIcon = Icons.get("Headphones");
    const CheckCircleIcon = Icons.get("Check");
    const AlertTriangleIcon = Icons.get("Warning");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <ShieldIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>After-Sales Protections</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Your protection doesn't end at delivery
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Introduction */}
                <section>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                            <HeadphonesIcon size={32} style={{ color: "#10b981", flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Ongoing Support After Purchase</h3>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Even after you receive your order, Banadama continues to protect your rights and ensure satisfaction.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Protection Features */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>What's Protected After Delivery</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Quality Issues</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        If the product has defects or quality issues not visible during initial inspection, you can open a dispute within the protection period.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Missing Parts or Accessories</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        If your product is missing components mentioned in the listing, we'll work with the supplier for a resolution.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Functionality Problems</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Products that don't work as advertised are covered. We'll facilitate repair, replacement, or refund.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Warranty Support</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        We help coordinate warranty claims with suppliers for eligible products.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Dispute Mediation</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Our Ops team mediates disputes fairly between buyers and suppliers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How to Get Support */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>How to Get After-Sales Support</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>1</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Contact the Supplier</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Use the order messaging system to describe the issue to the supplier first.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>2</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Document the Issue</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Take photos or videos showing the problem. This will help speed up resolution.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>3</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Open a Dispute if Needed</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    If the supplier doesn't respond or you can't reach an agreement, open a formal dispute.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "#10b981", minWidth: 40 }}>4</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Ops Team Steps In</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Our operations team reviews the case, examines evidence, and mediates a fair solution.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Protection Timeline */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>After-Sales Protection Timeline</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Inspection Period</h4>
                            <div style={{ fontSize: 32, fontWeight: 900, color: "var(--bd-brand)", marginBottom: 8 }}>7 Days</div>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Physical products: You have 7 days to inspect and report issues
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Extended Issues</h4>
                            <div style={{ fontSize: 32, fontWeight: 900, color: "var(--bd-brand)", marginBottom: 8 }}>30 Days</div>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Hidden defects or quality issues discovered within 30 days
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Warranty Period</h4>
                            <div style={{ fontSize: 32, fontWeight: 900, color: "var(--bd-brand)", marginBottom: 8 }}>Varies</div>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Manufacturer/supplier warranty as stated in product listing
                            </p>
                        </div>
                    </div>
                </section>

                {/* Resolution Options */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Possible Resolutions</h2>
                    <div className="bd-card bd-card-pad">
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                            <li><strong>Full Refund:</strong> If the issue is severe or cannot be fixed</li>
                            <li><strong>Partial Refund:</strong> For minor issues or missing accessories</li>
                            <li><strong>Replacement:</strong> Supplier sends a replacement product at no cost</li>
                            <li><strong>Repair:</strong> Product is repaired and returned (for expensive items)</li>
                            <li><strong>Store Credit:</strong> Credit for use on future purchases</li>
                        </ul>
                    </div>
                </section>

                {/* Important Notes */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Important to Know</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.3)" }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "start", marginBottom: 12 }}>
                            <AlertTriangleIcon size={20} style={{ color: "#f97316", flexShrink: 0 }} />
                            <div>
                                <strong>Report Issues Promptly:</strong> The sooner you report a problem, the easier it is to resolve.
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start", marginBottom: 12 }}>
                            <AlertTriangleIcon size={20} style={{ color: "#f97316", flexShrink: 0 }} />
                            <div>
                                <strong>Keep Packaging:</strong> For returns or replacements, original packaging is often required.
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start", marginBottom: 12 }}>
                            <AlertTriangleIcon size={20} style={{ color: "#f97316", flexShrink: 0 }} />
                            <div>
                                <strong>Don't Confirm Delivery Prematurely:</strong> Only confirm after you've thoroughly inspected the product.
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <AlertTriangleIcon size={20} style={{ color: "#f97316", flexShrink: 0 }} />
                            <div>
                                <strong>Document Everything:</strong> Photos, videos, and written communication strengthen your case.
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Need After-Sales Support?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                        We're here to help resolve any issues
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/buyer/orders" className="bd-btn bd-btn-primary">My Orders</a>
                        <a href="/support/live-chat" className="bd-btn">Live Chat</a>
                        <a href="/help" className="bd-btn">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
