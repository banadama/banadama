import { Icons } from "@/components/icons/icons";

export default function SalesTaxVATPage() {
    const CalculatorIcon = Icons.get("Calculator");
    const FileTextIcon = Icons.get("Document");
    const CheckCircleIcon = Icons.get("Check");
    const AlertTriangleIcon = Icons.get("Warning");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <CalculatorIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Sales Tax and VAT</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Understanding taxes on your Banadama transactions
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Introduction */}
                <section>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.3)" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                            <FileTextIcon size={32} style={{ color: "#f97316", flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Tax Compliance Made Simple</h3>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    Banadama helps you comply with local tax regulations in Nigeria, Bangladesh, and internationally. We automatically calculate and apply applicable taxes based on your location and transaction type.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tax by Country */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Tax Rates by Country</h2>

                    <div style={{ display: "grid", gap: 16 }}>
                        {/* Nigeria */}
                        <div className="bd-card bd-card-pad">
                            <h3 style={{ fontWeight: 900, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                                <span>🇳🇬</span> Nigeria (VAT)
                            </h3>
                            <div style={{ color: "var(--bd-muted)", lineHeight: 1.8 }}>
                                <div style={{ marginBottom: 8 }}>
                                    <strong>Standard VAT Rate:</strong> 7.5%
                                </div>
                                <div style={{ marginBottom: 8 }}>
                                    <strong>Applies to:</strong> Most goods and services sold within Nigeria
                                </div>
                                <div>
                                    <strong>Exempt items:</strong> Basic food items, medical supplies, educational materials, exports
                                </div>
                            </div>
                        </div>

                        {/* Bangladesh */}
                        <div className="bd-card bd-card-pad">
                            <h3 style={{ fontWeight: 900, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                                <span>🇧🇩</span> Bangladesh (VAT)
                            </h3>
                            <div style={{ color: "var(--bd-muted)", lineHeight: 1.8 }}>
                                <div style={{ marginBottom: 8 }}>
                                    <strong>Standard VAT Rate:</strong> 15%
                                </div>
                                <div style={{ marginBottom: 8 }}>
                                    <strong>Applies to:</strong> Most goods and services sold within Bangladesh
                                </div>
                                <div>
                                    <strong>Exempt items:</strong> Essential commodities, agricultural products, exports
                                </div>
                            </div>
                        </div>

                        {/* International */}
                        <div className="bd-card bd-card-pad">
                            <h3 style={{ fontWeight: 900, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                                <span>🌍</span> International Transactions
                            </h3>
                            <div style={{ color: "var(--bd-muted)", lineHeight: 1.8 }}>
                                <div style={{ marginBottom: 8 }}>
                                    <strong>Cross-border sales:</strong> May be subject to import duties and customs fees in the destination country
                                </div>
                                <div>
                                    <strong>Your responsibility:</strong> Check local import regulations for your country
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How Taxes are Applied */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>How Taxes are Applied</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Automatic Calculation:</strong> VAT/sales tax is calculated automatically at checkout based on your shipping address
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Transparent Pricing:</strong> Total price including taxes is shown before you complete payment
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Tax Invoices:</strong> All orders include detailed tax invoices for your records
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                            <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <strong>Supplier Remittance:</strong> We collect and remit taxes to the appropriate authorities on behalf of suppliers
                            </div>
                        </div>
                    </div>
                </section>

                {/* Business Buyers */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>For Business Buyers</h2>
                    <div className="bd-card bd-card-pad">
                        <h4 style={{ fontWeight: 900, marginBottom: 12 }}>Tax-Exempt Purchases</h4>
                        <p style={{ color: "var(--bd-muted)", marginBottom: 16, lineHeight: 1.6 }}>
                            If your business is registered for VAT and eligible for tax exemptions on B2B purchases, you can apply for tax-exempt status on Banadama.
                        </p>

                        <h5 style={{ fontWeight: 900, marginBottom: 8 }}>Requirements:</h5>
                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, marginBottom: 16 }}>
                            <li>Valid business registration</li>
                            <li>Tax Identification Number (TIN) or VAT registration number</li>
                            <li>Certificate of VAT registration (where applicable)</li>
                        </ul>

                        <a href="/account/tax-settings" className="bd-btn bd-btn-primary">
                            Apply for Tax-Exempt Status
                        </a>
                    </div>
                </section>

                {/* Suppliers */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>For Suppliers</h2>
                    <div className="bd-card bd-card-pad">
                        <h4 style={{ fontWeight: 900, marginBottom: 12 }}>Tax Collection & Reporting</h4>
                        <p style={{ color: "var(--bd-muted)", marginBottom: 16, lineHeight: 1.6 }}>
                            As a supplier on Banadama, we handle tax collection and reporting to simplify your compliance.
                        </p>

                        <div style={{ display: "grid", gap: 12 }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>We collect VAT:</strong> VAT is added to your product price at checkout
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>We remit to authorities:</strong> Banadama files and pays VAT on your behalf to tax authorities
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>Monthly reports:</strong> Detailed tax reports available in your supplier dashboard
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                                <CheckCircleIcon size={20} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong>You receive net amount:</strong> Payments to you are net of collected VAT
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Import Duties */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Import Duties & Customs</h2>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "start", marginBottom: 16 }}>
                            <AlertTriangleIcon size={24} style={{ color: "#ef4444", flexShrink: 0 }} />
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8, color: "#ef4444" }}>Buyer Responsibility</h4>
                                <p style={{ color: "var(--bd-muted)", margin: 0 }}>
                                    For international orders, buyers are responsible for any import duties, customs fees, or taxes imposed by their country.
                                </p>
                            </div>
                        </div>

                        <ul style={{ color: "var(--bd-muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                            <li>Import duties vary by country and product category</li>
                            <li>Customs may contact you for payment before releasing goods</li>
                            <li>Check your country's customs website for estimated duties</li>
                            <li>Some products may be restricted or prohibited in your country</li>
                        </ul>
                    </div>
                </section>

                {/* FAQs */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Tax FAQs</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Why am I being charged VAT?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                VAT (Value Added Tax) is a legal requirement in Nigeria and Bangladesh for most goods and services. We collect it on behalf of tax authorities.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Can I get a tax invoice?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                Yes! Every order includes a detailed tax invoice available for download in your order history.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Are digital products taxed?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                Yes, digital products and services are subject to VAT in both Nigeria and Bangladesh.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>What if I'm charged incorrect tax?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                Contact our support team with your order details. We'll review and correct any tax calculation errors.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Questions About Taxes?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                        Our support team can help with tax-related questions
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/support/live-chat" className="bd-btn bd-btn-primary">Contact Support</a>
                        <a href="/help" className="bd-btn">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
