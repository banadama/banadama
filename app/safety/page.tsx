'use client';

export default function SafetyPage() {
    return (
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh' }}>
            <header style={{ backgroundColor: '#2b3d2d', padding: '1rem 0', borderBottom: '2px solid white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Safety Tips</h1>
                </div>
            </header>
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ color: '#2b3d2d', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Stay Safe on Banadama</h2>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '2rem' }}>
                        Your safety and security are our top priorities. Here are essential tips to protect yourself while trading on Banadama.
                    </p>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ paddingLeft: '1rem', borderLeft: '4px solid #5bc5cf' }}>
                            <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>1. Use Escrow Protection</h3>
                            <p style={{ color: '#666', margin: 0 }}>Always use our escrow system for transactions. Never send money outside the platform.</p>
                        </div>
                        <div style={{ paddingLeft: '1rem', borderLeft: '4px solid #5bc5cf' }}>
                            <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>2. Verify Suppliers</h3>
                            <p style={{ color: '#666', margin: 0 }}>Check supplier credentials, ratings, and reviews before making a purchase.</p>
                        </div>
                        <div style={{ paddingLeft: '1rem', borderLeft: '4px solid #5bc5cf' }}>
                            <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>3. Communicate on Platform</h3>
                            <p style={{ color: '#666', margin: 0 }}>Keep all communications on Banadama for transparency and dispute resolution.</p>
                        </div>
                        <div style={{ paddingLeft: '1rem', borderLeft: '4px solid #5bc5cf' }}>
                            <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>4. Protect Your Account</h3>
                            <p style={{ color: '#666', margin: 0 }}>Use strong passwords and never share your login credentials with anyone.</p>
                        </div>
                        <div style={{ paddingLeft: '1rem', borderLeft: '4px solid #5bc5cf' }}>
                            <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>5. Report Suspicious Activity</h3>
                            <p style={{ color: '#666', margin: 0 }}>If you encounter fraud or suspicious behavior, report it immediately to our support team.</p>
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
