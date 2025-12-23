import { Icons } from "@/components/icons/icons";

export default function PartnershipsPage() {
    const HandshakeIcon = Icons.get("Users");
    const BriefcaseIcon = Icons.get("Briefcase");
    const TrendingUpIcon = Icons.get("TrendingUp");
    const CheckCircleIcon = Icons.get("Check");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "80px 20px" }}>
                <HandshakeIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 42, marginBottom: 12 }}>Partnerships</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 20, maxWidth: 700, margin: "0 auto" }}>
                    Grow together. Partner with Banadama to expand your reach and unlock new opportunities.
                </p>
            </div>

            <div style={{ maxWidth: 1000, margin: "60px auto", display: "grid", gap: 60 }}>
                {/* Partnership Types */}
                <section>
                    <h2 className="bd-h2" style={{ textAlign: "center", marginBottom: 40 }}>Partnership Opportunities</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                        <div className="bd-card bd-card-pad">
                            <BriefcaseIcon size={40} style={{ marginBottom: 16, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Strategic Partners</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6 }}>
                                Large suppliers, manufacturers, and distributors looking for exclusive marketplace arrangements and co-marketing opportunities.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <TrendingUpIcon size={40} style={{ marginBottom: 16, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Affiliate Partners</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6 }}>
                                Content creators, bloggers, and influencers who want to earn commissions by promoting Banadama to their audience.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <HandshakeIcon size={40} style={{ marginBottom: 16, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Logistics Partners</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6 }}>
                                Shipping companies, freight forwarders, and delivery services interested in becoming Banadama's preferred logistics providers.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <BriefcaseIcon size={40} style={{ marginBottom: 16, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Technology Partners</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6 }}>
                                SaaS platforms, API integrations, and tech companies that want to integrate with or complement Banadama's ecosystem.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <HandshakeIcon size={40} style={{ marginBottom: 16, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Financial Partners</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6 }}>
                                Banks, fintech companies, and payment processors interested in offering financing solutions to our buyers and suppliers.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <TrendingUpIcon size={40} style={{ marginBottom: 16, color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Agency Partners</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6 }}>
                                Marketing agencies, consultancies, and business development firms who want to offer Banadama as a solution to their clients.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Strategic Partner Benefits */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Strategic Partner Benefits</h2>
                    <div className="bd-card bd-card-pad">
                        <div style={{ display: "grid", gap: 12 }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Dedicated Account Manager:</strong> Personal support from our partnerships team</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Co-Marketing Opportunities:</strong> Joint campaigns, featured placements, and promotional support</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Reduced Commission Rates:</strong> Negotiated fees based on volume and exclusivity</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Priority Support:</strong> Fast-track issue resolution and technical assistance</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>API Access:</strong> Custom integrations and automated workflows</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div><strong>Data & Insights:</strong> Advanced analytics and market intelligence</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Become a Partner */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 30 }}>How to Become a Partner</h2>
                    <div style={{ display: "grid", gap: 20 }}>
                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "var(--bd-brand)", minWidth: 50 }}>1</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Submit Application</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Fill out our partnership inquiry form with details about your business and proposed collaboration.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "var(--bd-brand)", minWidth: 50 }}>2</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Initial Discussion</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Our partnerships team will review your application and schedule a discovery call to explore fit and opportunities.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "var(--bd-brand)", minWidth: 50 }}>3</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Proposal & Negotiation</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    We'll create a customized partnership proposal with terms, benefits, and expectations.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "#10b981", minWidth: 50 }}>4</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Agreement & Launch</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Sign the partnership agreement and work with us to launch the collaboration successfully.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Partnership Inquiry</h2>
                    <div className="bd-card bd-card-pad">
                        <form style={{ display: "grid", gap: 16 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Your Name *</label>
                                    <input type="text" className="bd-input" placeholder="John Doe" required />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Company Name *</label>
                                    <input type="text" className="bd-input" placeholder="Acme Corp" required />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Email Address *</label>
                                <input type="email" className="bd-input" placeholder="you@company.com" required />
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Partnership Type *</label>
                                <select className="bd-input" required>
                                    <option value="">Select partnership type</option>
                                    <option value="strategic">Strategic Partner</option>
                                    <option value="affiliate">Affiliate Partner</option>
                                    <option value="logistics">Logistics Partner</option>
                                    <option value="technology">Technology Partner</option>
                                    <option value="financial">Financial Partner</option>
                                    <option value="agency">Agency Partner</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Tell Us About Your Proposal *</label>
                                <textarea className="bd-input" rows={6} placeholder="Describe your business, what you're proposing, and how we can work together..." required />
                            </div>

                            <button type="submit" className="bd-btn bd-btn-primary bd-btn-lg">
                                Submit Inquiry
                            </button>
                        </form>
                    </div>
                </section>

                {/* Contact Info */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Have Questions?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                        Our partnerships team is here to help
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="mailto:partnerships@banadama.com" className="bd-btn bd-btn-primary">
                            partnerships@banadama.com
                        </a>
                        <a href="/support/live-chat" className="bd-btn">Live Chat</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
