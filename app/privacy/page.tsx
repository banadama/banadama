import { Icons } from "@/components/icons/icons";

export default function PrivacyPage() {
    const ShieldCheckIcon = Icons.get("ShieldCheck");
    const LockIcon = Icons.get("Lock");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <ShieldCheckIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Privacy Policy</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                    Last updated: December 22, 2025
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Introduction */}
                <section>
                    <h2 className="bd-h2">1. Introduction</h2>
                    <p className="bd-p">
                        At Banadama ("we", "us", or "our"), we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                    </p>
                    <p className="bd-p">
                        By using Banadama, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our services.
                    </p>
                </section>

                {/* Information We Collect */}
                <section>
                    <h2 className="bd-h2">2. Information We Collect</h2>

                    <h3 style={{ fontWeight: 900, fontSize: 18, marginTop: 20, marginBottom: 12 }}>2.1 Information You Provide</h3>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
                        <li><strong>Profile Information:</strong> Display name, bio, business details, verification documents</li>
                        <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely by our payment providers)</li>
                        <li><strong>Transaction Details:</strong> Purchase history, RFQ requests, order communications</li>
                        <li><strong>Content:</strong> Product listings, reviews, messages, dispute submissions</li>
                    </ul>

                    <h3 style={{ fontWeight: 900, fontSize: 18, marginTop: 20, marginBottom: 12 }}>2.2 Information Collected Automatically</h3>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                        <li><strong>Usage Data:</strong> Pages viewed, features used, search queries, click patterns</li>
                        <li><strong>Location Data:</strong> General location based on IP address (with your permission)</li>
                        <li><strong>Cookies & Tracking:</strong> Session cookies, analytics cookies, preference cookies</li>
                    </ul>

                    <h3 style={{ fontWeight: 900, fontSize: 18, marginTop: 20, marginBottom: 12 }}>2.3 Information from Third Parties</h3>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Payment processors (transaction verification)</li>
                        <li>Shipping partners (delivery tracking)</li>
                        <li>Social media platforms (if you link accounts)</li>
                        <li>Verification services (identity and business verification)</li>
                    </ul>
                </section>

                {/* How We Use Information */}
                <section>
                    <h2 className="bd-h2">3. How We Use Your Information</h2>
                    <p className="bd-p">We use the collected information for:</p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li><strong>Service Delivery:</strong> Process transactions, manage escrow, facilitate communications</li>
                        <li><strong>Security:</strong> Prevent fraud, detect abuse, verify user identity</li>
                        <li><strong>Improvements:</strong> Analyze usage patterns, enhance features, personalize experience</li>
                        <li><strong>Communications:</strong> Send order updates, notifications, promotional offers (opt-out available)</li>
                        <li><strong>Compliance:</strong> Meet legal obligations, enforce our Terms of Service</li>
                        <li><strong>Dispute Resolution:</strong> Resolve conflicts between buyers and sellers</li>
                        <li><strong>Analytics:</strong> Understand market trends, improve platform performance</li>
                    </ul>
                </section>

                {/* Information Sharing */}
                <section>
                    <h2 className="bd-h2">4. How We Share Your Information</h2>
                    <p className="bd-p">We share your information only in these circumstances:</p>

                    <div className="bd-card bd-card-pad" style={{ marginTop: 16, boxShadow: "none" }}>
                        <h3 style={{ fontWeight: 900, marginBottom: 8 }}>4.1 With Other Users</h3>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                            <li>Buyers see supplier names and basic business info</li>
                            <li>Suppliers see buyer delivery addresses (for order fulfillment only)</li>
                            <li>Public profiles display information you choose to share</li>
                        </ul>
                    </div>

                    <div className="bd-card bd-card-pad" style={{ marginTop: 16, boxShadow: "none" }}>
                        <h3 style={{ fontWeight: 900, marginBottom: 8 }}>4.2 With Service Providers</h3>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                            <li>Payment processors (for transaction handling)</li>
                            <li>Shipping companies (for logistics)</li>
                            <li>Cloud hosting providers (for data storage)</li>
                            <li>Analytics services (for platform improvement)</li>
                            <li>All providers are bound by confidentiality agreements</li>
                        </ul>
                    </div>

                    <div className="bd-card bd-card-pad" style={{ marginTop: 16, boxShadow: "none" }}>
                        <h3 style={{ fontWeight: 900, marginBottom: 8 }}>4.3 For Legal Reasons</h3>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                            <li>To comply with legal obligations or court orders</li>
                            <li>To protect our rights, property, and safety</li>
                            <li>To prevent fraud or illegal activities</li>
                            <li>In connection with business transfers or acquisitions</li>
                        </ul>
                    </div>

                    <p className="bd-p" style={{ marginTop: 16 }}>
                        <strong>We never sell your personal information to third parties.</strong>
                    </p>
                </section>

                {/* Data Security */}
                <section>
                    <h2 className="bd-h2">5. Data Security</h2>
                    <p className="bd-p">We implement industry-standard security measures:</p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li><strong>Encryption:</strong> SSL/TLS encryption for data in transit</li>
                        <li><strong>Secure Storage:</strong> Encrypted databases with access controls</li>
                        <li><strong>Payment Security:</strong> PCI DSS compliant payment processing</li>
                        <li><strong>Access Controls:</strong> Limited employee access to personal data</li>
                        <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                        <li><strong>Escrow Protection:</strong> Secure fund holding until delivery confirmation</li>
                    </ul>
                    <p className="bd-p">
                        However, no internet transmission is 100% secure. We cannot guarantee absolute security but maintain reasonable safeguards.
                    </p>
                </section>

                {/* Your Rights */}
                <section>
                    <h2 className="bd-h2">6. Your Privacy Rights</h2>
                    <p className="bd-p">Depending on your location, you may have the following rights:</p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li><strong>Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
                        <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                        <li><strong>Portability:</strong> Receive your data in a portable format</li>
                        <li><strong>Objection:</strong> Object to certain processing activities</li>
                        <li><strong>Withdraw Consent:</strong> Opt-out of marketing communications</li>
                        <li><strong>Restrict Processing:</strong> Limit how we use your data</li>
                    </ul>
                    <p className="bd-p">
                        To exercise these rights, contact us at privacy@banadama.com
                    </p>
                </section>

                {/* Data Retention */}
                <section>
                    <h2 className="bd-h2">7. Data Retention</h2>
                    <p className="bd-p">
                        We retain your information for as long as necessary to provide services and comply with legal obligations:
                    </p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li>Active account data: Duration of account + 90 days after closure</li>
                        <li>Transaction records: 7 years (for tax and compliance purposes)</li>
                        <li>Dispute records: 3 years after resolution</li>
                        <li>Marketing data: Until you opt-out or request deletion</li>
                    </ul>
                </section>

                {/* Cookies */}
                <section>
                    <h2 className="bd-h2">8. Cookies & Tracking Technologies</h2>
                    <p className="bd-p">We use cookies and similar technologies to:</p>
                    <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20 }}>
                        <li><strong>Essential Cookies:</strong> Enable core functionality (authentication, shopping cart)</li>
                        <li><strong>Analytics Cookies:</strong> Understand how you use our platform</li>
                        <li><strong>Preference Cookies:</strong> Remember your settings and language</li>
                        <li><strong>Marketing Cookies:</strong> Show relevant advertisements (with your consent)</li>
                    </ul>
                    <p className="bd-p">
                        You can control cookie preferences through your browser settings. Note that disabling certain cookies may limit platform functionality.
                    </p>
                </section>

                {/* Children's Privacy */}
                <section>
                    <h2 className="bd-h2">9. Children's Privacy</h2>
                    <p className="bd-p">
                        Banadama is not intended for users under 18 years of age. We do not knowingly collect information from children. If you believe we have collected information from a child, please contact us immediately.
                    </p>
                </section>

                {/* International Transfers */}
                <section>
                    <h2 className="bd-h2">10. International Data Transfers</h2>
                    <p className="bd-p">
                        Our servers are located in [jurisdiction]. If you access Banadama from outside this region, your information may be transferred internationally. We ensure appropriate safeguards are in place for such transfers.
                    </p>
                </section>

                {/* Changes to Policy */}
                <section>
                    <h2 className="bd-h2">11. Changes to This Policy</h2>
                    <p className="bd-p">
                        We may update this Privacy Policy periodically. We will notify you of material changes via email or platform notification. The "Last Updated" date at the top reflects the most recent revision.
                    </p>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="bd-h2">12. Contact Us</h2>
                    <p className="bd-p">
                        For privacy-related questions or to exercise your rights, contact us at:
                    </p>
                    <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", marginTop: 16 }}>
                        <p style={{ margin: 0 }}>Email: privacy@banadama.com</p>
                        <p style={{ margin: "8px 0 0" }}>Support: support@banadama.com</p>
                        <p style={{ margin: "8px 0 0" }}>Help Center: <a href="/help" style={{ color: "var(--bd-brand)" }}>/help</a></p>
                    </div>
                </section>

                {/* Footer Links */}
                <div style={{ textAlign: "center", padding: "40px 0 20px", borderTop: "1px solid var(--bd-border)" }}>
                    <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/help" style={{ color: "var(--bd-brand)" }}>Help Center</a>
                        <span style={{ color: "var(--bd-muted)" }}>•</span>
                        <a href="/terms" style={{ color: "var(--bd-brand)" }}>Terms of Service</a>
                        <span style={{ color: "var(--bd-muted)" }}>•</span>
                        <a href="/marketplace" style={{ color: "var(--bd-brand)" }}>Marketplace</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
