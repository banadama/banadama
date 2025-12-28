// app/(regional)/bd/page.tsx - Bangladesh Regional Landing Page with Teal Theme
'use client';

import Link from "next/link";
import { Footer } from "@/components/sections/Footer";

export default function BangladeshLandingPage() {
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
                        🇧🇩 Banadama Bangladesh
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
                        Bangladesh's Premier <span style={{ color: '#5bc5cf' }}>Manufacturing Hub</span>
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#d1d5db',
                        marginBottom: '2rem',
                        lineHeight: 1.6,
                        maxWidth: '700px',
                        margin: '0 auto 2rem'
                    }}>
                        Connect with 1000+ verified Bangladeshi factories for apparel, textiles, leather goods, and more. Global quality, local expertise.
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
                                Explore Factories
                            </button>
                        </Link>
                        <a href="#how-it-works" style={{
                            padding: '1rem 2rem',
                            background: 'transparent',
                            color: 'white',
                            border: '2px solid white',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: 'all 0.2s'
                        }} onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#1f2a20';
                        }} onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'white';
                        }}>
                            How It Works
                        </a>
                    </div>

                    {/* Trust Badges */}
                    <div style={{
                        marginTop: '3rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '1.5rem',
                        maxWidth: '600px',
                        margin: '3rem auto 0'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>1,000+</div>
                            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.25rem' }}>Verified Factories</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>50+</div>
                            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.25rem' }}>Product Categories</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>৳500B+</div>
                            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.25rem' }}>Annual Export Value</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ BENEFITS SECTION ============ */}
            <section id="features" style={{
                padding: '5rem 1.5rem',
                backgroundColor: 'white'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#1f2a20',
                        marginBottom: '3rem',
                        textAlign: 'center',
                        letterSpacing: '-0.02em'
                    }}>
                        Why Choose Banadama Bangladesh?
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            {
                                title: 'Verified Factories',
                                desc: 'All factories are quality-audited and compliance-certified (BGMEA, BKMEA, ISO)',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M3 13v6a2 2 0 0 0 2 2h14a0 0 0 0 0 0V13" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 10l7-4 7 4" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10 6v6" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            },
                            {
                                title: 'All Categories',
                                desc: 'Apparel, textiles, leather goods, handicrafts, home goods, and more',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" fill="#0f172a" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Taka Pricing',
                                desc: 'Direct BDT pricing with no currency conversion fees for maximum cost savings',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M12 1v22" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M17 7H7c-2 0-3 1-3 3s1 3 3 3h6c2 0 3 1 3 3s-1 3-3 3H7" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Logistics Network',
                                desc: 'Dhaka to worldwide shipping with tracking and quality checks',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M3 7h13v8H3z" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M16 12h4l-1 3h-3v-3z" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="7.5" cy="16.5" r="1.5" fill="#0f172a" />
                                        <circle cx="18.5" cy="16.5" r="1.5" fill="#0f172a" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Escrow Protection',
                                desc: '100% payment protection until goods pass quality inspection',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 12l2 2 4-4" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            },
                            {
                                title: '24/7 Support',
                                desc: 'Dedicated BD operations team to resolve issues and ensure success',
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M3 6v6a9 9 0 0 0 18 0V6" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 14v2a2 2 0 0 0 2 2h4" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="9" r="2" stroke="#0f172a" strokeWidth="1.5" />
                                    </svg>
                                )
                            }
                        ].map((benefit, i) => (
                            <div key={i} style={{
                                padding: '2rem',
                                background: '#f3f4f6',
                                borderRadius: '12px',
                                transition: 'all 0.3s',
                                cursor: 'pointer'
                            }} onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#5bc5cf';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.querySelector('h3').style.color = 'white';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f3f4f6';
                                e.currentTarget.style.color = 'inherit';
                                e.currentTarget.querySelector('h3').style.color = '#1f2a20';
                            }}>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    color: '#1f2a20',
                                    marginBottom: '0.75rem',
                                    transition: 'color 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <span style={{ display: 'inline-flex', width: 28, height: 28 }}>{benefit.icon}</span>
                                    <span>{benefit.title}</span>
                                </h3>
                                <p style={{
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6,
                                    color: '#6b7280'
                                }}>
                                    {benefit.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ HOW IT WORKS ============ */}
            <section id="how-it-works" style={{
                background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                color: 'white',
                padding: '5rem 1.5rem'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        marginBottom: '3rem',
                        textAlign: 'center',
                        letterSpacing: '-0.02em'
                    }}>
                        How It Works
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            { step: '1', title: 'Browse Factories', desc: 'Search 1000+ verified BD manufacturers' },
                            { step: '2', title: 'Send Request', desc: 'Send RFQs or view catalog listings' },
                            { step: '3', title: 'Negotiate', desc: 'Discuss pricing and terms directly' },
                            { step: '4', title: 'Secure Order', desc: 'Escrow payment protection activated' },
                            { step: '5', title: 'Production', desc: 'Track progress from cutting to packing' },
                            { step: '6', title: 'Delivery', desc: 'Door-to-door worldwide shipping' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                textAlign: 'center',
                                padding: '2rem',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                transition: 'all 0.3s'
                            }} onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                                <div style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 700,
                                    marginBottom: '0.75rem',
                                    color: 'white'
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    marginBottom: '0.5rem'
                                }}>
                                    {item.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: '#d1d5db'
                                }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA SECTION ============ */}
            <section style={{
                padding: '4rem 1.5rem',
                background: 'white',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#1f2a20',
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Ready to Connect with Bangladesh's Best Manufacturers?
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#6b7280',
                        marginBottom: '2rem',
                        lineHeight: 1.6
                    }}>
                        Join buyers from 80+ countries sourcing from Banadama Bangladesh
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
                        <a href="mailto:bd@banadama.com" style={{
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
                            Contact Dhaka Team
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
