export const dynamic = 'force-dynamic';

export default function NigeriaPage() {
    return (
        <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #065f46, #064e3b, #000000)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
            }}>
                🇳🇬 Banadama Nigeria
            </h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>
                Connecting Nigerian businesses with global opportunities and local logistics solutions.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '1000px',
                marginTop: '3rem'
            }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Local Logistics</h3>
                    <p style={{ opacity: 0.8 }}>Efficient nationwide delivery and warehousing in Lagos, Abuja, and Port Harcourt.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Import/Export</h3>
                    <p style={{ opacity: 0.8 }}>Simplified customs clearance and international trade financing for SMEs.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Marketplace</h3>
                    <p style={{ opacity: 0.8 }}>Direct access to the largest network of verified suppliers in West Africa.</p>
                </div>
            </div>
        </div>
    );
}
