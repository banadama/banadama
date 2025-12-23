import { Icons } from "@/components/icons/icons";

export default function AboutPage() {
    const HeartIcon = Icons.get("Heart");
    const UsersIcon = Icons.get("Users");
    const GlobalIcon = Icons.get("Globe");
    const ShieldIcon = Icons.get("Shield");

    return (
        <div className="bd-container bd-page">
            {/* Hero */}
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "80px 20px" }}>
                <h1 className="bd-h1" style={{ fontSize: 42, marginBottom: 20 }}>About Banadama</h1>
                <p className="bd-p" style={{ fontSize: 20, maxWidth: 700, margin: "0 auto", color: "var(--bd-muted)" }}>
                    Connecting buyers and suppliers through safe, escrow-protected trade across Nigeria, Bangladesh, and globally
                </p>
            </div>

            <div style={{ maxWidth: 900, margin: "60px auto", display: "grid", gap: 60 }}>
                {/* Our Mission */}
                <section>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <HeartIcon size={32} style={{ color: "var(--bd-brand)" }} />
                        <h2 className="bd-h2">Our Mission</h2>
                    </div>
                    <p className="bd-p" style={{ fontSize: 18, lineHeight: 1.8 }}>
                        Banadama exists to make cross-border and local trade safe, transparent, and accessible for everyone. We believe that businesses—from small startups to large factories—deserve a platform where they can buy and sell with confidence, protected by escrow and supported by professional operations management.
                    </p>
                </section>

                {/* Our Story */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 24 }}>Our Story</h2>
                    <div style={{ display: "grid", gap: 20 }}>
                        <p className="bd-p" style={{ lineHeight: 1.8 }}>
                            Founded in 2025, Banadama was born from a simple observation: traditional B2B marketplaces often fail to protect buyers and sellers adequately. Payment fraud, delayed shipments, and quality issues plague cross-border trade, especially in emerging markets like Nigeria and Bangladesh.
                        </p>
                        <p className="bd-p" style={{ lineHeight: 1.8 }}>
                            We set out to change that by building a platform with escrow protection at its core, combined with hands-on operations management to ensure every transaction is completed fairly. Today, Banadama serves thousands of businesses across multiple countries, facilitating millions in secure transactions every month.
                        </p>
                    </div>
                </section>

                {/* What Makes Us Different */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 30 }}>What Makes Us Different</h2>
                    <div style={{ display: "grid", gap: 20 }}>
                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", alignItems: "start", gap: 16 }}>
                                <ShieldIcon size={32} style={{ color: "var(--bd-brand)", flexShrink: 0 }} />
                                <div>
                                    <h3 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Escrow Protection</h3>
                                    <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                        Every transaction is protected by our escrow system. Funds are only released after delivery confirmation, ensuring both buyers and sellers are protected.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", alignItems: "start", gap: 16 }}>
                                <UsersIcon size={32} style={{ color: "var(--bd-brand)", flexShrink: 0 }} />
                                <div>
                                    <h3 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Ops-Managed Fulfillment</h3>
                                    <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                        Our operations team actively manages transactions, coordinating logistics, mediating disputes, and ensuring timely delivery.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", alignItems: "start", gap: 16 }}>
                                <GlobalIcon size={32} style={{ color: "var(--bd-brand)", flexShrink: 0 }} />
                                <div>
                                    <h3 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Local + Global</h3>
                                    <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                        Buy locally in Nigeria or Bangladesh with full RFQ support, or access global products with Buy Now simplicity.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Values */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 30 }}>Our Values</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
                        <div style={{ padding: 20, borderLeft: "4px solid var(--bd-brand)" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Trust</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6 }}>
                                We build trust through transparency, escrow protection, and reliable service.
                            </p>
                        </div>
                        <div style={{ padding: 20, borderLeft: "4px solid var(--bd-brand)" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Fairness</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6 }}>
                                Both buyers and sellers deserve fair treatment and dispute resolution.
                            </p>
                        </div>
                        <div style={{ padding: 20, borderLeft: "4px solid var(--bd-brand)" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Innovation</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6 }}>
                                We continuously improve our platform with new features and better protection.
                            </p>
                        </div>
                        <div style={{ padding: 20, borderLeft: "4px solid var(--bd-brand)" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Accessibility</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6 }}>
                                Trade should be accessible to businesses of all sizes, from startups to enterprises.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Join Us CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                    <h2 className="bd-h2" style={{ marginBottom: 16 }}>Join the Banadama Community</h2>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 30, fontSize: 16 }}>
                        Whether you're buying or selling, Banadama provides the platform and protection you need
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/languages" className="bd-btn bd-btn-primary bd-btn-lg">Get Started</a>
                        <a href="/marketplace" className="bd-btn bd-btn-lg">Browse Marketplace</a>
                        <a href="/sell/start" className="bd-btn bd-btn-lg">Start Selling</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
