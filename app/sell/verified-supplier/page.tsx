import { Icons } from "@/components/icons/icons";

export default function VerifiedSupplierPage() {
    const ShieldCheckIcon = Icons.get("ShieldCheck");
    const CheckCircleIcon = Icons.get("Check");
    const TrendingUpIcon = Icons.get("TrendingUp");
    const AwardIcon = Icons.get("Star");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", textAlign: "center", padding: "80px 20px" }}>
                <ShieldCheckIcon size={64} style={{ margin: "0 auto 20px", color: "white" }} />
                <h1 className="bd-h1" style={{ fontSize: 42, marginBottom: 12, color: "white" }}>Become a Verified Supplier</h1>
                <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 20, maxWidth: 700, margin: "0 auto" }}>
                    Earn buyer trust with official verification. Stand out from the competition.
                </p>
            </div>

            <div style={{ maxWidth: 900, margin: "60px auto", display: "grid", gap: 60 }}>
                {/* What is Verification */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>What is Supplier Verification?</h2>
                    <div className="bd-card bd-card-pad">
                        <p className="bd-p" style={{ lineHeight: 1.8, marginBottom: 16 }}>
                            Verified Supplier status is Banadama's official seal of approval. It shows that your business has been thoroughly vetted and meets our high standards for legitimacy, quality, and professionalism.
                        </p>
                        <p className="bd-p" style={{ lineHeight: 1.8, margin: 0 }}>
                            Verified suppliers display a <strong style={{ color: "#3b82f6" }}>Blue Verification Badge</strong> on their profile and listings, giving buyers confidence that they're dealing with a trusted, authentic business.
                        </p>
                    </div>
                </section>

                {/* Benefits */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 30 }}>Benefits of Verification</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <TrendingUpIcon size={32} style={{ color: "#3b82f6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Increased Trust & Sales</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Verified suppliers see an average 40% increase in conversion rates. Buyers trust verified businesses more.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <AwardIcon size={32} style={{ color: "#3b82f6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Blue Verification Badge</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Display a prominent blue checkmark on your profile, listings, and in search results.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <CheckCircleIcon size={32} style={{ color: "#3b82f6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Higher Search Ranking</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Verified suppliers appear higher in search results and get priority placement in featured sections.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <CheckCircleIcon size={32} style={{ color: "#3b82f6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>More RFQ Opportunities</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Buyers prefer to send RFQs to verified suppliers, giving you more business opportunities.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <CheckCircleIcon size={32} style={{ color: "#3b82f6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Marketing Support</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Featured in our "Verified Supplier" directory and promotional campaigns.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Verification Requirements */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Verification Requirements</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                        <p style={{ marginBottom: 16, fontWeight: 700 }}>To become verified, you must provide:</p>
                        <div style={{ display: "grid", gap: 12 }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "#3b82f6", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>Business Registration:</strong> Official company registration documents (CAC in Nigeria, RJSC in Bangladesh)
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "#3b82f6", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>Tax Identification:</strong> Valid Tax ID or VAT registration number
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "#3b82f6", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>Business Address:</strong> Proof of physical business address (utility bill, lease agreement)
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "#3b82f6", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>Identity Verification:</strong> Government-issued ID of the business owner/director
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "#3b82f6", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>Bank Account:</strong> Business bank account for payouts
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "#3b82f6", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>Product Certifications:</strong> Relevant certifications for regulated products (NAFDAC, CE, ISO, etc.)
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Verification Process */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 30 }}>Verification Process</h2>
                    <div style={{ display: "grid", gap: 20 }}>
                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "#3b82f6", minWidth: 50 }}>1</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Submit Application</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Complete the verification form and upload all required documents through your supplier dashboard.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "#3b82f6", minWidth: 50 }}>2</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Document Review</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Our compliance team reviews your documents for authenticity and completeness (typically 3-5 business days).
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "#3b82f6", minWidth: 50 }}>3</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Business Verification</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    We verify your business registration with government databases and may conduct a phone/video verification call.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 20 }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: "#10b981", minWidth: 50 }}>4</div>
                            <div>
                                <h4 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Approval & Badge</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Once approved, your blue verification badge goes live immediately across your profile and listings!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Verification Pricing</h2>
                    <div className="bd-card bd-card-pad" style={{ textAlign: "center", background: "var(--bd-muted-bg)" }}>
                        <div style={{ fontSize: 14, color: "var(--bd-muted)", marginBottom: 8 }}>One-time verification fee</div>
                        <div style={{ fontSize: 48, fontWeight: 900, color: "#3b82f6", marginBottom: 8 }}>$49</div>
                        <div style={{ fontSize: 14, color: "var(--bd-muted)", marginBottom: 20 }}>Valid for lifetime (annual renewal required)</div>
                        <p style={{ fontSize: 13, color: "var(--bd-muted)", margin: 0 }}>
                            Annual renewal: $19/year to maintain verification status
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", textAlign: "center", padding: "60px 20px" }}>
                    <h3 style={{ fontWeight: 900, fontSize: 32, marginBottom: 16, color: "white" }}>Ready to Get Verified?</h3>
                    <p style={{ color: "rgba(255, 255, 255, 0.9)", marginBottom: 30, fontSize: 18 }}>
                        Join elite suppliers who have earned buyer trust through verification
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/supplier/verification/apply" className="bd-btn bd-btn-lg" style={{ background: "white", color: "#3b82f6", fontWeight: 900 }}>
                            Apply for Verification
                        </a>
                        <a href="/help" className="bd-btn bd-btn-lg" style={{ background: "rgba(255, 255, 255, 0.2)", color: "white", border: "2px solid white" }}>
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
