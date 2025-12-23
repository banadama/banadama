import { Icons } from "@/components/icons/icons";

export default function SitemapPage() {
    const MapIcon = Icons.get("Grid");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <MapIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Sitemap</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Complete directory of all pages on Banadama
                </p>
            </div>

            <div style={{ maxWidth: 1200, margin: "40px auto", display: "grid", gap: 40 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30 }}>
                    {/* Main Pages */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Main Pages</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/" className="bd-link">Home</a></li>
                            <li><a href="/marketplace" className="bd-link">Marketplace</a></li>
                            <li><a href="/buy-near-me" className="bd-link">Buy Near Me</a></li>
                            <li><a href="/membership" className="bd-link">Membership</a></li>
                            <li><a href="/blog" className="bd-link">Banadama Reads</a></li>
                        </ul>
                    </section>

                    {/* Get Support */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Get Support</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/help" className="bd-link">Help Center</a></li>
                            <li><a href="/support/live-chat" className="bd-link">Live Chat</a></li>
                            <li><a href="/support/track-order" className="bd-link">Track Order</a></li>
                            <li><a href="/support/refunds" className="bd-link">Refunds & Disputes</a></li>
                            <li><a href="/support/report-abuse" className="bd-link">Report Abuse</a></li>
                        </ul>
                    </section>

                    {/* Payments & Protections */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Payments & Protections</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/info/safe-payments" className="bd-link">Safe & Easy Payments</a></li>
                            <li><a href="/info/money-back-policy" className="bd-link">Money-Back Policy</a></li>
                            <li><a href="/info/on-time-shipping" className="bd-link">On-Time Shipping</a></li>
                            <li><a href="/info/after-sales-protections" className="bd-link">After-Sales Protections</a></li>
                            <li><a href="/info/product-monitoring" className="bd-link">Product Monitoring</a></li>
                            <li><a href="/info/sales-tax-vat" className="bd-link">Sales Tax & VAT</a></li>
                        </ul>
                    </section>

                    {/* Source on Banadama */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Source on Banadama</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/rfq" className="bd-link">Request for Quotation (RFQ)</a></li>
                            <li><a href="/rfq/guide" className="bd-link">RFQ Guide</a></li>
                            <li><a href="/info/product-listing-policy" className="bd-link">Product Listing Policy</a></li>
                        </ul>
                    </section>

                    {/* Sell on Banadama */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Sell on Banadama</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/sell/start" className="bd-link">Start Selling</a></li>
                            <li><a href="/sell/seller-central" className="bd-link">Seller Central</a></li>
                            <li><a href="/sell/verified-supplier" className="bd-link">Become a Verified Supplier</a></li>
                            <li><a href="/sell/partnerships" className="bd-link">Partnerships</a></li>
                            <li><a href="/sell/supplier-app" className="bd-link">Download Supplier App</a></li>
                        </ul>
                    </section>

                    {/* Get to Know Us */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Get to Know Us</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/about" className="bd-link">About Banadama</a></li>
                            <li><a href="/about/responsibility" className="bd-link">Corporate Responsibility</a></li>
                            <li><a href="/news" className="bd-link">News Center</a></li>
                            <li><a href="/careers" className="bd-link">Careers</a></li>
                        </ul>
                    </section>

                    {/* Account & Authentication */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Account</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/splash" className="bd-link">Get Started</a></li>
                            <li><a href="/languages" className="bd-link">Select Language</a></li>
                            <li><a href="/account-type" className="bd-link">Choose Account Type</a></li>
                            <li><a href="/register" className="bd-link">Register</a></li>
                            <li><a href="/login" className="bd-link">Login</a></li>
                        </ul>
                    </section>

                    {/* Buyer Dashboard */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Buyer Dashboard</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/buyer/dashboard" className="bd-link">Dashboard</a></li>
                            <li><a href="/buyer/orders" className="bd-link">My Orders</a></li>
                            <li><a href="/buyer/rfqs" className="bd-link">My RFQs</a></li>
                            <li><a href="/buyer/favorites" className="bd-link">Favorites</a></li>
                            <li><a href="/buyer/messages" className="bd-link">Messages</a></li>
                            <li><a href="/account/settings" className="bd-link">Account Settings</a></li>
                        </ul>
                    </section>

                    {/* Supplier Dashboard */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Supplier Dashboard</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/supplier/dashboard" className="bd-link">Dashboard</a></li>
                            <li><a href="/supplier/products" className="bd-link">Products</a></li>
                            <li><a href="/supplier/orders" className="bd-link">Orders</a></li>
                            <li><a href="/supplier/rfqs" className="bd-link">RFQs</a></li>
                            <li><a href="/supplier/analytics" className="bd-link">Analytics</a></li>
                            <li><a href="/supplier/verification/apply" className="bd-link">Apply for Verification</a></li>
                        </ul>
                    </section>

                    {/* Creator Dashboard */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Creator Dashboard</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/creator/dashboard" className="bd-link">Dashboard</a></li>
                            <li><a href="/creator/products" className="bd-link">My Products</a></li>
                            <li><a href="/creator/sales" className="bd-link">Sales</a></li>
                            <li><a href="/creator/analytics" className="bd-link">Analytics</a></li>
                        </ul>
                    </section>

                    {/* Affiliate Dashboard */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Affiliate Dashboard</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/affiliate/dashboard" className="bd-link">Dashboard</a></li>
                            <li><a href="/affiliate/links" className="bd-link">My Links</a></li>
                            <li><a href="/affiliate/earnings" className="bd-link">Earnings</a></li>
                            <li><a href="/affiliate/payouts" className="bd-link">Payouts</a></li>
                        </ul>
                    </section>

                    {/* Ops Dashboard */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Ops Dashboard</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/ops/dashboard" className="bd-link">Dashboard</a></li>
                            <li><a href="/ops/verification" className="bd-link">Verification Requests</a></li>
                            <li><a href="/ops/orders" className="bd-link">All Orders</a></li>
                            <li><a href="/ops/disputes" className="bd-link">Disputes</a></li>
                        </ul>
                    </section>

                    {/* Legal & Policies */}
                    <section className="bd-card bd-card-pad">
                        <h2 className="bd-h2" style={{ fontSize: 20, marginBottom: 16 }}>Legal & Policies</h2>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                            <li><a href="/terms" className="bd-link">Terms of Service</a></li>
                            <li><a href="/privacy" className="bd-link">Privacy Policy</a></li>
                            <li><a href="/info/product-listing-policy" className="bd-link">Product Listing Policy</a></li>
                        </ul>
                    </section>
                </div>

                {/* Footer Note */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                        Last updated: December 2025 • For assistance, visit our <a href="/help" className="bd-link">Help Center</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
