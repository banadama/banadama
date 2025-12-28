import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Banadama Supplier',
  description: 'Supplier onboarding and seller tools for Banadama',
};

export default function SupplierPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header style={{ backgroundColor: '#183728', padding: '1rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, color: '#fff' }}>Banadama • Supplier</div>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link href="/supplier" style={{ color: 'white' }}>Home</Link>
            <Link href="/supplier/onboarding" style={{ color: 'white' }}>Onboarding</Link>
            <Link href="/supplier/products" style={{ color: 'white' }}>Products</Link>
            <Link href="/auth/login" style={{ color: 'white' }}>Sign In</Link>
          </nav>
        </div>
      </header>

      <main style={{ padding: '2rem 1rem' }}>{children}</main>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '1.5rem 0', marginTop: 48 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem', color: '#9ca3af' }}>
          © 2025 Banadama — Supplier Studio
        </div>
      </footer>
    </>
  );
}
