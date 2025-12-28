// app/page.tsx - PREMIUM LANDING PAGE
import Link from 'next/link';
import { LandingPageClient } from '@/components/sections/LandingPageClient';

export const metadata = {
    title: "Banadama - Global B2B Marketplace | Trade Safely Nigeria & Bangladesh",
    description:
        "Secure B2B marketplace with escrow protection, verified suppliers, and ops-managed fulfillment. Trade between Nigeria, Bangladesh, and the world.",
};

export default function LandingPage() {
    return <LandingPageClient />;
    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* ============ HEADER ============ */}
            <header style={{
                background: '#3d5c4f',
                color: 'white',
                padding: '1rem 0',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                        Banadama
                    </div>
                    <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <a href="#features" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
                            Features
                        </a>
                        <a href="#how-it-works" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
                            How It Works
                        </a>
                        <a href="/marketplace" style={{
                            padding: '0.75rem 1.5rem',
                            background: '#ffffff',
                            color: '#3d5c4f',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            transition: 'transform 0.2s'
                        }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                            Go to Marketplace
                        </a>
                    </nav>
                </div>
            </header>

            {/* ============ HERO SECTION ============ */}
            <section style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                color: 'white',
                padding: '6rem 1.5rem',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: 700,
                        marginBottom: '1.5rem',
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em'
                    }}>
                        Trade Across Borders with <span style={{ color: '#5bc5cf' }}>Complete Safety</span>
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#d1d5db',
                        marginBottom: '2rem',
                        lineHeight: 1.6,
                        maxWidth: '700px',
                        margin: '0 auto 2rem'
                    }}>
                        Connect with verified suppliers from Nigeria, Bangladesh, and beyond. Trade with escrow protection, transparent pricing, and expert support.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
                        <Link href="/auth/register">
                            <button style={{
                                padding: '1rem 2rem',
                                background: '#3d5c4f',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }} onMouseEnter={(e) => {
                                e.target.style.background = '#2d4437';
                                e.target.style.transform = 'translateY(-2px)';
                            }} onMouseLeave={(e) => {
                                e.target.style.background = '#3d5c4f';
                                e.target.style.transform = 'translateY(0)';
                            }}>
                                Create Free Account
                            </button>
                        </Link>
                        <Link href="/marketplace">
                            <button style={{
                                padding: '1rem 2rem',
                                background: 'transparent',
                                color: 'white',
                                border: '2px solid #5bc5cf',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }} onMouseEnter={(e) => {
                                e.target.style.background = '#5bc5cf';
                                e.target.style.color = '#1f2937';
                                e.target.style.transform = 'translateY(-2px)';
                            }} onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = 'white';
                                e.target.style.transform = 'translateY(0)';
                            }}>
                                Browse Products
                            </button>
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        marginTop: '3rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#5bc5cf' }}>50K+</div>
                            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Active Sellers</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#5bc5cf' }}>$100M+</div>
                            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Trade Volume</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#5bc5cf' }}>99.8%</div>
                            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ FEATURES SECTION ============ */}
            <section id="features" style={{ padding: '4rem 1.5rem', backgroundColor: '#ffffff' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: '1rem',
                        color: '#1f2937'
                    }}>
                        Why Choose Banadama?
                    </h2>
                    <p style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        marginBottom: '3rem',
                        fontSize: '1.125rem'
                    }}>
                        Everything you need for safe, seamless international trade
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            {
                                title: 'Escrow Protection',
                                desc: 'All transactions secured in escrow until delivery. Your money is always protected.',
                                icon: '🔒'
                            },
                            {
                                title: 'Verified Suppliers',
                                desc: 'All sellers verified and rated. Trade only with legitimate, trusted businesses.',
                                icon: '✓'
                            },
                            {
                                title: 'Global Logistics',
                                desc: 'Integrated shipping solutions with real-time tracking and door-to-door delivery.',
                                icon: '📦'
                            },
                            {
                                title: 'Buy Now + RFQ',
                                desc: 'Instant purchases or bulk request for quotes. Choose what works for your business.',
                                icon: '💬'
                            },
                            {
                                title: 'Expert Support',
                                desc: '24/7 customer support team to assist with transactions and dispute resolution.',
                                icon: '👥'
                            },
                            {
                                title: 'Transparent Pricing',
                                desc: 'No hidden fees. See all costs upfront including shipping, taxes, and insurance.',
                                icon: '💰'
                            }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                style={{
                                    background: '#f9fafb',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ HOW IT WORKS ============ */}
            <section id="how-it-works" style={{ padding: '4rem 1.5rem', backgroundColor: '#f9fafb' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: '3rem',
                        color: '#1f2937'
                    }}>
                        How It Works
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                        {[
                            { step: '1', title: 'Create Account', desc: 'Sign up in 2 minutes with email or phone verification' },
                            { step: '2', title: 'Browse Products', desc: 'Explore 50K+ verified suppliers and products' },
                            { step: '3', title: 'Make Offer', desc: 'Buy now instantly or send RFQ for custom quotes' },
                            { step: '4', title: 'Secure Payment', desc: 'Pay via escrow with multiple payment methods' },
                            { step: '5', title: 'Track Shipment', desc: 'Real-time tracking from warehouse to doorstep' },
                            { step: '6', title: 'Receive & Confirm', desc: 'Inspect goods and release payment to seller' }
                        ].map((item, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: '#3d5c4f',
                                    color: 'white',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    margin: '0 auto 1rem'
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA SECTION ============ */}
            <section style={{
                background: '#3d5c4f',
                color: 'white',
                padding: '4rem 1.5rem',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        marginBottom: '1rem'
                    }}>
                        Ready to Start Trading?
                    </h2>
                    <p style={{
                        fontSize: '1.125rem',
                        marginBottom: '2rem',
                        color: 'rgba(255,255,255,0.95)',
                        lineHeight: 1.6
                    }}>
                        Join thousands of businesses trading safely across Nigeria, Bangladesh, and the globe.
                    </p>
                    <Link href="/auth/register">
                        <button style={{
                            padding: '1.25rem 2.5rem',
                            background: 'white',
                            color: '#3d5c4f',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '1.05rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }} onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                        }} onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                        }}>
                            Get Started Free
                        </button>
                    </Link>
                </div>
            </section>

            {/* ============ FOOTER ============ */}
            <footer style={{
                background: '#1f2937',
                color: '#9ca3af',
                padding: '3rem 1.5rem',
                borderTop: '1px solid #374151'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem' }}>About</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>About Us</a></li>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Blog</a></li>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem' }}>Support</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Help Center</a></li>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact Us</a></li>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Safety Tips</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem' }}>Legal</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms</a></li>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy</a></li>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Cookies</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem' }}>Follow Us</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Twitter</a></li>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>LinkedIn</a></li>
                                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Instagram</a></li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid #374151' }}>
                        <p>&copy; 2025 Banadama. All rights reserved. Secure trading platform for Nigeria, Bangladesh & Global markets.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
