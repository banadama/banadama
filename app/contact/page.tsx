'use client';

export default function ContactPage() {
    return (
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh' }}>
            <header style={{ backgroundColor: '#2b3d2d', padding: '1rem 0', borderBottom: '2px solid white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Contact Us</h1>
                </div>
            </header>
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ color: '#2b3d2d', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Get in Touch</h2>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '2rem' }}>
                        Have questions or feedback? We'd love to hear from you. Reach out to us using any of the methods below.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '0.375rem' }}>
                            <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>Email</h3>
                            <p style={{ color: '#666', margin: 0 }}>support@banadama.com</p>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '0.375rem' }}>
                            <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>Phone</h3>
                            <p style={{ color: '#666', margin: 0 }}>(+234) 701-234-5678</p>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '0.375rem' }}>
                            <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>Hours</h3>
                            <p style={{ color: '#666', margin: 0 }}>Mon - Fri: 9 AM - 6 PM</p>
                        </div>
                    </div>
                    <div style={{ marginTop: '2rem' }}>
                        <a href="/marketplace" style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}>Back to Marketplace</a>
                    </div>
                </div>
            </main>
        </div>
    );
}
