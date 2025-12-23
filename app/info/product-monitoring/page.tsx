import { Icons } from "@/components/icons/icons";

export default function ProductMonitoringPage() {
    const EyeIcon = Icons.get("Eye");
    const ShieldCheckIcon = Icons.get("ShieldCheck");
    const CheckCircleIcon = Icons.get("Check");
    const AlertTriangleIcon = Icons.get("Warning");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <EyeIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Product Monitoring Services</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    We actively monitor products to ensure quality and safety
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Introduction */}
                <section>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                            <ShieldCheckIcon size={32} style={{ color: "#10b981", flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Proactive Quality Control</h3>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Banadama doesn't just connect buyers and sellers—we actively monitor product quality, supplier behavior, and marketplace integrity to protect you.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Monitor */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>What We Monitor</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Product Listings</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        We review listings for accuracy, prohibited items, misleading descriptions, and compliance with our product policy.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Supplier Performance</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Track on-time delivery rates, customer satisfaction, dispute rates, and product quality metrics for all suppliers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Customer Reviews & Ratings</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Monitor reviews for authenticity, detect fake reviews, and flag problematic patterns.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Pricing Anomalies</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Detect unusual price changes, potential scams, or price manipulation attempts.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Intellectual Property</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Scan for counterfeit products, trademark violations, and unauthorized use of copyrighted material.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={24} style={{ color: "var(--bd-success)", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 6 }}>Safety Compliance</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Verify certifications for electronics, food products, cosmetics, and other regulated items.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Monitoring Tools */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Our Monitoring Tools</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>AI Detection</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Machine learning algorithms detect suspicious patterns, fake reviews, and policy violations automatically.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Manual Review</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Our compliance team manually reviews flagged listings and high-risk categories.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Community Reports</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                User reports help us identify problems quickly. Report abuse features are integrated throughout the platform.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Actions We Take */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Actions We Take</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>1</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Warning Notices</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    For minor violations, we send warnings and request corrections.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>2</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Listing Removal</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Prohibited or non-compliant listings are removed immediately.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)", minWidth: 40 }}>3</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Account Suspension</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Repeated violations or serious offenses result in temporary or permanent account suspension.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "#ef4444", minWidth: 40 }}>4</div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Legal Action</h4>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Illegal activities (fraud, counterfeit goods) are reported to authorities.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Transparency */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Transparency & Fairness</h2>
                    <div className="bd-card bd-card-pad">
                        <p style={{ color: "var(--bd-muted)", marginBottom: 16 }}>
                            We believe in fair enforcement:
                        </p>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                            <li>Suppliers are notified when their listings are flagged</li>
                            <li>Clear reasons are provided for removals or suspensions</li>
                            <li>Appeals process available for disputed decisions</li>
                            <li>Regular transparency reports on enforcement actions</li>
                        </ul>
                    </div>
                </section>

                {/* For Buyers */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>How This Protects You</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                            <li><strong>Safer Shopping:</strong> Prohibited and dangerous products are removed before you can buy them</li>
                            <li><strong>Trust in Listings:</strong> Product descriptions are more accurate because we enforce standards</li>
                            <li><strong>Better Suppliers:</strong> Poor-performing suppliers are identified and removed</li>
                            <li><strong>Authentic Reviews:</strong> Fake reviews are detected and deleted</li>
                            <li><strong>Fair Pricing:</strong> Price manipulation is prevented</li>
                        </ul>
                    </div>
                </section>

                {/* Report */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Help Us Monitor</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.3)" }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "start", marginBottom: 16 }}>
                            <AlertTriangleIcon size={24} style={{ color: "#f97316", flexShrink: 0 }} />
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8 }}>See Something Suspicious?</h4>
                                <p style={{ color: "var(--bd-muted)", margin: 0 }}>
                                    You play a vital role in keeping Banadama safe. If you encounter prohibited products, fake listings, or suspicious behavior, please report it.
                                </p>
                            </div>
                        </div>
                        <a href="/support/report-abuse" className="bd-btn bd-btn-primary">
                            Report an Issue
                        </a>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Questions About Product Monitoring?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                        Learn more about our safety and compliance measures
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/info/product-listing-policy" className="bd-btn bd-btn-primary">Product Policy</a>
                        <a href="/help" className="bd-btn">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
