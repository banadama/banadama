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
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh' }}>
            <header style={{ backgroundColor: '#2b3d2d', padding: '1rem 0', borderBottom: '2px solid white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Help Center</h1>
                    <p style={{ color: 'white', opacity: 0.9, margin: '0.5rem 0 0 0' }}>Find answers to your questions</p>
                </div>
            </header>

            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
                <div style={{ display: 'grid', gap: '2rem' }}>
                    {faqs.map((section, idx) => (
                        <div key={idx} style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                            <h2 style={{ color: '#2b3d2d', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>{section.category}</h2>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {section.questions.map((qa, i) => (
                                    <div key={i} style={{ paddingBottom: '1rem', borderBottom: i < section.questions.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                                        <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{qa.q}</h3>
                                        <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>{qa.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <a href="/contact" style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500, marginRight: '1rem' }}>Contact Us</a>
                    <a href="/marketplace" style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}>Back to Marketplace</a>
                </div>
            </main>
        </div>
    );
}
