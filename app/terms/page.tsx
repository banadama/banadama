import { Icons } from "@/components/icons/icons";

export default function TermsPage() {
    const ShieldIcon = Icons.get("Shield");
    const FileIcon = Icons.get("Document");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <FileIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Terms of Service</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                    Last updated: December 22, 2025
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Introduction */}
                <section>
                    <h2 className="bd-h2">1. Introduction</h2>
                    <p className="bd-p">
                        Welcome to Banadama ("Platform", "Service", "we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of the Banadama platform, including our website, mobile applications, and related services.
                    </p>
                    <p className="bd-p">
                        By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
                    </p>
                </section>

                {/* Account Types */}
                <section>
                    <h2 className="bd-h2">2. Account Types & Responsibilities</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>2.1 Buyers</h3>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                                <li>May purchase products via Buy Now or Request for Quote (RFQ)</li>
                                <li>Responsible for providing accurate delivery information</li>
                                <li>Must confirm receipt of goods to release escrow</li>
                                <li>Should report issues through proper dispute channels</li>
                            </ul>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>2.2 Suppliers (Factories & Wholesalers)</h3>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                                <li>Must provide accurate product descriptions and pricing</li>
                                <li>Responsible for timely fulfillment of orders</li>
                                <li>Must maintain minimum quality standards</li>
                                <li>Subject to verification requirements for certain product categories</li>
                            </ul>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>2.3 Creators</h3>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                                <li>May offer digital products (global) or local services (NG/BD only)</li>
                                <li>Must deliver services as promised in listings</li>
                                <li>Responsible for maintaining professional communication</li>
                                <li>Subject to quality review based on customer feedback</li>
                            </ul>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>2.4 Affiliates</h3>
                            <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                                <li>May promote Banadama and earn commissions on referrals</li>
                                <li>Must comply with our affiliate marketing guidelines</li>
                                <li>Prohibited from misleading or deceptive promotion practices</li>
                                <li>Commission structure detailed in Affiliate Agreement</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Escrow & Payments */}
                <section>
                    <h2 className="bd-h2">3. Escrow & Payment Protection</h2>
                    <p className="bd-p">
                        All transactions on Banadama are protected by our escrow system:
                    </p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Buyer payments are held securely in escrow upon purchase</li>
                        <li>Funds are released to suppliers only after delivery confirmation</li>
                        <li>Our Operations team mediates disputes and ensures fair resolution</li>
                        <li>Standard delivery confirmation period: 7 days for physical goods, 3 days for digital</li>
                        <li>Escrow fees are included in the service fee structure</li>
                    </ul>
                </section>

                {/* Marketplace Rules */}
                <section>
                    <h2 className="bd-h2">4. Marketplace Rules</h2>

                    <h3 style={{ fontWeight: 900, fontSize: 18, marginTop: 20, marginBottom: 12 }}>4.1 Prohibited Items</h3>
                    <p className="bd-p">The following items may not be listed or sold:</p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Illegal or counterfeit goods</li>
                        <li>Weapons, ammunition, or explosives</li>
                        <li>Drugs or controlled substances</li>
                        <li>Stolen goods or items infringing intellectual property</li>
                        <li>Adult content or services</li>
                        <li>Any items prohibited by Nigerian or Bangladeshi law</li>
                    </ul>

                    <h3 style={{ fontWeight: 900, fontSize: 18, marginTop: 20, marginBottom: 12 }}>4.2 Pricing & Fees</h3>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Suppliers must honor listed Buy Now prices</li>
                        <li>RFQ negotiations must be conducted in good faith</li>
                        <li>Service fees apply to all transactions (see Pricing page)</li>
                        <li>No hidden fees - all costs displayed before checkout</li>
                    </ul>

                    <h3 style={{ fontWeight: 900, fontSize: 18, marginTop: 20, marginBottom: 12 }}>4.3 Shipping & Fulfillment</h3>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Suppliers responsible for arranging shipping (Ops-managed)</li>
                        <li>Must provide accurate lead times and shipping estimates</li>
                        <li>Local transactions (NG/BD) have different logistics rules than global</li>
                        <li>Force majeure events may extend delivery timeframes</li>
                    </ul>
                </section>

                {/* User Conduct */}
                <section>
                    <h2 className="bd-h2">5. User Conduct</h2>
                    <p className="bd-p">You agree not to:</p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Violate any laws or regulations</li>
                        <li>Infringe on intellectual property rights</li>
                        <li>Engage in fraudulent or deceptive practices</li>
                        <li>Harass, abuse, or harm other users</li>
                        <li>Attempt to circumvent escrow or payment systems</li>
                        <li>Use the platform for money laundering or illegal activities</li>
                        <li>Create multiple accounts to manipulate reviews or ratings</li>
                        <li>Scrape or data mine platform content without permission</li>
                    </ul>
                </section>

                {/* Intellectual Property */}
                <section>
                    <h2 className="bd-h2">6. Intellectual Property</h2>
                    <p className="bd-p">
                        The Banadama platform, including its original content, features, and functionality, is owned by Banadama and is protected by international copyright, trademark, and other intellectual property laws.
                    </p>
                    <p className="bd-p">
                        User-generated content (product listings, reviews, etc.) remains the property of the user, but you grant Banadama a license to use, modify, and display such content in connection with the Service.
                    </p>
                </section>

                {/* Dispute Resolution */}
                <section>
                    <h2 className="bd-h2">7. Dispute Resolution</h2>
                    <p className="bd-p">
                        Transaction disputes must first be reported through our platform's dispute system. Our Operations team will:
                    </p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Review evidence from both parties</li>
                        <li>Attempt mediation and fair resolution</li>
                        <li>Make final decisions on fund release or refunds</li>
                        <li>Maintain escrow protection until resolution</li>
                    </ul>
                    <p className="bd-p">
                        For disputes not resolvable through our platform, parties agree to arbitration under the laws of Nigeria or Bangladesh (depending on transaction location).
                    </p>
                </section>

                {/* Limitation of Liability */}
                <section>
                    <h2 className="bd-h2">8. Limitation of Liability</h2>
                    <p className="bd-p">
                        Banadama acts as a platform connecting buyers and sellers. We are not responsible for:
                    </p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Quality, safety, or legality of items listed</li>
                        <li>Accuracy of product listings or user communications</li>
                        <li>Ability of sellers to complete transactions</li>
                        <li>Shipping delays or damage beyond our control</li>
                    </ul>
                    <p className="bd-p">
                        Our maximum liability is limited to the transaction value or service fees paid, whichever is lower.
                    </p>
                </section>

                {/* Termination */}
                <section>
                    <h2 className="bd-h2">9. Termination</h2>
                    <p className="bd-p">
                        We reserve the right to suspend or terminate accounts for violations of these Terms, including but not limited to:
                    </p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Fraudulent activity</li>
                        <li>Repeated policy violations</li>
                        <li>Selling prohibited items</li>
                        <li>Abuse of escrow or dispute systems</li>
                        <li>Harassment of other users or staff</li>
                    </ul>
                </section>

                {/* Changes to Terms */}
                <section>
                    <h2 className="bd-h2">10. Changes to Terms</h2>
                    <p className="bd-p">
                        We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service constitutes acceptance of modified Terms.
                    </p>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="bd-h2">11. Contact Us</h2>
                    <p className="bd-p">
                        If you have questions about these Terms, please contact us at:
                    </p>
                    <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", marginTop: 16 }}>
                        <p style={{ margin: 0 }}>Email: legal@banadama.com</p>
                        <p style={{ margin: "8px 0 0" }}>Support: support@banadama.com</p>
                    </div>
                </section>

                {/* Footer Links */}
                <div style={{ textAlign: "center", padding: "40px 0 20px", borderTop: "1px solid var(--bd-border)" }}>
                    <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/help" style={{ color: "var(--bd-brand)" }}>Help Center</a>
                        <span style={{ color: "var(--bd-muted)" }}>•</span>
                        <a href="/privacy" style={{ color: "var(--bd-brand)" }}>Privacy Policy</a>
                        <span style={{ color: "var(--bd-muted)" }}>•</span>
                        <a href="/marketplace" style={{ color: "var(--bd-brand)" }}>Marketplace</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
