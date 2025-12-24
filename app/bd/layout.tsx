// app/bd/layout.tsx - Bangladesh Portal Layout
import { ReactNode } from 'react';

export const metadata = {
    title: 'Banadama Bangladesh | বাণ্ড্যামা বাংলাদেশ',
    description: 'Bangladesh-specific marketplace and services portal',
};

export default function BangladeshLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bd-portal">
            {children}
        </div>
    );
}
