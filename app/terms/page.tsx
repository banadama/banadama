import { Icons } from "@/components/icons/icons";

export default function TermsPage() {
    const ShieldIcon = Icons.get("Shield");
    const FileIcon = Icons.get("Document");

    return (
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh' }}>
            <header style={{ backgroundColor: '#2b3d2d', padding: '1rem 0', borderBottom: '2px solid white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Terms of Service</h1>
                </div>
            </header>
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ color: '#2b3d2d', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Terms of Service</h2>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '2rem' }}>Last updated: December 22, 2025</p>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1rem' }}>
                        Welcome to Banadama. These Terms of Service govern your access to and use of the Banadama platform, including our website, mobile applications, and related services.
                    </p>
                    <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h3>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1rem' }}>
                        By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
                    </p>
                    <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>2. Account Registration</h3>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1rem' }}>
                        You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account.
                    </p>
                    <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>3. Escrow Protection</h3>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1rem' }}>
                        All transactions on Banadama are protected by our escrow system. Funds are held securely until delivery is confirmed and both parties are satisfied.
                    </p>
                    <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>4. User Conduct</h3>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '1rem' }}>
                        You agree not to engage in any conduct that is unlawful, fraudulent, or that violates the rights of others or these Terms.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <a href="/marketplace" style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}>Back to Marketplace</a>
                    </div>
                </div>
            </main>
        </div>
    );
}
