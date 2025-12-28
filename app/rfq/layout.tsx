// app/rfq/layout.tsx - Premium Dashboard Layout for RFQs
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function RfqLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
            {/* Left Sidebar - Shared Marketplace Style */}
            <aside className="w-72 bg-[#1E293B] text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50 shadow-2xl">
                <div className="p-8 pb-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Icons.Globe size={24} className="text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">banadama</span>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 mb-4">Navigation</div>

                    <Link href="/marketplace" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl transition-all group">
                        <Icons.Grid size={20} className="group-hover:text-orange-400" />
                        Marketplace
                    </Link>

                    <Link href="/rfq" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl transition-all group data-[active=true]:bg-orange-500/10 data-[active=true]:text-orange-500 data-[active=true]:font-bold data-[active=true]:border data-[active=true]:border-orange-500/20">
                        <Icons.RFQ size={20} className="group-hover:text-orange-400" />
                        My RFQs
                    </Link>

                    <Link href="/buyer/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl transition-all group">
                        <Icons.Package size={20} className="group-hover:text-orange-400" />
                        Orders
                    </Link>

                    <div className="pt-8 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4">Insights</div>

                    <Link href="/rfq/guide" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl transition-all group">
                        <Icons.HelpCircle size={20} className="group-hover:text-orange-400" />
                        Buyer Guide
                    </Link>
                </nav>

                <div className="p-6 border-t border-white/5">
                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 text-center">
                        <p className="text-[10px] text-slate-400 mb-3 uppercase font-black tracking-widest">Need Support?</p>
                        <Button variant="glass" className="w-full text-[10px] font-black border-slate-700 text-white">TALK TO OPS</Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-72 flex flex-col">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Buyer Portal</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-slate-900 font-black text-xs uppercase tracking-widest">Sourcing Hub</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-400 hover:text-orange-500 transition-colors">
                            <Icons.Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all cursor-pointer">
                            <img src="https://ui-avatars.com/api/?name=Guest+Buyer&background=f1f5f9&color=64748b" alt="User" />
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
