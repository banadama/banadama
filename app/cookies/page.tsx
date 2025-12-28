'use client';

export default function CookiesPage() {
    return (
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh' }}>
            <header style={{ backgroundColor: '#2b3d2d', padding: '1rem 0', borderBottom: '2px solid white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Cookie Policy</h1>
                </div>
            </header>
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ color: '#2b3d2d', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Cookie Policy</h2>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '2rem' }}>Last updated: December 22, 2025</p>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                        Banadama uses cookies and similar tracking technologies to enhance your experience on our platform. This Cookie Policy explains what cookies are, how we use them, and how you can control them.
                    </p>
                    <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>What Are Cookies?</h3>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                        Cookies are small data files stored on your device that help websites remember your preferences and improve functionality.
                    </p>
                    <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>How We Use Cookies</h3>
                    <ul style={{ color: '#333', lineHeight: '2', marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
                        <li>To remember your login information</li>
                        <li>To track site performance and analytics</li>
                        <li>To personalize your experience</li>
                        <li>To prevent fraud and maintain security</li>
                    </ul>
                    <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>Your Cookie Choices</h3>
                    <p style={{ color: '#333', lineHeight: '1.8' }}>
                        You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <a href="/marketplace" style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}>Back to Marketplace</a>
                    </div>
                </div>
            </main>
        </div>
    );
}
