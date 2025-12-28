import { Icons } from "@/components/icons/icons";

export default function PrivacyPage() {
    const ShieldCheckIcon = Icons.get("ShieldCheck");
    const LockIcon = Icons.get("Lock");

    return (
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh' }}>
            <header style={{ backgroundColor: '#2b3d2d', padding: '1rem 0', borderBottom: '2px solid white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Privacy Policy</h1>
                </div>
            </header>
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ color: '#2b3d2d', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Our Commitment to Your Privacy</h2>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1rem' }}>
                        At Banadama, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                    </p>
                    <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>Information We Collect</h3>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1rem' }}>
                        We collect information you provide to us, such as your name, email, address, and transaction details. We also collect information automatically when you use our platform, including IP addresses, device information, and usage patterns.
                    </p>
                    <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>How We Use Your Information</h3>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1rem' }}>
                        We use your information to provide and improve our services, process transactions, communicate with you, and protect against fraud and misuse.
                    </p>
                    <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>Data Protection</h3>
                    <p style={{ color: '#333', lineHeight: '1.8' }}>
                        We implement industry-standard security measures to protect your data from unauthorized access, alteration, and destruction.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <a href="/marketplace" style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}>Back to Marketplace</a>
                    </div>
                </div>
            </main>
        </div>
    );
}
