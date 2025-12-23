import { Icons } from "@/components/icons/icons";

export default function MembershipPage() {
    const CrownIcon = Icons.get("Star");
    const CheckCircleIcon = Icons.get("Check");
    const TrendingUpIcon = Icons.get("TrendingUp");
    const ShieldIcon = Icons.get("Shield");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <CrownIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Membership Program</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Unlock exclusive benefits and grow your business faster
                </p>
            </div>

            <div style={{ maxWidth: 1000, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Introduction */}
                <section>
                    <div className="bd-card bd-card-pad" style={{ background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.3)" }}>
                        <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Premium Benefits for Serious Businesses</h3>
                        <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                            Banadama Membership gives active buyers and suppliers access to premium features, better pricing, priority support, and exclusive perks designed to help you grow.
                        </p>
                    </div>
                </section>

                {/* Membership Tiers */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 30, textAlign: "center" }}>Membership Tiers</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                        {/* Free */}
                        <div className="bd-card bd-card-pad" style={{ border: "2px solid var(--bd-border)" }}>
                            <div style={{ textAlign: "center", marginBottom: 20 }}>
                                <h3 style={{ fontWeight: 900, fontSize: 24, marginBottom: 8 }}>Free</h3>
                                <div style={{ fontSize: 36, fontWeight: 900, color: "var(--bd-muted)" }}>$0</div>
                                <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Forever</div>
                            </div>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>Basic marketplace access</span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>Escrow protection</span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>Standard support</span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>5 RFQs per month</span>
                                </li>
                            </ul>
                            <button className="bd-btn" style={{ width: "100%", marginTop: 20 }}>Current Plan</button>
                        </div>

                        {/* Silver */}
                        <div className="bd-card bd-card-pad" style={{ border: "2px solid #94a3b8" }}>
                            <div style={{ textAlign: "center", marginBottom: 20 }}>
                                <h3 style={{ fontWeight: 900, fontSize: 24, marginBottom: 8 }}>Silver</h3>
                                <div style={{ fontSize: 36, fontWeight: 900, color: "#94a3b8" }}>$9</div>
                                <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>per month</div>
                            </div>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}><strong>Everything in Free, plus:</strong></span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>20 RFQs per month</span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>Priority support (24-hour response)</span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>2% discount on all orders</span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>Advanced analytics</span>
                                </li>
                            </ul>
                            <button className="bd-btn bd-btn-primary" style={{ width: "100%", marginTop: 20 }}>Upgrade to Silver</button>
                        </div>

                        {/* Gold */}
                        <div className="bd-card bd-card-pad" style={{ border: "2px solid #f59e0b", position: "relative" }}>
                            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "white", padding: "4px 16px", borderRadius: 999, fontSize: 12, fontWeight: 900 }}>
                                POPULAR
                            </div>
                            <div style={{ textAlign: "center", marginBottom: 20 }}>
                                <h3 style={{ fontWeight: 900, fontSize: 24, marginBottom: 8 }}>Gold</h3>
                                <div style={{ fontSize: 36, fontWeight: 900, color: "#f59e0b" }}>$19</div>
                                <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>per month</div>
                            </div>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}><strong>Everything in Silver, plus:</strong></span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>Unlimited RFQs</span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>Premium support (4-hour response)</span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>5% discount on all orders</span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>Dedicated account manager</span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>Gold verification badge</span>
                                </li>
                                <li style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                    <CheckCircleIcon size={18} style={{ color: "var(--bd-success)", flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 14 }}>Early access to new features</span>
                                </li>
                            </ul>
                            <button className="bd-btn bd-btn-primary" style={{ width: "100%", marginTop: 20, background: "#f59e0b" }}>Upgrade to Gold</button>
                        </div>
                    </div>
                </section>

                {/* Benefits Comparison */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Full Benefits Comparison</h2>
                    <div className="bd-card bd-card-pad" style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid var(--bd-border)" }}>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 900 }}>Feature</th>
                                    <th style={{ padding: "12px", textAlign: "center", fontWeight: 900 }}>Free</th>
                                    <th style={{ padding: "12px", textAlign: "center", fontWeight: 900 }}>Silver</th>
                                    <th style={{ padding: "12px", textAlign: "center", fontWeight: 900 }}>Gold</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: "1px solid var(--bd-border)" }}>
                                    <td style={{ padding: "12px" }}>RFQs per month</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>5</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>20</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>Unlimited</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid var(--bd-border)" }}>
                                    <td style={{ padding: "12px" }}>Order discount</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>-</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>2%</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>5%</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid var(--bd-border)" }}>
                                    <td style={{ padding: "12px" }}>Support response time</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>48hrs</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>24hrs</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>4hrs</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid var(--bd-border)" }}>
                                    <td style={{ padding: "12px" }}>Account manager</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>-</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>-</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>✓</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid var(--bd-border)" }}>
                                    <td style={{ padding: "12px" }}>Verification badge</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>-</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>-</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>✓</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "12px" }}>Early feature access</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>-</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>-</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>✓</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Why Upgrade */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Why Upgrade?</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                        <div className="bd-card bd-card-pad">
                            <TrendingUpIcon size={32} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Save Money</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Member discounts quickly pay for themselves on larger orders
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <ShieldIcon size={32} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Build Trust</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Verification badges boost credibility with suppliers and buyers
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad">
                            <CheckCircleIcon size={32} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Scale Faster</h4>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                Unlimited RFQs and priority support help you grow without limits
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQs */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Membership FAQs</h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Can I cancel anytime?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                Yes! You can cancel your membership at any time. You'll retain benefits until the end of your current billing period.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Do discounts apply to all orders?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                Yes, member discounts apply automatically to all Buy Now and RFQ orders during your membership period.
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <h4 style={{ fontWeight: 900, marginBottom: 8 }}>Can I upgrade or downgrade?</h4>
                            <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                Absolutely! You can change your membership tier at any time. Changes take effect immediately.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="bd-card bd-card-pad" style={{ background: "linear-gradient(135deg, var(--bd-brand) 0%, #f97316 100%)", textAlign: "center", padding: "60px 20px" }}>
                    <h3 style={{ fontWeight: 900, fontSize: 32, marginBottom: 16, color: "white" }}>Start Your Membership Today</h3>
                    <p style={{ color: "rgba(255, 255, 255, 0.9)", marginBottom: 30, fontSize: 18, maxWidth: 600, margin: "0 auto 30px" }}>
                        Join thousands of successful businesses growing with Banadama. Get exclusive benefits, better pricing, and priority support.
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/account/membership" className="bd-btn bd-btn-lg" style={{ background: "white", color: "var(--bd-brand)", fontWeight: 900 }}>
                            View Plans & Pricing
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
