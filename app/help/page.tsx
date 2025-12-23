import { Icons } from "@/components/icons/icons";

export default function HelpCenterPage() {
    const SearchIcon = Icons.get("Search");
    const MessageCircleIcon = Icons.get("Chat");
    const BookIcon = Icons.get("Document");
    const HelpCircleIcon = Icons.get("HelpCircle");
    const ShieldIcon = Icons.get("Shield");
    const CreditCardIcon = Icons.get("CreditCard");
    const PackageIcon = Icons.get("Package");
    const UsersIcon = Icons.get("Users");

    const faqs = [
        {
            category: "Getting Started",
            icon: "HelpCircle",
            questions: [
                {
                    q: "How do I create an account?",
                    a: "Click 'Get Started' on the homepage, select your language, choose your account type (Buyer, Supplier, Creator, or Affiliate), and complete the registration form."
                },
                {
                    q: "What are the different account types?",
                    a: "Buyer - Purchase products; Supplier (Factory/Wholesaler) - Sell products; Creator - Offer digital products or local services; Affiliate - Earn commissions by referring users."
                },
                {
                    q: "Is Banadama available in my country?",
                    a: "Banadama is primarily available in Nigeria and Bangladesh for local transactions. Digital products are available globally."
                }
            ]
        },
        {
            category: "Payments & Security",
            icon: "Shield",
            questions: [
                {
                    q: "How does escrow protection work?",
                    a: "When you make a purchase, your payment is held securely in escrow. Funds are only released to the supplier after you confirm delivery or our Ops team verifies completion."
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We accept card payments, bank transfers, and mobile money (where available). All transactions are processed securely."
                },
                {
                    q: "Is my payment information secure?",
                    a: "Yes! We use industry-standard encryption and never store your full card details. All payments are processed through secure payment gateways."
                }
            ]
        },
        {
            category: "Buying Products",
            icon: "Package",
            questions: [
                {
                    q: "What's the difference between Buy Now and RFQ?",
                    a: "Buy Now lets you purchase at a fixed price instantly. RFQ (Request for Quote) allows you to negotiate pricing and terms with the supplier for custom orders."
                },
                {
                    q: "How do I track my order?",
                    a: "Go to Buyer Dashboard > Orders to see real-time status updates. You'll also receive email notifications at each stage."
                },
                {
                    q: "What if I receive a defective product?",
                    a: "Contact our Ops team immediately through the dispute chat. Your funds will remain in escrow until the issue is resolved."
                }
            ]
        },
        {
            category: "Selling Products",
            icon: "Package",
            questions: [
                {
                    q: "How do I list products for sale?",
                    a: "From your Supplier Dashboard, go to Products > Add New Product. Fill in the details, set pricing, upload images, and publish."
                },
                {
                    q: "When do I receive payment?",
                    a: "Funds are released from escrow after the buyer confirms delivery or after our standard delivery confirmation period."
                },
                {
                    q: "What fees does Banadama charge?",
                    a: "We charge a small service fee on each transaction. Exact rates depend on your service plan. Check the Pricing section for details."
                }
            ]
        },
        {
            category: "For Creators",
            icon: "Users",
            questions: [
                {
                    q: "What can I sell as a Creator?",
                    a: "You can offer digital products (templates, graphics, courses) globally or local services (consulting, design, etc.) in Nigeria and Bangladesh."
                },
                {
                    q: "How do I set up my creator profile?",
                    a: "Go to Creator Dashboard > Setup. Add your display name, bio, portfolio, and configure your service offerings."
                },
                {
                    q: "Can I offer both digital and local services?",
                    a: "Yes! You can create multiple listings for different types of services."
                }
            ]
        }
    ];

    return (
        <div className="bd-container bd-page">
            {/* Hero Section */}
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <HelpCircleIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Help Center</h1>
                <p className="bd-p" style={{ fontSize: 18, maxWidth: 600, margin: "0 auto 30px" }}>
                    Find answers to common questions and get support
                </p>

                {/* Search Bar */}
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <div className="bd-input" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
                        <SearchIcon size={20} style={{ opacity: 0.5 }} />
                        <input
                            type="text"
                            placeholder="Search for help..."
                            style={{
                                flex: 1,
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                fontSize: 16,
                                color: "var(--bd-text)"
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginTop: 40 }}>
                <a href="/help#contact" className="bd-card bd-card-pad" style={{ textDecoration: "none", color: "inherit", transition: "transform 0.2s", cursor: "pointer" }}>
                    <MessageCircleIcon size={32} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                    <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Contact Support</div>
                    <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                        Get help from our support team
                    </div>
                </a>

                <a href="/help#guides" className="bd-card bd-card-pad" style={{ textDecoration: "none", color: "inherit", transition: "transform 0.2s", cursor: "pointer" }}>
                    <BookIcon size={32} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                    <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>User Guides</div>
                    <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                        Step-by-step tutorials and guides
                    </div>
                </a>

                <a href="/help#trust" className="bd-card bd-card-pad" style={{ textDecoration: "none", color: "inherit", transition: "transform 0.2s", cursor: "pointer" }}>
                    <ShieldIcon size={32} style={{ marginBottom: 12, color: "var(--bd-brand)" }} />
                    <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Trust & Safety</div>
                    <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                        Learn about our security measures
                    </div>
                </a>
            </div>

            {/* FAQ Sections */}
            <div style={{ marginTop: 60 }}>
                <h2 className="bd-h2" style={{ marginBottom: 30 }}>Frequently Asked Questions</h2>

                <div style={{ display: "grid", gap: 40 }}>
                    {faqs.map((section, idx) => (
                        <div key={idx}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                <div style={{ fontWeight: 900, fontSize: 22 }}>{section.category}</div>
                            </div>

                            <div style={{ display: "grid", gap: 16 }}>
                                {section.questions.map((item, qIdx) => (
                                    <div key={qIdx} className="bd-card bd-card-pad">
                                        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
                                            {item.q}
                                        </div>
                                        <div style={{ color: "var(--bd-muted)", lineHeight: 1.6 }}>
                                            {item.a}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Section */}
            <div id="contact" className="bd-card bd-card-pad" style={{ marginTop: 60, background: "var(--bd-muted-bg)", padding: "40px" }}>
                <h3 className="bd-h3" style={{ marginBottom: 20, textAlign: "center" }}>Still Need Help?</h3>
                <p style={{ color: "var(--bd-muted)", textAlign: "center", marginBottom: 30 }}>
                    Our support team is here to help you
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <a className="bd-btn bd-btn-primary" href="mailto:support@banadama.com">
                        <MessageCircleIcon size={18} /> Email Support
                    </a>
                    <a className="bd-btn" href="/marketplace">
                        <PackageIcon size={18} /> Browse Marketplace
                    </a>
                </div>
            </div>

            {/* Additional Resources */}
            <div style={{ marginTop: 40, textAlign: "center", padding: "20px" }}>
                <div style={{ color: "var(--bd-muted)", marginBottom: 12 }}>More Resources</div>
                <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                    <a href="/terms" style={{ color: "var(--bd-brand)" }}>Terms of Service</a>
                    <span style={{ color: "var(--bd-muted)" }}>•</span>
                    <a href="/privacy" style={{ color: "var(--bd-brand)" }}>Privacy Policy</a>
                    <span style={{ color: "var(--bd-muted)" }}>•</span>
                    <a href="/marketplace" style={{ color: "var(--bd-brand)" }}>Marketplace</a>
                </div>
            </div>
        </div>
    );
}
