'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiPost } from '@/lib/api';

type ModalType = 'register' | 'login' | null;

export function LandingPageClient() {
    const searchParams = useSearchParams();
    const [modal, setModal] = useState<ModalType>(null);
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Check for auth query parameter on mount
    useEffect(() => {
        const authParam = searchParams.get('auth');
        if (authParam === 'register' || authParam === 'login') {
            setModal(authParam as ModalType);
        }
    }, [searchParams]);
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
                        Banadama
                    </div>
                    <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <a href="#features" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                            Features
                        </a>
                        <a href="#how-it-works" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                            How It Works
                        </a>
                        <Link href="/marketplace" style={{
                            padding: '0.75rem 1.5rem',
                            background: 'white',
                            color: '#5bc5cf',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            transition: 'transform 0.2s',
                            display: 'inline-block'
                        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            Go to Marketplace
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
                        <button
                            onClick={() => setModal('register')}
                            style={{
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
                                Create Free Account
                            </button>
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
                                e.currentTarget.style.background = '#5bc5cf';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.transform = 'translateY(0)';
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
            <section id="features" style={{ padding: '4rem 1.5rem', backgroundColor: '#c4ccc8' }}>
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
                                icon: (
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5bc5cf" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                )
                            },
                            {
                                title: 'Verified Suppliers',
                                desc: 'All sellers verified and rated. Trade only with legitimate, trusted businesses.',
                                icon: (
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M2 4.5C2 3.11929 3.11929 2 4.5 2H19.5C20.8807 2 22 3.11929 22 4.5V19.5C22 20.8807 20.8807 22 19.5 22H4.5C3.11929 22 2 20.8807 2 19.5V4.5ZM18.787 9.57537C19.1767 9.18401 19.1753 8.55084 18.784 8.16116L18.0753 7.45558C17.684 7.0659 17.0508 7.06726 16.6611 7.45863L10.8895 13.2551L7.56845 9.98027C7.1752 9.59249 6.54205 9.59692 6.15427 9.99018L5.45213 10.7022C5.06436 11.0955 5.06879 11.7286 5.46204 12.1164L10.2003 16.7888C10.5922 17.1752 11.2228 17.1723 11.6111 16.7823L18.787 9.57537Z" fill="#5bc5cf"/>
                                    </svg>
                                )
                            },
                            {
                                title: 'Global Logistics',
                                desc: 'Integrated shipping solutions with real-time tracking and door-to-door delivery.',
                                icon: (
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.5431 1.66549C11.4491 1.16212 12.5509 1.16212 13.4569 1.66549L21.4856 6.12589C21.8031 6.30225 22 6.63685 22 7C22 7.00002 22 6.99998 22 7V16.4116C22 17.1379 21.6062 17.8072 20.9713 18.1599L12.5015 22.8653C12.2067 23.0366 11.7933 23.0366 11.4985 22.8653L3.02871 18.1599C2.39378 17.8072 2 17.1379 2 16.4116V7.00005C2.00002 6.6369 2.19691 6.30225 2.51436 6.12589L10.5431 1.66549ZM12.4856 3.41381C12.1836 3.24602 11.8164 3.24602 11.5144 3.41381L9.55918 4.50002L16.5001 8.35606L18.9409 7.00005L12.4856 3.41381ZM5.05913 7.00005L7.50005 5.64397L14.4409 9.50002L12 10.8561L5.05913 7.00005ZM13 20.3005L20 16.4116V8.69956L13 12.5884V20.3005ZM4 8.69956L11 12.5884V20.3005L4 16.4116V8.69956Z" fill="#5bc5cf"/>
                                    </svg>
                                )
                            },
                            {
                                title: 'Buy Now + RFQ',
                                desc: 'Instant purchases or bulk request for quotes. Choose what works for your business.',
                                icon: (
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5bc5cf" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                )
                            },
                            {
                                title: 'Expert Support',
                                desc: '24/7 customer support team to assist with transactions and dispute resolution.',
                                icon: (
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5bc5cf" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                )
                            },
                            {
                                title: 'Transparent Pricing',
                                desc: 'No hidden fees. See all costs upfront including shipping, taxes, and insurance.',
                                icon: (
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5bc5cf" strokeWidth="2">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                )
                            }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                style={{
                                    background: '#b8c1bb',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    border: '1px solid #9caea5',
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
                                <div style={{ marginBottom: '1rem' }}>{feature.icon}</div>
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
            <section id="how-it-works" style={{ padding: '4rem 1.5rem', backgroundColor: '#b8c1bb' }}>
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
                                    background: '#5bc5cf',
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
                background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
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
                            color: '#5bc5cf',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '1.05rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }} onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }} onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
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

            {/* ============ MODAL OVERLAY ============ */}
            {modal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1.5rem'
                }} onClick={() => setModal(null)}>
                    {/* Popover Container */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        overflow: 'hidden',
                        maxWidth: modal === 'login' ? '450px' : '500px',
                        width: '100%'
                    }} onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                            padding: '2rem',
                            textAlign: 'center',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <h1 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: 700,
                                    marginBottom: '0.5rem'
                                }}>
                                    {modal === 'register' ? 'Join Banadama' : 'Welcome Back'}
                                </h1>
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: 'rgba(255,255,255,0.9)',
                                    marginBottom: '1.5rem'
                                }}>
                                    {modal === 'register' ? 'Start trading with verified suppliers' : 'Sign in to your account'}
                                </p>
                                {modal === 'register' && (
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        justifyContent: 'center',
                                        flexWrap: 'wrap'
                                    }}>
                                        <Link href="/auth/login" style={{
                                            padding: '0.625rem 1.25rem',
                                            background: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            borderRadius: '6px',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'inline-block'
                                        }} onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                                        }} onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                                        }}>
                                            Sign In
                                        </Link>
                                        <button onClick={() => setModal(null)} style={{
                                            padding: '0.625rem 1.25rem',
                                            background: 'white',
                                            color: '#5bc5cf',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'inline-block'
                                        }} onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                        }} onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}>
                                            Create Free Account
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setModal(null)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    flexShrink: 0,
                                    marginTop: '1rem'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                ×
                            </button>
                        </div>

                        {/* Form Content */}
                        <div style={{ padding: '2rem' }}>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                setLoading(true);
                                setError('');

                                try {
                                    if (modal === 'register') {
                                        const result = await apiPost('/api/auth/register', {
                                            email: registerData.email,
                                            password: registerData.password,
                                            role: 'BUYER',
                                            country: 'US',
                                            profileData: {
                                                displayName: registerData.name,
                                                companyName: registerData.name,
                                            },
                                        });
                                        if (result.success) {
                                            setModal(null);
                                            router.push('/buyer/dashboard');
                                        } else {
                                            setError(result.error || 'Registration failed');
                                        }
                                    } else {
                                        const result = await apiPost('/api/auth/login', {
                                            email: loginData.email,
                                            password: loginData.password,
                                        });
                                        if (result.success) {
                                            setModal(null);
                                            router.push(result.dashboardUrl || '/buyer/dashboard');
                                        } else {
                                            setError(result.error || 'Login failed');
                                        }
                                    }
                                } catch (err: any) {
                                    setError(err.message || 'Request failed');
                                } finally {
                                    setLoading(false);
                                }
                            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {modal === 'register' && (
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            color: '#1f2937',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.95rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#f97316';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: '#1f2937',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={modal === 'register' ? registerData.email : loginData.email}
                                        onChange={(e) => {
                                            if (modal === 'register') {
                                                setRegisterData({ ...registerData, email: e.target.value });
                                            } else {
                                                setLoginData({ ...loginData, email: e.target.value });
                                            }
                                        }}
                                        placeholder="you@example.com"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#f97316';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            color: '#1f2937'
                                        }}>
                                            Password
                                        </label>
                                        {modal === 'login' && (
                                            <a href="/auth/forgot-password" style={{
                                                fontSize: '0.75rem',
                                                color: '#5bc5cf',
                                                textDecoration: 'none',
                                                fontWeight: 500
                                            }}>
                                                Forgot?
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="password"
                                        value={modal === 'register' ? registerData.password : loginData.password}
                                        onChange={(e) => {
                                            if (modal === 'register') {
                                                setRegisterData({ ...registerData, password: e.target.value });
                                            } else {
                                                setLoginData({ ...loginData, password: e.target.value });
                                            }
                                        }}
                                        placeholder={modal === 'register' ? 'Min 8 characters' : '••••••••'}
                                        required
                                        minLength={8}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#f97316';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                {error && (
                                    <div style={{
                                        background: '#fee2e2',
                                        border: '1px solid #fecaca',
                                        color: '#dc2626',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem'
                                    }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: '0.875rem 1.5rem',
                                        background: loading ? '#3aabb5' : '#5bc5cf',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        opacity: loading ? 0.7 : 1,
                                        marginTop: '0.5rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.background = '#4ab8c2';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.background = '#5bc5cf';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }
                                    }}
                                >
                                    {loading ? (modal === 'register' ? 'Creating Account...' : 'Signing in...') : (modal === 'register' ? 'Create Account' : 'Sign In')}
                                </button>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginTop: '1rem'
                                }}>
                                    <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                                    <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>OR</span>
                                    <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                                </div>

                                <p style={{
                                    textAlign: 'center',
                                    color: '#6b7280',
                                    fontSize: '0.95rem'
                                }}>
                                    {modal === 'register' ? (
                                        <>Already have an account? <button
                                            type="button"
                                            onClick={() => setModal('login')}
                                            style={{
                                                color: '#f97316',
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: 'inherit'
                                            }}
                                        >
                                            Sign In
                                        </button></>
                                    ) : (
                                        <>Don't have an account? <button
                                            type="button"
                                            onClick={() => setModal('register')}
                                            style={{
                                                color: '#5bc5cf',
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: 'inherit'
                                            }}
                                        >
                                            Create one
                                        </button></>
                                    )}
                                </p>
                            </form>
                        </div>

                        {/* Footer */}
                        <div style={{
                            background: '#f9fafb',
                            padding: '1rem',
                            textAlign: 'center',
                            borderTop: '1px solid #e5e7eb',
                            fontSize: '0.75rem',
                            color: '#9ca3af'
                        }}>
                            {modal === 'register' ? 'By signing up, you agree to our Terms of Service and Privacy Policy' : 'Secure login with encryption. Your data is protected.'}
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER SECTION */}
            <footer style={{
                backgroundColor: '#5bc5cf',
                color: 'white',
                padding: '4rem 1rem 2rem',
                borderTop: '2px solid white'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2rem'
                    }}>
                        {/* About Column */}
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>About</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li><a href="/about" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'opacity 0.2s', display: 'block', marginBottom: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>About Us</a></li>
                                <li><a href="/blog" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'opacity 0.2s', display: 'block', marginBottom: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>Blog</a></li>
                                <li><a href="/careers" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'opacity 0.2s', display: 'block', marginBottom: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>Careers</a></li>
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Support</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li><a href="/support" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'opacity 0.2s', display: 'block', marginBottom: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>Support</a></li>
                                <li><a href="/help" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'opacity 0.2s', display: 'block', marginBottom: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>Help Center</a></li>
                                <li><a href="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'opacity 0.2s', display: 'block', marginBottom: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>Contact Us</a></li>
                                <li><a href="/safety" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'opacity 0.2s', display: 'block', marginBottom: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>Safety Tips</a></li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Legal</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li><a href="/terms" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'opacity 0.2s', display: 'block', marginBottom: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>Terms</a></li>
                                <li><a href="/privacy" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'opacity 0.2s', display: 'block', marginBottom: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>Privacy</a></li>
                                <li><a href="/cookies" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'opacity 0.2s', display: 'block', marginBottom: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>Cookies</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div style={{
                        textAlign: 'center',
                        paddingTop: '2rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                        <p style={{ margin: 0 }}>© 2024 Banadama. All rights reserved. | Made with ❤️ for B2B Trade</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}