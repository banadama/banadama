// app/(regional)/layout.tsx
import React from 'react';

export const dynamic = 'force-dynamic';

export default function RegionalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white">
            {children}
        </div>
    );
}
