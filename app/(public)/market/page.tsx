// src/app/(public)/market/page.tsx
import Link from "next/link";

export default function PublicMarketPage() {
  return (
    <main className="min-h-screen p-6 bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Banadama Market (Public)</h1>
          <p className="text-xs text-slate-400">
            Public view of B2C / B2B / Creator products.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <Link href="/auth/login" className="hover:text-sky-400">
            Login
          </Link>
          <Link href="/auth/register" className="hover:text-sky-400">
            Register
          </Link>
        </div>
      </header>
      <p className="text-sm text-slate-400">
        Placeholder: here we will show basic products for visitors. After login,
        they get full dashboard experience.
      </p>
    </main>
  );
}
