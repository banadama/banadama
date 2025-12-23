import React from "react";
import "../globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-slate-950 text-slate-100">
                <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
