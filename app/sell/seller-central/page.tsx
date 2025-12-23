import { Icons } from "@/components/icons/icons";

export default function SellerCentralPage() {
    const LayoutDashboardIcon = Icons.get("Grid");
    const PackageIcon = Icons.get("Package");
    const BarChartIcon = Icons.get("BarChart");
    const MessageCircleIcon = Icons.get("Chat");
    const SettingsIcon = Icons.get("Settings");
    const CheckCircleIcon = Icons.get("Check");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <LayoutDashboardIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Seller Central</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Your complete hub for managing products, orders, and growing your business
                </p>
            </div>

            <div style={{ maxWidth: 1000, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Quick Access */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20, textAlign: "center" }}>Seller Central Features</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                        <a href="/supplier/dashboard" className="bd-card bd-card-pad" style={{ textDecoration: "none", cursor: "pointer" }}>
                            <LayoutDashboardIcon size={40} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Dashboard</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Overview of sales, orders, and key metrics
                            </p>
                        </a>

                        <a href="/supplier/products" className="bd-card bd-card-pad" style={{ textDecoration: "none", cursor: "pointer" }}>
                            <PackageIcon size={40} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Manage Products</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Add, edit, and organize your product listings
                            </p>
                        </a>

                        <a href="/supplier/orders" className="bd-card bd-card-pad" style={{ textDecoration: "none", cursor: "pointer" }}>
                            <PackageIcon size={40} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Order Management</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Process orders and manage fulfillment
                            </p>
                        </a>

                        <a href="/supplier/analytics" className="bd-card bd-card-pad" style={{ textDecoration: "none", cursor: "pointer" }}>
                            <BarChartIcon size={40} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Analytics</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Track performance and sales trends
                            </p>
                        </a>

                        <a href="/supplier/messages" className="bd-card bd-card-pad" style={{ textDecoration: "none", cursor: "pointer" }}>
                            <MessageCircleIcon size={40} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Buyer Messages</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Communicate with buyers and respond to RFQs
                            </p>
                        </a>

                        <a href="/supplier/settings" className="bd-card bd-card-pad" style={{ textDecoration: "none", cursor: "pointer" }}>
                            <SettingsIcon size={40} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Settings</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Configure your store and payment preferences
                            </p>
                        </a>
                    </div>
                </section>

                {/* Key Features */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>What You Can Do in Seller Central</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 12 }}>Product Management</h4>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                                <li>Create and edit product listings with photos, descriptions, and pricing</li>
                                <li>Manage inventory levels and stock availability</li>
                                <li>Set up bulk pricing and volume discounts</li>
                                <li>Organize products by categories and tags</li>
                                <li>Bulk upload products via CSV</li>
                            </ul>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 12 }}>Order Fulfillment</h4>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                                <li>View and manage all incoming orders</li>
                                <li>Print shipping labels and packing slips</li>
                                <li>Update order status and tracking information</li>
                                <li>Coordinate with Ops team for logistics support</li>
                                <li>Handle returns and refund requests</li>
                            </ul>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 12 }}>RFQ Management</h4>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                                <li>Receive custom quote requests from buyers</li>
                                <li>Create detailed proposals with pricing and terms</li>
                                <li>Negotiate through secure messaging</li>
                                <li>Convert approved quotes to orders</li>
                                <li>Track RFQ performance metrics</li>
                            </ul>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 12 }}>Analytics & Insights</h4>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                                <li>Real-time sales and revenue tracking</li>
                                <li>Product performance metrics</li>
                                <li>Customer demographics and behavior</li>
                                <li>Traffic sources and conversion rates</li>
                                <li>Export reports for accounting</li>
                            </ul>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 12 }}>Financial Management</h4>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                                <li>View earnings and payout schedule</li>
                                <li>Download invoices and tax documents</li>
                                <li>Manage bank account and payment methods</li>
                                <li>Track platform fees and commissions</li>
                                <li>Monitor escrow status for active orders</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Best Practices */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Seller Best Practices</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        <div style={{ display: "grid", gap: 12 }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>High-quality photos:</strong> Use clear, professional images from multiple angles</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Accurate descriptions:</strong> Be honest and detailed about product specifications</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Competitive pricing:</strong> Research market rates and offer fair prices</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Fast response:</strong> Reply to buyer messages within 24 hours</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>On-time shipping:</strong> Ship orders within promised timeframes</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Professional service:</strong> Maintain high standards for customer satisfaction</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resources */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Seller Resources</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                        <a href="/help" className="bd-card bd-card-pad" style={{ textDecoration: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Help Center</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Find answers to common questions
                            </p>
                        </a>

                        <a href="/info/product-listing-policy" className="bd-card bd-card-pad" style={{ textDecoration: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Listing Policy</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Understand what you can and cannot sell
                            </p>
                        </a>

                        <a href="/blog" className="bd-card bd-card-pad" style={{ textDecoration: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Seller Blog</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Tips and strategies for growing sales
                            </p>
                        </a>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Not a Seller Yet?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                        Join Banadama and start selling today
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/sell/start" className="bd-btn bd-btn-primary">Get Started</a>
                        <a href="/support/live-chat" className="bd-btn">Contact Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
