'use client';

export default function SupportPage() {
    return (
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh' }}>
            <header style={{ backgroundColor: '#2b3d2d', padding: '1rem 0', borderBottom: '2px solid white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Support Center</h1>
                </div>
            </header>
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ color: '#2b3d2d', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>How Can We Help?</h2>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '2rem' }}>
                        We're here to help with any questions or issues you may have with your Banadama account.
                    </p>
                    <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>Get Support</h3>
                    <ul style={{ color: '#333', lineHeight: '2', marginLeft: '1.5rem', marginBottom: '2rem' }}>
                        <li><a href="/help" style={{ color: '#5bc5cf', textDecoration: 'none' }}>Help Center</a></li>
                        <li><a href="/contact" style={{ color: '#5bc5cf', textDecoration: 'none' }}>Contact Us</a></li>
                        <li><a href="/safety" style={{ color: '#5bc5cf', textDecoration: 'none' }}>Safety Tips</a></li>
                        <li>Email: support@banadama.com</li>
                    </ul>
                    <div style={{ marginTop: '2rem' }}>
                        <a href="/marketplace" style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}>Back to Marketplace</a>
                    </div>
                </div>
            </main>
        </div>
    );
}
