import { Icons } from "../icons/icons";

export function Footer() {
    const FacebookIcon = Icons.get("Facebook");
    const LinkedInIcon = Icons.get("Linkedin");
    const TwitterIcon = Icons.get("Twitter");
    const InstagramIcon = Icons.get("Instagram");
    const YoutubeIcon = Icons.get("Youtube");
    const TiktokIcon = Icons.get("Tiktok");

    return (
        <footer style={{ background: "var(--bd-surface)", borderTop: "1px solid var(--bd-border)", padding: "60px 0 20px" }}>
            <div className="bd-container">
                {/* Main Footer Content */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>
                    {/* Get Support */}
                    <div>
                        <h4 style={{ fontWeight: 900, marginBottom: 16 }}>Get Support</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                            <li><a href="/help" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Help Center</a></li>
                            <li><a href="/support/live-chat" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Live Chat</a></li>
                            <li><a href="/support/order-status" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Check Order Status</a></li>
                            <li><a href="/support/refunds" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Refunds</a></li>
                            <li><a href="/support/report-abuse" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Report Abuse</a></li>
                        </ul>
                    </div>

                    {/* Payments and Protections */}
                    <div>
                        <h4 style={{ fontWeight: 900, marginBottom: 16 }}>Payments & Protections</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                            <li><a href="/info/safe-payments" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Safe and Easy Payments</a></li>
                            <li><a href="/info/money-back-policy" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Money-Back Policy</a></li>
                            <li><a href="/info/on-time-shipping" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>On-Time Shipping</a></li>
                            <li><a href="/info/after-sales-protections" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>After-Sales Protections</a></li>
                            <li><a href="/info/product-monitoring" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Product Monitoring</a></li>
                        </ul>
                    </div>

                    {/* Source on Banadama */}
                    <div>
                        <h4 style={{ fontWeight: 900, marginBottom: 16 }}>Source on Banadama</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                            <li><a href="/info/product-listing-policy" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Product Listing Policy</a></li>
                            <li><a href="/rfq/guide" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Request for Quotation</a></li>
                            <li><a href="/membership" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Membership Program</a></li>
                            <li><a href="/info/sales-tax-vat" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Sales Tax and VAT</a></li>
                            <li><a href="/blog" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Banadama Reads</a></li>
                        </ul>
                    </div>

                    {/* Sell on Banadama */}
                    <div>
                        <h4 style={{ fontWeight: 900, marginBottom: 16 }}>Sell on Banadama</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                            <li><a href="/sell/start" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Start Selling</a></li>
                            <li><a href="/sell/seller-central" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Seller Central</a></li>
                            <li><a href="/sell/verified-supplier" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Become a Verified Supplier</a></li>
                            <li><a href="/sell/partnerships" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Partnerships</a></li>
                            <li><a href="/sell/supplier-app" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Download Supplier App</a></li>
                        </ul>
                    </div>

                    {/* Get to Know Us */}
                    <div>
                        <h4 style={{ fontWeight: 900, marginBottom: 16 }}>Get to Know Us</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                            <li><a href="/about" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>About Banadama</a></li>
                            <li><a href="/about/responsibility" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Corporate Responsibility</a></li>
                            <li><a href="/news" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>News Center</a></li>
                            <li><a href="/careers" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Careers</a></li>
                        </ul>
                    </div>
                </div>

                {/* Social Media & Newsletter */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", marginBottom: 40 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
                        <div>
                            <h4 style={{ fontWeight: 900, marginBottom: 12 }}>Stay Connected</h4>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <a href="https://facebook.com/banadama" target="_blank" rel="noopener noreferrer" className="bd-btn bd-btn-sm" style={{ padding: "8px 12px" }}>
                                    <FacebookIcon size={18} /> Facebook
                                </a>
                                <a href="https://linkedin.com/company/banadama" target="_blank" rel="noopener noreferrer" className="bd-btn bd-btn-sm" style={{ padding: "8px 12px" }}>
                                    <LinkedInIcon size={18} /> LinkedIn
                                </a>
                                <a href="https://twitter.com/banadama" target="_blank" rel="noopener noreferrer" className="bd-btn bd-btn-sm" style={{ padding: "8px 12px" }}>
                                    <TwitterIcon size={18} /> Twitter
                                </a>
                                <a href="https://instagram.com/banadama" target="_blank" rel="noopener noreferrer" className="bd-btn bd-btn-sm" style={{ padding: "8px 12px" }}>
                                    <InstagramIcon size={18} /> Instagram
                                </a>
                                <a href="https://youtube.com/banadama" target="_blank" rel="noopener noreferrer" className="bd-btn bd-btn-sm" style={{ padding: "8px 12px" }}>
                                    <YoutubeIcon size={18} /> YouTube
                                </a>
                                <a href="https://tiktok.com/@banadama" target="_blank" rel="noopener noreferrer" className="bd-btn bd-btn-sm" style={{ padding: "8px 12px" }}>
                                    <TiktokIcon size={18} /> TikTok
                                </a>
                            </div>
                        </div>

                        <div style={{ flex: "0 1 400px" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 12 }}>Subscribe to Our Newsletter</h4>
                            <form style={{ display: "flex", gap: 8 }}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bd-input"
                                    style={{ flex: 1 }}
                                    required
                                />
                                <button type="submit" className="bd-btn bd-btn-primary">Subscribe</button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div style={{ borderTop: "1px solid var(--bd-border)", paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
                    <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                        © 2025 Banadama. All rights reserved.
                    </div>
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 14 }}>
                        <a href="/terms" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Terms of Service</a>
                        <a href="/privacy" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Privacy Policy</a>
                        <a href="/help" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Help Center</a>
                        <a href="/sitemap" style={{ color: "var(--bd-muted)", textDecoration: "none" }}>Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
