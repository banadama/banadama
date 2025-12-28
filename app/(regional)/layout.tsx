export const dynamic = 'force-dynamic';
import React from 'react';

export default function RegionalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white">
            {children}
        </div>
    );
}
