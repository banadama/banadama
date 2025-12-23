import { Icons } from "@/components/icons/icons";

export default function RFQGuidePage() {
    const FileTextIcon = Icons.get("Document");
    const MessageCircleIcon = Icons.get("Chat");
    const CheckCircleIcon = Icons.get("Check");
    const TrendingUpIcon = Icons.get("TrendingUp");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <FileTextIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Request for Quotation (RFQ)</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Get custom quotes for bulk orders and special requirements
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* What is RFQ */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>What is RFQ?</h2>
                    <div className="bd-card bd-card-pad">
                        <p className="bd-p" style={{ lineHeight: 1.8 }}>
                            Request for Quotation (RFQ) is a procurement process where buyers request customized pricing from suppliers for specific quantities, specifications, or delivery terms. Unlike "Buy Now" listings with fixed prices, RFQ allows you to negotiate based on your unique requirements.
                        </p>
                    </div>
                </section>

                {/* When to Use RFQ */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>When to Use RFQ</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Bulk Orders</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Ordering large quantities? Suppliers often offer better prices for bulk purchases.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Custom Specifications</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Need customized packaging, colors, sizes, or branding? Use RFQ to get quotes for your exact needs.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Special Delivery Terms</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Flexible delivery schedules, multiple shipments, or specific logistics requirements.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Price Negotiation</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Get competitive quotes from multiple suppliers and negotiate the best deal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How RFQ Works */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>How RFQ Works on Banadama</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>1</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Submit Your Request</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Fill out an RFQ form with your product requirements, quantity, delivery location, and timeline. Be as specific as possible.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>2</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Suppliers Respond</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Qualified suppliers review your request and send personalized quotes with pricing, terms, and delivery estimates.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>3</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Compare & Negotiate</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Review quotes, ask questions, and negotiate terms through our messaging system. Compare multiple offers.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>4</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Accept & Pay</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Select the best quote and proceed to payment. Your funds are secured in escrow as always.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "#10b981", minWidth: 40 }}>5</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Order Fulfillment</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    The supplier fulfills your order according to agreed terms. Ops team manages the entire process.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RFQ vs Buy Now */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>RFQ vs Buy Now</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 12, color: "var(--bd-brand)" }}>Request for Quotation (RFQ)</h4>
                            <ul style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
                                <li>Custom pricing based on your needs</li>
                                <li>Negotiate quantities and terms</li>
                                <li>Best for bulk or custom orders</li>
                                <li>Multiple supplier quotes</li>
                                <li>Flexible specifications</li>
                                <li>Takes 1-3 business days for quotes</li>
                            </ul>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 12, color: "#10b981" }}>Buy Now</h4>
                            <ul style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
                                <li>Fixed pricing (no negotiation)</li>
                                <li>Instant purchase</li>
                                <li>Best for small to medium quantities</li>
                                <li>Standard specifications</li>
                                <li>Immediate order processing</li>
                                <li>Fast and convenient</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* What to Include */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>What to Include in Your RFQ</h2>
                    <div className="bd-card bd-card-pad">
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                            <li><strong>Product Details:</strong> Name, model, specifications, features</li>
                            <li><strong>Quantity:</strong> Exact number of units needed (or range)</li>
                            <li><strong>Customization:</strong> Colors, sizes, packaging, branding requirements</li>
                            <li><strong>Quality Standards:</strong> Certifications needed (CE, FDA, etc.)</li>
                            <li><strong>Delivery Location:</strong> Full shipping address</li>
                            <li><strong>Timeline:</strong> When you need the products delivered</li>
                            <li><strong>Budget Range:</strong> Optional but helps suppliers provide realistic quotes</li>
                            <li><strong>Payment Terms:</strong> Any special payment requirements</li>
                            <li><strong>Additional Requirements:</strong> Samples, warranties, after-sales support</li>
                        </ul>
                    </div>
                </section>

                {/* Tips */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Tips for Successful RFQs</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <TrendingUpIcon size={20} style={{ color: "var(--bd-brand)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Be Specific:</strong> The more details you provide, the more accurate the quotes will be
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <TrendingUpIcon size={20} style={{ color: "var(--bd-brand)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Request Samples:</strong> For large orders, always request samples before committing
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <TrendingUpIcon size={20} style={{ color: "var(--bd-brand)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Compare Multiple Quotes:</strong> Get at least 3-5 quotes for best pricing
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <TrendingUpIcon size={20} style={{ color: "var(--bd-brand)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Check Supplier Ratings:</strong> Review supplier history and buyer feedback
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <TrendingUpIcon size={20} style={{ color: "var(--bd-brand)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Negotiate:</strong> Don't accept the first quote - suppliers expect negotiation
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <TrendingUpIcon size={20} style={{ color: "var(--bd-brand)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Document Everything:</strong> Keep all communications and agreements in writing
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Ready to Submit an RFQ?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                        Get custom quotes from verified suppliers
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/buyer/rfq/new" className="bd-btn bd-btn-primary">Submit RFQ</a>
                        <a href="/marketplace" className="bd-btn">Browse Marketplace</a>
                        <a href="/help" className="bd-btn">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
