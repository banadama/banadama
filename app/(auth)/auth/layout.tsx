// src/app/(public)/auth/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
            <div className="w-full max-w-md border border-slate-800 rounded-xl p-6 bg-slate-900/60">
                {children}
            </div>
        </main>
    );
}
