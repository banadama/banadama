"use client";

import { Icons } from "@/components/icons/icons";
import { useState } from "react";

export default function LiveChatPage() {
    const MessageCircleIcon = Icons.get("Chat");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would connect to a real chat system
        alert("Chat support will be available soon! For now, please email support@banadama.com");
    };

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <MessageCircleIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Live Chat Support</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Get instant help from our support team
                </p>
            </div>

            <div style={{ maxWidth: 700, margin: "40px auto" }}>
                <div className="bd-card bd-card-pad">
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Start a Conversation</h2>

                    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Your Name</label>
                            <input
                                type="text"
                                className="bd-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Email Address</label>
                            <input
                                type="email"
                                className="bd-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>How can we help you?</label>
                            <textarea
                                className="bd-input"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe your issue or question..."
                                rows={5}
                                required
                            />
                        </div>

                        <button type="submit" className="bd-btn bd-btn-primary bd-btn-lg">
                            Start Chat
                        </button>
                    </form>
                </div>

                <div className="bd-card bd-card-pad" style={{ marginTop: 24, background: "var(--bd-muted-bg)" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Other Ways to Get Help</h3>
                    <div style={{ display: "grid", gap: 12 }}>
                        <a href="/help" className="bd-btn">
                            Help Center
                        </a>
                        <a href="mailto:support@banadama.com" className="bd-btn">
                            Email: support@banadama.com
                        </a>
                        <a href="/support/order-status" className="bd-btn">
                            Check Order Status
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
