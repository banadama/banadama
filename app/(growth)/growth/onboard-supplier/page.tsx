// app/(growth)/growth/onboard-supplier/page.tsx - Growth Onboard Supplier
"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const CATEGORIES = [
    "Packaging",
    "Fashion",
    "Textiles",
    "Agriculture",
    "Electronics",
    "Food & Beverage",
    "Building Materials",
];

export default function OnboardSupplier() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        businessName: "",
        country: "NG",
        category: "",
        phone: "",
        email: "",
        location: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: API call to submit supplier lead
            await new Promise((r) => setTimeout(r, 1000));
            setSuccess(true);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bd-grid" style={{ maxWidth: 720, gap: 20 }}>
                <Card>
                    <CardBody className="bd-grid" style={{ gap: 20, textAlign: "center", padding: 40 }}>
                        <div style={{ fontSize: 48 }}>✅</div>
                        <div className="bd-h2">Supplier Submitted!</div>
                        <p className="bd-p">
                            The supplier lead has been recorded. Ops will review and follow up.
                        </p>
                        <Button variant="primary" onClick={() => setSuccess(false)}>
                            Onboard Another
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="bd-grid" style={{ maxWidth: 720, gap: 20 }}>
            <div className="bd-row" style={{ justifyContent: "space-between" }}>
                <div className="bd-h2">🌱 Onboard Supplier (Field)</div>
                <Badge>Growth Agent</Badge>
            </div>

            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit} className="bd-grid" style={{ gap: 16 }}>
                        <div>
                            <label className="bd-label">Business Name *</label>
                            <input
                                className="bd-input"
                                placeholder="e.g., ABC Trading Co."
                                value={formData.businessName}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="bd-label">Country *</label>
                            <select
                                className="bd-input"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            >
                                <option value="NG">🇳🇬 Nigeria</option>
                                <option value="BD">🇧🇩 Bangladesh</option>
                            </select>
                        </div>

                        <div>
                            <label className="bd-label">Category *</label>
                            <select
                                className="bd-input"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="">Select category...</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="bd-label">Phone/WhatsApp *</label>
                            <input
                                className="bd-input"
                                placeholder="+234..."
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="bd-label">Email (optional)</label>
                            <input
                                className="bd-input"
                                type="email"
                                placeholder="supplier@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="bd-label">Location / Market</label>
                            <input
                                className="bd-input"
                                placeholder="e.g., Alaba Market, Lagos"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Supplier Lead"}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
