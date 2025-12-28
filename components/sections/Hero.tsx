// components/sections/Hero.tsx - VERSION 2 (LIQUID GLASS + ORANGE GLOW)
import Link from "next/link";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Icons } from "../icons/icons";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-24 pb-20 px-4">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* Announcement Badge */}
                <div className="glass px-4 py-2 rounded-full mb-8 flex items-center gap-2 border-white/10 animate-fadeIn">
                    <Icons.Shield size={16} className="text-orange-500" />
                    <span className="text-sm font-medium tracking-tight text-slate-300">
                        Buy Now + RFQ Marketplace — Nigeria & Bangladesh
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent max-w-4xl">
                    Sourcing Safely Without <span className="text-orange-500">Boundaries</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
                    Escrow-backed trade with verified suppliers and ops-managed fulfillment.
                    The leading marketplace for Nigeria, Bangladesh, and the Global trade.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
                    <Link href="/auth/register">
                        <Button variant="primary" size="lg" className="min-w-[200px]">
                            Get Started Free
                        </Button>
                    </Link>
                    <Link href="/marketplace">
                        <Button variant="secondary" size="lg" className="min-w-[200px]">
                            Browse Marketplace
                        </Button>
                    </Link>
                </div>

                {/* Trust Row */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-80">
                    <div className="flex items-center gap-2 group">
                        <div className="p-2 glass rounded-lg group-hover:border-orange-500/50 transition-colors">
                            <Icons.Lock size={20} className="text-orange-500" />
                        </div>
                        <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">Escrow Protected</span>
                    </div>
                    <div className="flex items-center gap-2 group">
                        <div className="p-2 glass rounded-lg group-hover:border-orange-500/50 transition-colors">
                            <Icons.ShieldCheck size={20} className="text-orange-500" />
                        </div>
                        <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">Verified Sellers</span>
                    </div>
                    <div className="flex items-center gap-2 group">
                        <div className="p-2 glass rounded-lg group-hover:border-orange-500/50 transition-colors">
                            <Icons.Package size={20} className="text-orange-500" />
                        </div>
                        <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">Ops Managed</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

