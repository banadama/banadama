"use client";

import { Icons } from "@/components/icons/icons";
import { useState } from "react";

export default function VerificationApplicationPage() {
    const ShieldCheckIcon = Icons.get("ShieldCheck");
    const UploadIcon = Icons.get("Upload");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="bd-container bd-page">
                <div className="bd-card bd-card-pad" style={{ maxWidth: 600, margin: "60px auto", textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                    <h1 className="bd-h1" style={{ fontSize: 32, marginBottom: 12 }}>Application Submitted!</h1>
                    <p className="bd-p" style={{ color: "var(--bd-muted)", marginBottom: 30 }}>
                        Thank you for applying for Verified Supplier status. Our compliance team will review your documents and contact you within 3-5 business days.
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/supplier/dashboard" className="bd-btn bd-btn-primary">Go to Dashboard</a>
                        <a href="/help" className="bd-btn">Help Center</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", textAlign: "center", padding: "60px 20px" }}>
                <ShieldCheckIcon size={64} style={{ margin: "0 auto 20px", color: "white" }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12, color: "white" }}>Apply for Verification</h1>
                <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 16 }}>
                    Complete this application to become a Verified Supplier
                </p>
            </div>

            <div style={{ maxWidth: 800, margin: "40px auto" }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gap: 40 }}>
                        {/* Business Information */}
                        <section className="bd-card bd-card-pad">
                            <h2 className="bd-h2" style={{ marginBottom: 20 }}>Business Information</h2>
                            <div style={{ display: "grid", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Legal Business Name *</label>
                                    <input type="text" className="bd-input" placeholder="Acme Trading Ltd" required />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Country *</label>
                                        <select className="bd-input" required>
                                            <option value="">Select country</option>
                                            <option value="NG">Nigeria</option>
                                            <option value="BD">Bangladesh</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Registration Number *</label>
                                        <input type="text" className="bd-input" placeholder="RC123456" required />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Tax ID / VAT Number *</label>
                                    <input type="text" className="bd-input" placeholder="12345678-0001" required />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Business Address *</label>
                                    <textarea className="bd-input" rows={3} placeholder="Full business address" required />
                                </div>
                            </div>
                        </section>

                        {/* Contact Person */}
                        <section className="bd-card bd-card-pad">
                            <h2 className="bd-h2" style={{ marginBottom: 20 }}>Primary Contact</h2>
                            <div style={{ display: "grid", gap: 16 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Full Name *</label>
                                        <input type="text" className="bd-input" placeholder="John Doe" required />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Position/Title *</label>
                                        <input type="text" className="bd-input" placeholder="Managing Director" required />
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Email *</label>
                                        <input type="email" className="bd-input" placeholder="contact@company.com" required />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Phone *</label>
                                        <input type="tel" className="bd-input" placeholder="+234 XXX XXX XXXX" required />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Document Upload */}
                        <section className="bd-card bd-card-pad">
                            <h2 className="bd-h2" style={{ marginBottom: 20 }}>Required Documents</h2>
                            <div style={{ display: "grid", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Business Registration Certificate *</label>
                                    <div className="bd-card" style={{ padding: 20, textAlign: "center", cursor: "pointer", border: "2px dashed var(--bd-border)" }}>
                                        <UploadIcon size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                                        <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                            Click to upload or drag and drop (PDF, JPG, PNG - Max 5MB)
                                        </p>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} required />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Tax ID Document *</label>
                                    <div className="bd-card" style={{ padding: 20, textAlign: "center", cursor: "pointer", border: "2px dashed var(--bd-border)" }}>
                                        <UploadIcon size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                                        <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                            Click to upload or drag and drop (PDF, JPG, PNG - Max 5MB)
                                        </p>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} required />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Proof of Address *</label>
                                    <div className="bd-card" style={{ padding: 20, textAlign: "center", cursor: "pointer", border: "2px dashed var(--bd-border)" }}>
                                        <UploadIcon size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                                        <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                            Click to upload or drag and drop (PDF, JPG, PNG - Max 5MB)
                                        </p>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} required />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Government-Issued ID (Owner/Director) *</label>
                                    <div className="bd-card" style={{ padding: 20, textAlign: "center", cursor: "pointer", border: "2px dashed var(--bd-border)" }}>
                                        <UploadIcon size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                                        <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                            Click to upload or drag and drop (PDF, JPG, PNG - Max 5MB)
                                        </p>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} required />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Product Certifications (Optional)</label>
                                    <div className="bd-card" style={{ padding: 20, textAlign: "center", cursor: "pointer", border: "2px dashed var(--bd-border)" }}>
                                        <UploadIcon size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                                        <p style={{ color: "var(--bd-muted)", fontSize: 14, margin: 0 }}>
                                            CE, NAFDAC, ISO, etc. (PDF, JPG, PNG - Max 5MB)
                                        </p>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment */}
                        <section className="bd-card bd-card-pad" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                            <h2 className="bd-h2" style={{ marginBottom: 20 }}>Verification Fee</h2>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
                                <div>
                                    <div style={{ fontSize: 14, color: "var(--bd-muted)", marginBottom: 4 }}>One-time verification fee</div>
                                    <div style={{ fontSize: 32, fontWeight: 900, color: "#3b82f6" }}>$49</div>
                                    <div style={{ fontSize: 13, color: "var(--bd-muted)" }}>Annual renewal: $19/year</div>
                                </div>
                                <div>
                                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                                        <input type="checkbox" required />
                                        <span style={{ fontSize: 14 }}>I agree to the verification fee and <a href="/terms" style={{ color: "var(--bd-brand)" }}>terms</a></span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Submit */}
                        <div style={{ textAlign: "center" }}>
                            <button type="submit" className="bd-btn bd-btn-primary bd-btn-lg" style={{ minWidth: 300 }}>
                                Submit Application
                            </button>
                            <p style={{ color: "var(--bd-muted)", fontSize: 13, marginTop: 16 }}>
                                You'll be redirected to payment after submission
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
