"use client";

import { Icons } from "@/components/icons/icons";
import { useState } from "react";

export default function ReportAbusePage() {
    const AlertTriangleIcon = Icons.get("Warning");
    const ShieldIcon = Icons.get("Shield");
    const CheckCircleIcon = Icons.get("Check");
    const XCircleIcon = Icons.get("X");
    const DollarIcon = Icons.get("CreditCard");
    const FileIcon = Icons.get("Document");
    const UsersIcon = Icons.get("Users");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "center", padding: "60px 20px" }}>
                <AlertTriangleIcon size={64} style={{ margin: "0 auto 20px", color: "#ef4444" }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Report Abuse</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Help us keep Banadama safe and trustworthy
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto", display: "grid", gap: 40 }}>
                {/* Introduction */}
                <section>
                    <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                            <ShieldIcon size={32} style={{ color: "var(--bd-brand)", flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Your Safety Matters</h3>
                                <p style={{ color: "var(--bd-muted)", lineHeight: 1.6, margin: 0 }}>
                                    We take all reports seriously and investigate each case thoroughly. Your report helps protect the entire Banadama community.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Report Types */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>What You Can Report</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                <XCircleIcon size={20} style={{ color: "#ef4444" }} />
                                <h4 style={{ fontWeight: 900, margin: 0 }}>Prohibited Products</h4>
                            </div>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0, paddingLeft: 30 }}>
                                Counterfeit goods, illegal items, dangerous products
                            </p>
                        </div>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                <DollarIcon size={20} style={{ color: "#f59e0b" }} />
                                <h4 style={{ fontWeight: 900, margin: 0 }}>Fraud & Scams</h4>
                            </div>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0, paddingLeft: 30 }}>
                                Payment fraud, fake sellers, phishing attempts
                            </p>
                        </div>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                <AlertTriangleIcon size={20} style={{ color: "#f97316" }} />
                                <h4 style={{ fontWeight: 900, margin: 0 }}>Misleading Listings</h4>
                            </div>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0, paddingLeft: 30 }}>
                                False descriptions, fake reviews, price manipulation
                            </p>
                        </div>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                <ShieldIcon size={20} style={{ color: "#3b82f6" }} />
                                <h4 style={{ fontWeight: 900, margin: 0 }}>Intellectual Property</h4>
                            </div>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0, paddingLeft: 30 }}>
                                Copyright infringement, trademark violations
                            </p>
                        </div>
                        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                <UsersIcon size={20} style={{ color: "#8b5cf6" }} />
                                <h4 style={{ fontWeight: 900, margin: 0 }}>User Misconduct</h4>
                            </div>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0, paddingLeft: 30 }}>
                                Harassment, threats, inappropriate behavior
                            </p>
                        </div>
                    </div>
                </section>

                {/* Report Form */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Submit a Report</h2>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="bd-card bd-card-pad" style={{ display: "grid", gap: 16 }}>
                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Report Type *</label>
                                <select className="bd-input" required>
                                    <option value="">Select type of abuse</option>
                                    <option value="prohibited-product">Prohibited Product</option>
                                    <option value="fraud">Fraud or Scam</option>
                                    <option value="misleading">Misleading Listing</option>
                                    <option value="ip-violation">Intellectual Property Violation</option>
                                    <option value="harassment">Harassment or Threats</option>
                                    <option value="spam">Spam</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>What are you reporting? *</label>
                                <select className="bd-input" required>
                                    <option value="">Select...</option>
                                    <option value="product">Product Listing</option>
                                    <option value="user">User Account</option>
                                    <option value="message">Message/Communication</option>
                                    <option value="review">Review</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>URL or ID (if applicable)</label>
                                <input
                                    type="text"
                                    className="bd-input"
                                    placeholder="e.g., product URL, order ID, user ID"
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Your Email Address *</label>
                                <input
                                    type="email"
                                    className="bd-input"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Description *</label>
                                <textarea
                                    className="bd-input"
                                    placeholder="Please provide detailed information about the abuse you're reporting..."
                                    rows={6}
                                    required
                                />
                                <div style={{ fontSize: 13, color: "var(--bd-muted)", marginTop: 4 }}>
                                    Include specific details, dates, and any relevant information
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Evidence (Optional)</label>
                                <input
                                    type="file"
                                    className="bd-input"
                                    accept="image/*,.pdf"
                                    multiple
                                />
                                <div style={{ fontSize: 13, color: "var(--bd-muted)", marginTop: 4 }}>
                                    Upload screenshots, documents, or other evidence
                                </div>
                            </div>

                            <div className="bd-card bd-card-pad" style={{ background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.3)", boxShadow: "none" }}>
                                <div style={{ fontSize: 13, color: "var(--bd-muted)", lineHeight: 1.6 }}>
                                    <strong>Note:</strong> Submitting false reports may result in action against your account. All reports are reviewed confidentially.
                                </div>
                            </div>

                            <button type="submit" className="bd-btn bd-btn-primary bd-btn-lg">
                                Submit Report
                            </button>
                        </form>
                    ) : (
                        <div className="bd-card bd-card-pad" style={{ textAlign: "center", padding: "60px 20px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                            <CheckCircleIcon size={64} style={{ margin: "0 auto 20px", color: "#10b981" }} />
                            <h3 style={{ fontWeight: 900, fontSize: 24, marginBottom: 12 }}>Report Submitted</h3>
                            <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                                Thank you for helping keep Banadama safe. We'll review your report and take appropriate action within 24-48 hours.
                            </p>
                            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                                <button onClick={() => setSubmitted(false)} className="bd-btn">Submit Another Report</button>
                                <a href="/help" className="bd-btn">Help Center</a>
                            </div>
                        </div>
                    )}
                </section>

                {/* What Happens Next */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>What Happens Next?</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)" }}>1</div>
                            <div>
                                <strong>Review</strong>
                                <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Our team reviews your report within 24-48 hours</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)" }}>2</div>
                            <div>
                                <strong>Investigation</strong>
                                <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>We investigate and gather information</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)" }}>3</div>
                            <div>
                                <strong>Action</strong>
                                <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Appropriate action is taken (removal, suspension, etc.)</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ fontWeight: 900, fontSize: 24, color: "var(--bd-brand)" }}>4</div>
                            <div>
                                <strong>Follow-up</strong>
                                <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>We'll contact you if we need more information</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Emergency Contact */}
                <div className="bd-card bd-card-pad" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12, color: "#ef4444" }}>Emergency or Serious Threat?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 16 }}>
                        If you're facing an immediate safety threat or illegal activity, contact law enforcement first, then report to us.
                    </p>
                    <a href="mailto:abuse@banadama.com" className="bd-btn" style={{ background: "#ef4444", color: "white" }}>
                        Emergency: abuse@banadama.com
                    </a>
                </div>
            </div>
        </div>
    );
}
