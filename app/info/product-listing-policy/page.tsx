import { Icons } from "@/components/icons/icons";

export default function ProductListingPolicyPage() {
    const FileCheckIcon = Icons.get("FileCheck");
    const ShieldCheckIcon = Icons.get("ShieldCheck");
    const AlertTriangleIcon = Icons.get("Warning");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <FileCheckIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Product Listing Policy</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                    Last updated: December 22, 2025
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Introduction */}
                <section>
                    <h2 className="bd-h2">Introduction</h2>
                    <p className="bd-p">
                        Welcome to Banadama's Product Listing Policy. This policy outlines the requirements and guidelines for listing products on our marketplace. All suppliers, creators, and sellers must comply with these rules to maintain a safe, trustworthy platform for all users.
                    </p>
                </section>

                {/* General Requirements */}
                <section>
                    <h2 className="bd-h2">1. General Listing Requirements</h2>
                    <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                        <h3 style={{ fontWeight: 900, marginBottom: 12 }}>1.1 Accurate Information</h3>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                            <li>Product titles must clearly describe the item</li>
                            <li>Descriptions must be accurate and not misleading</li>
                            <li>Images must show the actual product being sold</li>
                            <li>Prices must be current and include all mandatory fees</li>
                            <li>Stock quantities must be kept up-to-date</li>
                        </ul>
                    </div>

                    <div className="bd-card bd-card-pad" style={{ boxShadow: "none", marginTop: 16 }}>
                        <h3 style={{ fontWeight: 900, marginBottom: 12 }}>1.2 Product Images</h3>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                            <li>Minimum 3 high-quality images per listing</li>
                            <li>Images must be clear, well-lit, and show product details</li>
                            <li>No watermarks except your business logo</li>
                            <li>Main image should be on white or neutral background</li>
                            <li>No stock photos unless you're an authorized reseller</li>
                        </ul>
                    </div>

                    <div className="bd-card bd-card bd-card-pad" style={{ boxShadow: "none", marginTop: 16 }}>
                        <h3 style={{ fontWeight: 900, marginBottom: 12 }}>1.3 Pricing</h3>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                            <li>Buy Now prices must be honored for at least 7 days</li>
                            <li>MOQ (Minimum Order Quantity) must be clearly stated</li>
                            <li>Currency must match your operating country (NGN for Nigeria, BDT for Bangladesh, USD for global)</li>
                            <li>Volume discounts can be offered through RFQ</li>
                            <li>No price manipulation or hidden fees</li>
                        </ul>
                    </div>
                </section>

                {/* Prohibited Products */}
                <section>
                    <h2 className="bd-h2">2. Prohibited Products</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <AlertTriangleIcon size={24} style={{ color: "#ef4444", flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontWeight: 900, marginBottom: 12, color: "#ef4444" }}>Strictly Prohibited Items</h3>
                                <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                                    <li><strong>Illegal Goods:</strong> Any items prohibited by Nigerian or Bangladeshi law</li>
                                    <li><strong>Counterfeit Items:</strong> Fake or replica products of any brand</li>
                                    <li><strong>Weapons:</strong> Firearms, ammunition, explosives, knives (except kitchen cutlery)</li>
                                    <li><strong>Drugs:</strong> Illegal drugs, controlled substances, prescription medications</li>
                                    <li><strong>Adult Content:</strong> Pornography, adult toys, explicit materials</li>
                                    <li><strong>Hazardous Materials:</strong> Toxic chemicals, flammable liquids (except regulated)</li>
                                    <li><strong>Stolen Goods:</strong> Items obtained through theft or fraud</li>
                                    <li><strong>Human Parts:</strong> Organs, blood, body fluids</li>
                                    <li><strong>Wildlife:</strong> Endangered species or protected animals/plants</li>
                                    <li><strong>Tobacco:</strong> Cigarettes, cigars, vaping products (restricted)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Restricted Categories */}
                <section>
                    <h2 className="bd-h2">3. Restricted Categories Require Verification</h2>
                    <p className="bd-p">The following categories require supplier verification before listing:</p>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Electronics & Technology</h4>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
                                <li>Proof of authenticity or authorized reseller status</li>
                                <li>Safety certifications for electronic devices</li>
                                <li>Warranty information must be clearly stated</li>
                            </ul>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Health & Beauty</h4>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
                                <li>NAFDAC (Nigeria) or relevant regulatory approval</li>
                                <li>Ingredients list and expiry dates</li>
                                <li>No medical claims without proper authorization</li>
                            </ul>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Food & Beverages</h4>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
                                <li>Food safety certifications required</li>
                                <li>Clear labeling with ingredients, allergens, and expiry</li>
                                <li>Storage and handling instructions</li>
                            </ul>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Automotive Parts</h4>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
                                <li>Compatibility information must be accurate</li>
                                <li>Safety critical parts require certification</li>
                                <li>OEM or aftermarket status must be clear</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Quality Standards */}
                <section>
                    <h2 className="bd-h2">4. Quality Standards</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)" }}>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                            <li>Products must be in new or clearly labeled used condition</li>
                            <li>Functional items must work as described</li>
                            <li>Packaging should protect items during shipping</li>
                            <li>Expiring items must have at least 6 months shelf life</li>
                            <li>No severely damaged or defective goods</li>
                        </ul>
                    </div>
                </section>

                {/* Creator Listings (Digital & Services) */}
                <section>
                    <h2 className="bd-h2">5. Creator Listings (Digital Products & Services)</h2>

                    <h3 style={{ fontWeight: 900, fontSize: 18, marginTop: 20, marginBottom: 12 }}>5.1 Digital Products</h3>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Must own or have rights to sell the content</li>
                        <li>Clear description of what's included (file formats, usage rights)</li>
                        <li>Delivery method must be specified</li>
                        <li>No pirated software, music, movies, or books</li>
                        <li>Templates/designs must be original or legally licensed</li>
                    </ul>

                    <h3 style={{ fontWeight: 900, fontSize: 18, marginTop: 20, marginBottom: 12 }}>5.2 Local Services</h3>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Service area must be clearly defined (city/state)</li>
                        <li>Qualifications and experience should be stated</li>
                        <li>Estimated completion time required</li>
                        <li>Portfolio or sample work recommended</li>
                        <li>Professional services may require proof of certification</li>
                    </ul>
                </section>

                {/* Intellectual Property */}
                <section>
                    <h2 className="bd-h2">6. Intellectual Property</h2>
                    <p className="bd-p">Respect for intellectual property is mandatory:</p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>No counterfeit or replica branded goods</li>
                        <li>Don't use copyrighted images without permission</li>
                        <li>No trademark infringement in title or description</li>
                        <li>Generic/unbranded products must be clearly labeled</li>
                        <li>Violations may result in listing removal and account suspension</li>
                    </ul>
                </section>

                {/* Compliance & Enforcement */}
                <section>
                    <h2 className="bd-h2">7. Compliance & Enforcement</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)" }}>
                        <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Banadama reserves the right to:</h3>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                            <li>Remove listings that violate this policy</li>
                            <li>Suspend or terminate seller accounts for repeated violations</li>
                            <li>Request additional verification or documentation</li>
                            <li>Modify this policy with notice to sellers</li>
                            <li>Report illegal activities to authorities</li>
                        </ul>

                        <h3 style={{ fontWeight: 900, marginTop: 20, marginBottom: 12 }}>Violation Consequences:</h3>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                            <li><strong>First offense:</strong> Warning + listing removal</li>
                            <li><strong>Second offense:</strong> 14-day account suspension</li>
                            <li><strong>Third offense:</strong> Permanent account termination</li>
                            <li><strong>Severe violations:</strong> Immediate termination + legal action</li>
                        </ul>
                    </div>
                </section>

                {/* Reporting Violations */}
                <section>
                    <h2 className="bd-h2">8. Reporting Policy Violations</h2>
                    <p className="bd-p">
                        If you encounter a listing that violates this policy, please report it:
                    </p>
                    <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", marginTop: 16 }}>
                        <p style={{ margin: 0 }}>Email: compliance@banadama.com</p>
                        <p style={{ margin: "8px 0 0" }}>Report Abuse: <a href="/support/report-abuse" style={{ color: "var(--bd-brand)" }}>/support/report-abuse</a></p>
                    </div>
                </section>

                {/* Getting Help */}
                <section className="bd-card bd-card-pad" style={{ background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.3)" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Need Help with Listing?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 16 }}>
                        Our support team is here to help you create compliant listings:
                    </p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <a href="/help" className="bd-btn bd-btn-primary">Help Center</a>
                        <a href="/sell/seller-central" className="bd-btn">Seller Central</a>
                        <a href="/support/live-chat" className="bd-btn">Live Chat</a>
                    </div>
                </section>

                {/* Footer Links */}
                <div style={{ textAlign: "center", padding: "40px 0 20px", borderTop: "1px solid var(--bd-border)" }}>
                    <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/terms" style={{ color: "var(--bd-brand)" }}>Terms of Service</a>
                        <span style={{ color: "var(--bd-muted)" }}>•</span>
                        <a href="/help" style={{ color: "var(--bd-brand)" }}>Help Center</a>
                        <span style={{ color: "var(--bd-muted)" }}>•</span>
                        <a href="/sell/start" style={{ color: "var(--bd-brand)" }}>Start Selling</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
