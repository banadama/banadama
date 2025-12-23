import { Icons } from "@/components/icons/icons";

export default function CorporateResponsibilityPage() {
    const HeartIcon = Icons.get("Heart");
    const LeafIcon = Icons.get("Layers");
    const UsersIcon = Icons.get("Users");
    const ShieldIcon = Icons.get("Shield");
    const CheckCircleIcon = Icons.get("Check");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", textAlign: "center", padding: "80px 20px" }}>
                <HeartIcon size={64} style={{ margin: "0 auto 20px", color: "white" }} />
                <h1 className="bd-h1" style={{ fontSize: 42, marginBottom: 12, color: "white" }}>Corporate Responsibility</h1>
                <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 20, maxWidth: 700, margin: "0 auto" }}>
                    Building a marketplace that benefits everyone — suppliers, buyers, and communities
                </p>
            </div>

            <div style={{ maxWidth: 900, margin: "60px auto", display: "grid", gap: 60 }}>
                {/* Our Commitment */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Our Commitment</h2>
                    <div className="bd-card bd-card-pad">
                        <p className="bd-p" style={{ lineHeight: 1.8 }}>
                            At Banadama, we believe business success goes hand-in-hand with social and environmental responsibility. We're committed to creating positive impact while fostering fair, sustainable trade between Nigeria, Bangladesh, and the world.
                        </p>
                    </div>
                </section>

                {/* Pillars */}
                <section>
                    <h2 className="bd-h2" style={{ textAlign: "center", marginBottom: 40 }}>Our Responsibility Pillars</h2>
                    <div style={{ display: "grid", gap: 24 }}>
                        {/* Fair Trade */}
                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <ShieldIcon size={40} style={{ color: "#10b981", flexShrink: 0 }} />
                                <div>
                                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Fair & Ethical Trade</h3>
                                    <p style={{ color: "var(--bd-muted)", lineHeight: 1.8, marginBottom: 16 }}>
                                        We ensure fair treatment for all participants in our marketplace:
                                    </p>
                                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                                        <li>Escrow protection guarantees payment for suppliers</li>
                                        <li>Zero tolerance for exploitative pricing or labor practices</li>
                                        <li>Verification process ensures legitimate, ethical businesses</li>
                                        <li>Support for small and medium enterprises (SMEs)</li>
                                        <li>Transparent fees with no hidden charges</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Economic Empowerment */}
                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <UsersIcon size={40} style={{ color: "#10b981", flexShrink: 0 }} />
                                <div>
                                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Economic Empowerment</h3>
                                    <p style={{ color: "var(--bd-muted)", lineHeight: 1.8, marginBottom: 16 }}>
                                        We create opportunities for economic growth in underserved markets:
                                    </p>
                                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                                        <li>Connecting Nigerian and Bangladeshi suppliers to global buyers</li>
                                        <li>Free training and resources for small businesses</li>
                                        <li>Digital tools that level the playing field</li>
                                        <li>Support for women-owned and minority-owned businesses</li>
                                        <li>Job creation through marketplace expansion</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Environmental Sustainability */}
                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <LeafIcon size={40} style={{ color: "#10b981", flexShrink: 0 }} />
                                <div>
                                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Environmental Sustainability</h3>
                                    <p style={{ color: "var(--bd-muted)", lineHeight: 1.8, marginBottom: 16 }}>
                                        We're taking steps to minimize our environmental footprint:
                                    </p>
                                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                                        <li>Promoting eco-friendly products and sustainable suppliers</li>
                                        <li>Optimizing logistics to reduce carbon emissions</li>
                                        <li>Digital-first operations to minimize paper waste</li>
                                        <li>Encouraging bulk ordering to reduce packaging waste</li>
                                        <li>Partnering with green logistics providers</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Community Development */}
                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <HeartIcon size={40} style={{ color: "#10b981", flexShrink: 0 }} />
                                <div>
                                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Community Development</h3>
                                    <p style={{ color: "var(--bd-muted)", lineHeight: 1.8, marginBottom: 16 }}>
                                        We invest in the communities where we operate:
                                    </p>
                                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                                        <li>Free e-commerce training for local entrepreneurs</li>
                                        <li>Partnerships with educational institutions</li>
                                        <li>Supporting local artisans and craftspeople</li>
                                        <li>Tech literacy programs in underserved areas</li>
                                        <li>Youth employment and internship programs</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2025 Goals */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>2025 Responsibility Goals</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        <div style={{ display: "grid", gap: 12 }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Onboard 10,000 SMEs:</strong> Help 10,000 small and medium businesses go digital</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>50% Women Suppliers:</strong> Ensure at least 50% of new verified suppliers are women-owned businesses</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Carbon Neutral Shipping:</strong> Offset 100% of carbon emissions from platform-facilitated shipments</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Train 5,000 Entrepreneurs:</strong> Provide free e-commerce training to 5,000 aspiring entrepreneurs</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Zero Tolerance Enforcement:</strong> Maintain 100% compliance with anti-fraud and anti-exploitation policies</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Transparency  */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Transparency & Accountability</h2>
                    <div className="bd-card bd-card-pad">
                        <p style={{ color: "var(--bd-muted)", lineHeight: 1.8, marginBottom: 16 }}>
                            We believe in being transparent about our progress:
                        </p>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                            <li>Annual Corporate Responsibility Report (published each year)</li>
                            <li>Public disclosure of diversity and inclusion metrics</li>
                            <li>Regular audits of our supply chain and operations</li>
                            <li>Open communication with stakeholders</li>
                            <li>Third-party verification of our impact claims</li>
                        </ul>
                    </div>
                </section>

                {/* Get Involved */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Get Involved</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>For Suppliers</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, marginBottom: 12 }}>
                                Join our sustainable supplier program
                            </p>
                            <a href="/sell/start" className="bd-btn bd-btn-sm">Learn More</a>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>For Buyers</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, marginBottom: 12 }}>
                                Support ethical businesses
                            </p>
                            <a href="/marketplace" className="bd-btn bd-btn-sm">Shop Now</a>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Partnerships</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, marginBottom: 12 }}>
                                Collaborate on social impact projects
                            </p>
                            <a href="/sell/partnerships" className="bd-btn bd-btn-sm">Contact Us</a>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Questions About Our Impact?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                        We're happy to discuss our corporate responsibility initiatives
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="mailto:responsibility@banadama.com" className="bd-btn bd-btn-primary">responsibility@banadama.com</a>
                        <a href="/about" className="bd-btn">About Banadama</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
