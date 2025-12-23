import { Icons } from "@/components/icons/icons";

export default function SupplierAppPage() {
    const SmartphoneIcon = Icons.get("Phone");
    const CheckCircleIcon = Icons.get("Check");
    const DownloadIcon = Icons.get("Download");
    const BellIcon = Icons.get("Bell");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", textAlign: "center", padding: "80px 20px" }}>
                <SmartphoneIcon size={64} style={{ margin: "0 auto 20px", color: "white" }} />
                <h1 className="bd-h1" style={{ fontSize: 42, marginBottom: 12, color: "white" }}>Banadama Supplier App</h1>
                <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 20, maxWidth: 700, margin: "0 auto" }}>
                    Manage your business on the go. Available for iOS and Android.
                </p>
            </div>

            <div style={{ maxWidth: 900, margin: "60px auto", display: "grid", gap: 60 }}>
                {/* App Features */}
                <section>
                    <h2 className="bd-h2" style={{ textAlign: "center", marginBottom: 40 }}>Everything You Need in One App</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <CheckCircleIcon size={32} style={{ color: "#8b5cf6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Manage Orders Anywhere</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        View new orders, update shipping status, and communicate with buyers from anywhere in real-time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <CheckCircleIcon size={32} style={{ color: "#8b5cf6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Real-Time Notifications</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Get instant push notifications for new orders, messages, RFQs, and important updates.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <CheckCircleIcon size={32} style={{ color: "#8b5cf6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Quick Product Updates</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Update product prices, inventory, and descriptions on the fly. Take photos and upload directly from your phone.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <CheckCircleIcon size={32} style={{ color: "#8b5cf6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Respond to RFQs Instantly</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Don't miss opportunities. Receive RFQ notifications and submit competitive quotes before your competitors.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <CheckCircleIcon size={32} style={{ color: "#8b5cf6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Live Chat with Buyers</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Answer buyer questions in real-time, build relationships, and close more sales.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <CheckCircleIcon size={32} style={{ color: "#8b5cf6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Sales Analytics Dashboard</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Track your sales, revenue, and performance metrics with beautiful charts and insights.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                                <CheckCircleIcon size={32} style={{ color: "#8b5cf6", flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Barcode Scanner</h4>
                                    <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                        Quickly add products by scanning barcodes. Perfect for inventory management.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Download Section */}
                <section>
                    <h2 className="bd-h2" style={{ textAlign: "center", marginBottom: 30 }}>Download Now</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                        <p style={{ color: "var(--bd-muted)", marginBottom: 30, fontSize: 16 }}>
                            The Banadama Supplier App is free for all suppliers
                        </p>
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
                            <a
                                href="https://apps.apple.com/app/banadama-supplier"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bd-btn bd-btn-lg"
                                style={{
                                    background: "black",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "12px 24px"
                                }}
                            >
                                <DownloadIcon size={24} />
                                <div style={{ textAlign: "left" }}>
                                    <div style={{ fontSize: 10 }}>Download on the</div>
                                    <div style={{ fontSize: 18, fontWeight: 900 }}>App Store</div>
                                </div>
                            </a>

                            <a
                                href="https://play.google.com/store/apps/details?id=com.banadama.supplier"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bd-btn bd-btn-lg"
                                style={{
                                    background: "black",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "12px 24px"
                                }}
                            >
                                <DownloadIcon size={24} />
                                <div style={{ textAlign: "left" }}>
                                    <div style={{ fontSize: 10 }}>GET IT ON</div>
                                    <div style={{ fontSize: 18, fontWeight: 900 }}>Google Play</div>
                                </div>
                            </a>
                        </div>
                        <p style={{ color: "var(--bd-muted)", fontSize: 13, margin: 0 }}>
                            Requires iOS 13.0+ or Android 8.0+
                        </p>
                    </div>
                </section>

                {/* Requirements */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Requirements</h2>
                    <div className="bd-card bd-card-pad">
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                            <li>Active Banadama supplier account</li>
                            <li>iOS 13.0 or later / Android 8.0 or later</li>
                            <li>Internet connection (3G, 4G, or Wi-Fi)</li>
                            <li>Camera access (for product photos and barcode scanning)</li>
                            <li>Push notification permissions (for order alerts)</li>
                        </ul>
                    </div>
                </section>

                {/* Screenshots Placeholder */}
                <section>
                    <h2 className="bd-h2" style={{ textAlign: "center", marginBottom: 30 }}>App Preview</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                        <div className="bd-card" style={{ aspectRatio: "9/16", background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, padding: 20, textAlign: "center" }}>
                            Dashboard Screen
                        </div>
                        <div className="bd-card" style={{ aspectRatio: "9/16", background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, padding: 20, textAlign: "center" }}>
                            Order Management
                        </div>
                        <div className="bd-card" style={{ aspectRatio: "9/16", background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, padding: 20, textAlign: "center" }}>
                            Product Listing
                        </div>
                        <div className="bd-card" style={{ aspectRatio: "9/16", background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, padding: 20, textAlign: "center" }}>
                            Chat Interface
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", textAlign: "center", padding: "60px 20px" }}>
                    <BellIcon size={48} style={{ margin: "0 auto 20px", color: "white" }} />
                    <h3 style={{ fontWeight: 900, fontSize: 32, marginBottom: 16, color: "white" }}>Never Miss an Order Again</h3>
                    <p style={{ color: "rgba(255, 255, 255, 0.9)", marginBottom: 30, fontSize: 18 }}>
                        Download the app and start managing your business from anywhere
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="#download" className="bd-btn bd-btn-lg" style={{ background: "white", color: "#8b5cf6", fontWeight: 900 }}>
                            Download App
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
