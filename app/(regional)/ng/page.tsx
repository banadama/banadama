// app/(regional)/ng/page.tsx - Nigeria Regional Landing Page with Teal Theme
'use client';

import Link from "next/link";
import { Footer } from "@/components/sections/Footer";

export default function NigeriaLandingPage() {
    return (
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh' }}>
            {/* ============ HEADER ============ */}
            <header style={{
                background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                color: 'white',
                padding: '1rem 0',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                        🇳🇬 Banadama Nigeria
                    </div>
                    <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <a href="#features" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                            Features
                        </a>
                        <a href="#how-it-works" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                            How It Works
                        </a>
                        <Link href="/" style={{
                            padding: '0.75rem 1.5rem',
                            background: 'white',
                            color: '#5bc5cf',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            transition: 'transform 0.2s',
                            display: 'inline-block'
                        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            Back to Main
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ============ HERO SECTION ============ */}
            <section style={{
                background: 'linear-gradient(135deg, #2b3d2d 0%, #1f2a20 100%)',
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
                        Source From Global <span style={{ color: '#5bc5cf' }}>Verified Factories</span>
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#d1d5db',
                        marginBottom: '2rem',
                        lineHeight: 1.6,
                        maxWidth: '700px',
                        margin: '0 auto 2rem'
                    }}>
                        Direct access to manufacturers in Bangladesh and China with local logistics in Nigeria, Naira payments, and door-to-door delivery.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
                        <Link href="/marketplace">
                            <button style={{
                                padding: '1rem 2rem',
                                background: '#5bc5cf',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }} onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#4ab8c2';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#5bc5cf';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                                Explore Marketplace
                            </button>
                        </Link>
                        <a href="#how-it-works" style={{
                            padding: '1rem 2rem',
                            background: 'transparent',
                            color: 'white',
                            border: '2px solid #5bc5cf',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textDecoration: 'none',
                            display: 'inline-block'
                        }} onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#5bc5cf';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }} onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                            Post Sourcing Request
                        </a>
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
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#5bc5cf' }}>12,000+</div>
                            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Active Buyers in NG</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#5bc5cf' }}>500+</div>
                            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Verified Suppliers</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#5bc5cf' }}>₦2.5B+</div>
                            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Trade Volume</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ FEATURES SECTION ============ */}
            <section id="features" style={{ padding: '4rem 1.5rem', backgroundColor: '#c4ccc8' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: '1rem',
                        color: '#1f2937'
                    }}>
                        Why Source on Banadama Nigeria?
                    </h2>
                    <p style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        marginBottom: '3rem',
                        fontSize: '1.125rem'
                    }}>
                        Sourcing made simple with local expertise and global reach
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            {
                                title: 'Verified Factories',
                                desc: 'Our team in Bangladesh inspects every factory. Direct-from-manufacturer pricing without middleman costs.',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M3 13v6a2 2 0 0 0 2 2h14a0 0 0 0 0 0V13" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 10l7-4 7 4" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10 6v6" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Local Logistics',
                                desc: 'Automated clearing, forwarding, and delivery. Track your goods from factory to your door in Nigeria.',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M3 7h13v8H3z" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M16 12h4l-1 3h-3v-3z" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="7.5" cy="16.5" r="1.5" fill="#1f2937" />
                                        <circle cx="18.5" cy="16.5" r="1.5" fill="#1f2937" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Naira Payments',
                                desc: 'Pay in Naira with escrow protection. No foreign exchange surprises or payment delays.',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M12 1v22" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M17 7H7c-2 0-3 1-3 3s1 3 3 3h6c2 0 3 1 3 3s-1 3-3 3H7" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Bulk Orders',
                                desc: 'Request custom quotes from manufacturers. We handle MOQ negotiations and factory coordination.',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" fill="#1f2937" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Quality Assurance',
                                desc: 'Pre-shipment inspection and documentation. Guaranteed quality or money back.',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" stroke="#1f2937" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 12l2 2 4-4" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            },
                            {
                                title: '24/7 Support',
                                desc: 'Dedicated team in Lagos. Call, email, or visit our office for local support.',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M3 6v6a9 9 0 0 0 18 0V6" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 14v2a2 2 0 0 0 2 2h4" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="9" r="2" stroke="#1f2937" strokeWidth="1.5" />
                                    </svg>
                                )
                            }
                        ].map((feature, i) => (
                            <div key={i} style={{
                                backgroundColor: 'white',
                                padding: '2rem',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }} onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    marginBottom: '0.5rem',
                                    color: '#1f2937',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <span style={{ display: 'inline-flex', width: 28, height: 28 }}>{feature.icon}</span>
                                    <span>{feature.title}</span>
                                </h3>
                                <p style={{
                                    color: '#6b7280',
                                    lineHeight: 1.6
                                }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ HOW IT WORKS SECTION ============ */}
            <section id="how-it-works" style={{
                background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                color: 'white',
                padding: '4rem 1.5rem'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: '1rem'
                    }}>
                        How It Works
                    </h2>
                    <p style={{
                        textAlign: 'center',
                        fontSize: '1.125rem',
                        marginBottom: '3rem',
                        color: 'rgba(255,255,255,0.9)'
                    }}>
                        From sourcing request to delivery in 7-14 days
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            { step: '01', title: 'Post Request', desc: 'Tell us what you need. Quantity, specs, budget, timeline.' },
                            { step: '02', title: 'Get Quotes', desc: 'Verified factories send you proposals in 24 hours.' },
                            { step: '03', title: 'Negotiate', desc: 'We handle bargaining and terms. You approve the best deal.' },
                            { step: '04', title: 'Production', desc: 'Factory produces to your specs. We inspect quality.' },
                            { step: '05', title: 'Logistics', desc: 'We handle all shipping, customs, and clearance.' },
                            { step: '06', title: 'Delivery', desc: 'Door-to-door delivery in Lagos or your location.' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                padding: '2rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 700,
                                    marginBottom: '1rem',
                                    opacity: 0.5
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    marginBottom: '0.5rem'
                                }}>
                                    {item.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: 'rgba(255,255,255,0.85)',
                                    lineHeight: 1.6
                                }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA SECTION ============ */}
            <section style={{ padding: '4rem 1.5rem', backgroundColor: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        marginBottom: '1rem',
                        color: '#1f2937'
                    }}>
                        Ready to Source Smarter?
                    </h2>
                    <p style={{
                        fontSize: '1.125rem',
                        color: '#6b7280',
                        marginBottom: '2rem'
                    }}>
                        Join thousands of Nigerian businesses sourcing directly from global manufacturers with Banadama.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/marketplace">
                            <button style={{
                                padding: '1rem 2rem',
                                background: '#5bc5cf',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }} onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#4ab8c2';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#5bc5cf';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                                Browse Products
                            </button>
                        </Link>
                        <a href="mailto:support@banadama.com" style={{
                            padding: '1rem 2rem',
                            background: 'white',
                            color: '#5bc5cf',
                            border: '2px solid #5bc5cf',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: 'all 0.2s'
                        }} onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#5bc5cf';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }} onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#5bc5cf';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                            Contact Our Lagos Team
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
