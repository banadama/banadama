import { Icons } from "@/components/icons/icons";

export default function AboutPage() {
    const HeartIcon = Icons.get("Heart");
    const UsersIcon = Icons.get("Users");
    const GlobalIcon = Icons.get("Globe");
    const ShieldIcon = Icons.get("Shield");

    return (
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh', position: 'relative' }}>
            {/* Header */}
            <header style={{ backgroundColor: '#2b3d2d', padding: '1rem 0', borderBottom: '2px solid white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>About Banadama</h1>
                </div>
            </header>

            {/* Content */}
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
                    <h2 style={{ color: '#2b3d2d', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Our Mission</h2>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1rem' }}>
                        Banadama exists to make cross-border and local trade safe, transparent, and accessible for everyone. We believe that businesses—from small startups to large factories—deserve a platform where they can buy and sell with confidence, protected by escrow and supported by professional operations management.
                    </p>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
                    <h2 style={{ color: '#2b3d2d', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Our Story</h2>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1rem' }}>
                        Founded in 2025, Banadama was born from a simple observation: traditional B2B marketplaces often fail to protect buyers and sellers adequately. Payment fraud, delayed shipments, and quality issues plague cross-border trade, especially in emerging markets like Nigeria and Bangladesh.
                    </p>
                    <p style={{ color: '#333', lineHeight: '1.8' }}>
                        We set out to change that by building a platform with escrow protection at its core, combined with hands-on operations management to ensure every transaction is completed fairly.
                    </p>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ color: '#2b3d2d', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>What Makes Us Different</h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ borderLeft: '4px solid #5bc5cf', paddingLeft: '1rem' }}>
                            <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>Escrow Protection</h3>
                            <p style={{ color: '#333', margin: 0 }}>Every transaction is protected by our escrow system. Funds are only released after delivery confirmation.</p>
                        </div>
                        <div style={{ borderLeft: '4px solid #5bc5cf', paddingLeft: '1rem' }}>
                            <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>Ops-Managed Fulfillment</h3>
                            <p style={{ color: '#333', margin: 0 }}>Our operations team actively manages transactions, coordinating logistics and ensuring timely delivery.</p>
                        </div>
                        <div style={{ borderLeft: '4px solid #5bc5cf', paddingLeft: '1rem' }}>
                            <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>Local + Global</h3>
                            <p style={{ color: '#333', margin: 0 }}>Buy locally in Nigeria or Bangladesh or access global products with simplicity.</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <a href="/marketplace" style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}>Back to Marketplace</a>
                </div>
            </main>

            {/* FOOTER SECTION */}
            <footer style={{
                backgroundColor: '#001a4d',
                color: 'white',
                padding: '4rem 1rem 2rem',
                borderTop: '2px solid white',
                marginTop: '4rem'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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

                        {/* Follow Us Column */}
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Follow Us</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1rem' }}>
                                <li>
                                    <a href="https://twitter.com/banadama" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem', transition: 'opacity 0.2s', display: 'inline-block' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://linkedin.com/company/banadama" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem', transition: 'opacity 0.2s', display: 'inline-block' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" fill="currentColor"/>
                                            <circle cx="4" cy="4" r="2" fill="currentColor"/>
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://instagram.com/banadama" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem', transition: 'opacity 0.2s', display: 'inline-block' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="currentColor"/>
                                            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div style={{
                        textAlign: 'center',
                        paddingTop: '2rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                        <p style={{ margin: 0 }}>© 2025 Banadama. All rights reserved. Secure trading platform for Nigeria, Bangladesh & Global markets.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
