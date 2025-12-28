import Link from 'next/link';

export const metadata = {
  title: 'Sell on Banadama — Supplier Onboarding',
  description: 'Start selling on Banadama. Join as Supplier, Factory, Wholesaler, Creator or Affiliate.',
};

export default function SupplierLanding() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', color: 'white' }}>
      <section style={{ background: 'linear-gradient(135deg,#153824 0%,#0e2017 100%)', padding: '4rem', borderRadius: 12, textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>Start Selling on Banadama</h1>
        <p style={{ color: '#cfeee6', marginBottom: 20 }}>Reach buyers in Nigeria, Bangladesh and internationally. Fast onboarding for suppliers, factories and wholesalers.</p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          <Link href="/supplier/onboarding" className="bd-btn" style={{ background: '#5bc5cf', color: '#042017', padding: '0.85rem 1.4rem', borderRadius: 8, fontWeight: 700 }}>Start Selling</Link>
          <Link href="/auth/register" className="bd-btn" style={{ border: '2px solid #5bc5cf', color: '#fff', padding: '0.85rem 1.4rem', borderRadius: 8 }}>Create Account</Link>
        </div>

        <div style={{ color: '#9ccfbe', fontSize: '0.95rem' }}>
          <strong>What you can do:</strong> Add products, choose logistics (local / international), service NG/BD/global buyers, and respond to RFQs.
        </div>
      </section>

      <section style={{ marginTop: 24, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
        <div style={{ background: '#0f1b16', padding: 18, borderRadius: 8 }}>
          <h3 style={{ color: '#5bc5cf', marginBottom: 8 }}>Sell Physical Products</h3>
          <p style={{ color: '#bcded3' }}>List items, set logistics (local/international), and manage inventory.</p>
        </div>
        <div style={{ background: '#0f1b16', padding: 18, borderRadius: 8 }}>
          <h3 style={{ color: '#5bc5cf', marginBottom: 8 }}>Offer Services & Creative Work</h3>
          <p style={{ color: '#bcded3' }}>Creators and service providers can list digital products or local services.</p>
        </div>
        <div style={{ background: '#0f1b16', padding: 18, borderRadius: 8 }}>
          <h3 style={{ color: '#5bc5cf', marginBottom: 8 }}>Join as...</h3>
          <ul style={{ color: '#bcded3' }}>
            <li>Supplier</li>
            <li>Factory</li>
            <li>Wholesaler</li>
            <li>Creator</li>
            <li>Affiliate</li>
          </ul>
        </div>
      </section>

      <section style={{ marginTop: 28, padding: 18, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
        <h3 style={{ color: '#fff' }}>How to Add Products</h3>
        <ol style={{ color: '#cfeee6' }}>
          <li>Complete your profile and select your role</li>
          <li>Add products with accurate specs and images</li>
          <li>Choose logistics: <strong>local</strong> or <strong>international</strong></li>
          <li>Set region visibility (NG, BD or Global)</li>
        </ol>
      </section>
    </div>
  );
}
