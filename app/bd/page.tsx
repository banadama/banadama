// app/bd/page.tsx - Bangladesh Portal Landing Page
export const dynamic = 'force-dynamic';

export default function BangladeshPortalPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #0a0f1c 0%, #1a1f2e 100%)'
        }}>
            <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
            }}>
                🇧🇩 Banadama Bangladesh
            </h1>
            <h2 style={{
                fontSize: '2rem',
                color: '#94a3b8',
                marginBottom: '2rem'
            }}>
                বাণ্ড্যামা বাংলাদেশ
            </h2>
            <p style={{
                fontSize: '1.25rem',
                color: '#64748b',
                textAlign: 'center',
                maxWidth: '600px'
            }}>
                Bangladesh-specific marketplace for apparel manufacturing,
                textile sourcing, and B2B trade services.
            </p>
        </div>
    );
}
