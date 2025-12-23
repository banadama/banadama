"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const LOCAL_COUNTRIES = ["NG", "BD"];

export function Navbar() {
    const [isLocalMode, setIsLocalMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        detectCountry();
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error("Failed to check auth:", error);
        }
    };

    const detectCountry = async () => {
        try {
            const res = await fetch("https://ipapi.co/json/");
            const data = await res.json();
            const country = data.country_code || "US";
            setIsLocalMode(LOCAL_COUNTRIES.includes(country));
        } catch {
            setIsLocalMode(false);
        }
    };

    return (
        <nav className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-50">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-lg font-semibold text-slate-50 hover:text-emerald-400 transition-colors"
                >
                    Banadama
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden items-center gap-4 text-sm md:flex">
                    <Link
                        href="/marketplace"
                        className="text-slate-300 hover:text-slate-50 transition-colors"
                    >
                        Marketplace
                    </Link>
                    {isLocalMode && (
                        <Link
                            href="/near-me"
                            className="text-slate-300 hover:text-slate-50 transition-colors"
                        >
                            Near Me
                        </Link>
                    )}
                    <Link
                        href="/global"
                        className="text-slate-300 hover:text-slate-50 transition-colors"
                    >
                        Global Market
                    </Link>
                    <Link
                        href="/creators"
                        className="text-slate-300 hover:text-slate-50 transition-colors"
                    >
                        Creators
                    </Link>

                    {/* Auth Buttons */}
                    {user ? (
                        <>
                            <Link
                                href={user.dashboard || "/"}
                                className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-100 hover:border-slate-500 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => window.location.href = "/auth/logout"}
                                className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-100 hover:border-slate-500 transition-colors"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/languages"
                                className="rounded-lg bg-emerald-500 px-3 py-1.5 font-medium text-slate-950 hover:bg-emerald-400 transition-colors"
                            >
                                Get started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-slate-300 hover:text-slate-50 transition-colors"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {mobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm">
                    <div className="flex flex-col gap-2 px-4 py-4">
                        <Link
                            href="/marketplace"
                            className="text-slate-300 hover:text-slate-50 transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Marketplace
                        </Link>
                        {isLocalMode && (
                            <Link
                                href="/near-me"
                                className="text-slate-300 hover:text-slate-50 transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Near Me
                            </Link>
                        )}
                        <Link
                            href="/global"
                            className="text-slate-300 hover:text-slate-50 transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Global Market
                        </Link>
                        <Link
                            href="/creators"
                            className="text-slate-300 hover:text-slate-50 transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Creators
                        </Link>
                        <div className="flex gap-2 pt-2 border-t border-slate-800 mt-2">
                            {user ? (
                                <>
                                    <Link
                                        href={user.dashboard || "/"}
                                        className="flex-1 text-center rounded-lg border border-slate-700 px-3 py-2 text-slate-100 hover:border-slate-500 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => window.location.href = "/auth/logout"}
                                        className="flex-1 text-center rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 font-medium text-red-400"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="flex-1 text-center rounded-lg border border-slate-700 px-3 py-2 text-slate-100 hover:border-slate-500 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href="/languages"
                                        className="flex-1 text-center rounded-lg bg-emerald-500 px-3 py-2 font-medium text-slate-950 hover:bg-emerald-400 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
