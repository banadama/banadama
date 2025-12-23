import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between md:px-6">
                <div>
                    <p className="font-medium text-slate-300">Banadama</p>
                    <p>Connecting buyers, factories, wholesalers & creators.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Link href="/legal/terms" className="hover:text-slate-200 transition-colors">
                        Terms
                    </Link>
                    <Link href="/legal/privacy" className="hover:text-slate-200 transition-colors">
                        Privacy
                    </Link>
                    <Link href="/support" className="hover:text-slate-200 transition-colors">
                        Support
                    </Link>
                </div>
                <p className="text-[11px]">
                    © {new Date().getFullYear()} Banadama. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
