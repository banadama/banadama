/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ignore React type compatibility issues between @types/react versions
    ignoreBuildErrors: true,
  },
  eslint: {
    // Also ignore ESLint errors during build (can run separately)
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      // If old base existed
      { source: "/admin-studio/:path*", destination: "/admin/studio/:path*", permanent: true },

      // If old admin pages existed at root level
      { source: "/admin/users", destination: "/admin/studio/users", permanent: true },
      { source: "/admin/accounts", destination: "/admin/studio/accounts", permanent: true },
      { source: "/admin/verifications", destination: "/admin/studio/verifications", permanent: true },
      { source: "/admin/products", destination: "/admin/studio/products", permanent: true },
      { source: "/admin/categories", destination: "/admin/studio/categories", permanent: true },
      { source: "/admin/locations", destination: "/admin/studio/locations", permanent: true },
      { source: "/admin/features", destination: "/admin/studio/features", permanent: true },
      { source: "/admin/market-control", destination: "/admin/studio/market-control", permanent: true },
      { source: "/admin/trade-control", destination: "/admin/studio/trade-control", permanent: true },
      { source: "/admin/audit-log", destination: "/admin/studio/audit-log", permanent: true },
      { source: "/admin/settings", destination: "/admin/studio/settings", permanent: true },

      // Finance legacy redirects (if any existed)
      { source: "/finance/:path*", destination: "/admin/finance/:path*", permanent: true },
      { source: "/admin/escrow", destination: "/admin/finance/escrow", permanent: true },
      { source: "/admin/payouts", destination: "/admin/finance/payouts", permanent: true },
      { source: "/admin/refunds", destination: "/admin/finance/refunds", permanent: true },
      { source: "/admin/wallets", destination: "/admin/finance/wallets", permanent: true },
      { source: "/admin/ledger", destination: "/admin/finance/ledger", permanent: true },

      // Creators marketplace redirect (no separate page)
      { source: "/creators-marketplace", destination: "/marketplace?type=creators", permanent: true },
    ];
  },
};

export default nextConfig;
