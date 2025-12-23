import { Icons } from "@/components/icons/icons";

export default function StartSellingPage() {
    const RocketIcon = Icons.get("TrendingUp");
    const CheckCircleIcon = Icons.get("Check");
    const DollarIcon = Icons.get("CreditCard");
    const UsersIcon = Icons.get("Users");
    const ShieldIcon = Icons.get("Shield");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", textAlign: "center", padding: "80px 20px" }}>
                <RocketIcon size={64} style={{ margin: "0 auto 20px", color: "white" }} />
                <h1 className="bd-h1" style={{ fontSize: 42, marginBottom: 12, color: "white" }}>Start Selling on Banadama</h1>
                <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 20, maxWidth: 700, margin: "0 auto" }}>
                    Reach buyers across Nigeria, Bangladesh, and globally. Grow your business with trusted escrow protection.
                </p>
            </div>

            <div style={{ maxWidth: 1000, margin: "60px auto", display: "grid", gap: 60 }}>
                {/* Why Sell on Banadama */}
                <section>
                    <h2 className="bd-h2" style={{ textAlign: "center", marginBottom: 40 }}>Why Sell on Banadama?</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                        <div className="bd-card bd-card-pad" style={{ textAlign: "center" }}>
                            <UsersIcon size={48} style={{ margin: "0 auto 16px", color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Access to Buyers</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                                Connect with verified buyers from Nigeria, Bangladesh, and international markets
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ textAlign: "center" }}>
                            <ShieldIcon size={48} style={{ margin: "0 auto 16px", color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Escrow Protection</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                                Get paid securely. Funds are guaranteed once you fulfill the order
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ textAlign: "center" }}>
                            <DollarIcon size={48} style={{ margin: "0 auto 16px", color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Low Fees</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                                Competitive commission rates. Keep more of what you earn
                            </p>
                        </div>
                    </div>
                </section>

                {/* How to Get Started */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 30 }}>How to Get Started</h2>
                    <div style={{ display: "grid", gap: 20 }}>
                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "var(--bd-brand)", minWidth: 50 }}>1</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Create Your Account</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Sign up for free and choose "Supplier" as your account type. Provide your business details and contact information.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "var(--bd-brand)", minWidth: 50 }}>2</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Set Up Your Store</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Add your company profile, upload your logo, and configure your shipping preferences and payment methods.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "var(--bd-brand)", minWidth: 50 }}>3</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>List Your Products</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Create product listings with photos, descriptions, pricing, and inventory. Follow our Product Listing Policy.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "#10b981", minWidth: 50 }}>4</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Start Selling</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Receive orders, fulfill them on time, and get paid through our secure escrow system. Build your reputation!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What You Can Sell */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>What You Can Sell</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Physical Products</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                                Electronics, fashion, home goods, industrial supplies, and more
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Digital Products</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                                Software, templates, ebooks, courses, graphics, and digital downloads
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Services</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                                Local services, consulting, professional work, and freelance offerings
                            </p>
                        </div>
                    </div>
                </section>

                {/* Seller Benefits */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Seller Benefits</h2>
                    <div className="bd-card bd-card-pad">
                        <div style={{ display: "grid", gap: 12 }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Free to list:</strong> No upfront costs to list your products</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Verified badge:</strong> Build trust with verified supplier status</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>RFQ access:</strong> Receive custom quote requests from buyers</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Analytics dashboard:</strong> Track sales, traffic, and performance</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Marketing tools:</strong> Promote your products to reach more buyers</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>24/7 support:</strong> Dedicated seller support team</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Simple, Transparent Pricing</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginBottom: 20 }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 14, color: "var(--bd-muted)", marginBottom: 4 }}>Commission</div>
                                <div style={{ fontSize: 32, fontWeight: 900, color: "var(--bd-brand)" }}>5%</div>
                                <div style={{ fontSize: 13, color: "var(--bd-muted)" }}>On completed sales</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 14, color: "var(--bd-muted)", marginBottom: 4 }}>Listing Fee</div>
                                <div style={{ fontSize: 32, fontWeight: 900, color: "#10b981" }}>$0</div>
                                <div style={{ fontSize: 13, color: "var(--bd-muted)" }}>Free to list products</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 14, color: "var(--bd-muted)", marginBottom: 4 }}>Payout Time</div>
                                <div style={{ fontSize: 32, fontWeight: 900, color: "var(--bd-brand)" }}>7</div>
                                <div style={{ fontSize: 13, color: "var(--bd-muted)" }}>Days after delivery</div>
                            </div>
                        </div>
                        <p style={{ textAlign: "center", color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                            No hidden fees. You only pay when you make a sale.
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "linear-gradient(135deg, var(--bd-brand) 0%, #f97316 100%)", textAlign: "center", padding: "60px 20px" }}>
                    <h3 style={{ fontWeight: 900, fontSize: 32, marginBottom: 16, color: "white" }}>Ready to Start Selling?</h3>
                    <p style={{ color: "rgba(255, 255, 255, 0.9)", marginBottom: 30, fontSize: 18 }}>
                        Join thousands of suppliers already growing their business on Banadama
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/languages?type=supplier" className="bd-btn bd-btn-lg" style={{ background: "white", color: "var(--bd-brand)", fontWeight: 900 }}>
                            Create Supplier Account
                        </a>
                        <a href="/sell/seller-central" className="bd-btn bd-btn-lg" style={{ background: "rgba(255, 255, 255, 0.2)", color: "white", border: "2px solid white" }}>
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
