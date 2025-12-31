import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'Banadama Supplier',
  description: 'Supplier dashboard, onboarding, and seller tools for Banadama',
};

/**
 * Unified Supplier Layout
 * 
 * Handles both:
 * 1. Public supplier pages (home, onboarding, info) - for non-authenticated users
 * 2. Supplier dashboard (authentication required) - redirected to /supplier/dashboard with role-based layout
 * 
 * This layout provides the basic structure and navigation for the supplier subdomain.
 * For authenticated dashboard users, the /app/supplier/dashboard/layout.tsx provides additional
 * role-specific navigation and sidebar.
 */
export default async function SupplierLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const isSupplier = user && ['FACTORY', 'WHOLESALER', 'RETAILER', 'CREATOR', 'AFFILIATE'].includes(user?.role || '');

  return (
    <>
      {/* Navigation Header - Shown on all supplier pages */}
      <header style={{ backgroundColor: '#183728', padding: '1rem 0', borderBottom: '1px solid #2d5a4a' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link href="/supplier" style={{ fontWeight: 800, color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>
            Banadama • Supplier
          </Link>

          {/* Main Navigation */}
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {/* Public Navigation */}
            {!user && (
              <>
                <Link href="/supplier" style={{ color: '#e0e7ff', textDecoration: 'none', fontSize: '0.95rem' }}>
                  About
                </Link>
                <Link href="/supplier/onboarding" style={{ color: '#e0e7ff', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Get Started
                </Link>
                <a href="/#pricing" style={{ color: '#e0e7ff', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Pricing
                </a>
                <Link href="/auth/login?redirect=/supplier/dashboard" style={{
                  backgroundColor: '#5bc5cf',
                  color: '#000',
                  padding: '0.5rem 1rem',
                  borderRadius: 4,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>
                  Sign In
                </Link>
              </>
            )}

            {/* Authenticated Navigation */}
            {isSupplier && (
              <>
                <Link href="/supplier/dashboard" style={{ color: '#5bc5cf', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                  Dashboard
                </Link>
                <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                <Link href="/supplier/profile" style={{ color: '#e0e7ff', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Profile
                </Link>
                <a href="/api/auth/logout" style={{ color: '#e0e7ff', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Logout
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ padding: isSupplier ? '0' : '2rem 1rem', minHeight: 'calc(100vh - 200px)' }}>
        {user ? (
          // For dashboard pages, let child layout (dashboard/layout.tsx) handle the layout
          children
        ) : (
          // For public pages, use a simple container
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {children}
          </div>
        )}
      </main>

      {/* Footer - Only shown for non-dashboard pages */}
      {!user && (
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '2rem 0', marginTop: '3rem', backgroundColor: '#0f1b16' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              {/* Column 1: Company */}
              <div>
                <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Banadama</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="/#about" style={{ color: '#9ca3af', textDecoration: 'none' }}>About</a>
                  </li>
                  <li>
                    <a href="/#contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a>
                  </li>
                </ul>
              </div>

              {/* Column 2: Suppliers */}
              <div>
                <h4 style={{ color: '#fff', marginBottom: '1rem' }}>For Suppliers</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="/supplier" style={{ color: '#9ca3af', textDecoration: 'none' }}>Supplier Home</a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="/supplier/onboarding" style={{ color: '#9ca3af', textDecoration: 'none' }}>Get Started</a>
                  </li>
                  <li>
                    <a href="/#pricing" style={{ color: '#9ca3af', textDecoration: 'none' }}>Pricing</a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Resources */}
              <div>
                <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Resources</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="/help" style={{ color: '#9ca3af', textDecoration: 'none' }}>Help Center</a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="/terms" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms</a>
                  </li>
                  <li>
                    <a href="/privacy" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy</a>
                  </li>
                </ul>
              </div>

              {/* Column 4: Support */}
              <div>
                <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Support</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="/support" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact Support</a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="/blog" style={{ color: '#9ca3af', textDecoration: 'none' }}>Blog</a>
                  </li>
                  <li>
                    <a href="/careers" style={{ color: '#9ca3af', textDecoration: 'none' }}>Careers</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Bottom */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#6b7280', margin: 0 }}>
                © 2025 Banadama Limited. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Twitter</a>
                <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>LinkedIn</a>
                <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Facebook</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
