// app/rfq/page.tsx - Premium RFQ Dashboard
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { listRfqs } from "@/lib/rfqApi";

export const metadata = {
    title: "My Sourcing Requests | Banadama",
    description: "Manage your requests for quotes and connect with verified global suppliers.",
};

export default async function RfqDashboard() {
    let requests = [];
    try {
        const res = await listRfqs();
        requests = res?.items ?? res ?? [];
    } catch {
        // Fallback to mock if API fails or for new users
        requests = [];
    }

    return (
        <div className="flex flex-col gap-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-premium bg-white">
                    <CardBody className="p-6">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Requests</div>
                        <div className="text-3xl font-black text-slate-900">{requests.length}</div>
                        <div className="mt-2 text-[10px] text-emerald-600 font-bold">Live Sourcing</div>
                    </CardBody>
                </Card>
                <Card className="border-none shadow-premium bg-white">
                    <CardBody className="p-6">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Quotes Received</div>
                        <div className="text-3xl font-black text-slate-900">
                            {requests.reduce((acc: number, curr: any) => acc + (curr.quotes || 0), 0)}
                        </div>
                        <div className="mt-2 text-[10px] text-orange-500 font-bold">Updated real-time</div>
                    </CardBody>
                </Card>
                <Card className="border-none shadow-premium bg-[#1E293B] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl -mr-16 -mt-16" />
                    <CardBody className="p-6 relative z-10">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Banadama status</div>
                        <div className="text-3xl font-black text-orange-500 tracking-tight">Verified Buyer</div>
                        <div className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Sourcing ID: #BDA-2025</div>
                    </CardBody>
                </Card>
            </div>

            {/* Main RFQ Actions */}
            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-premium border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[120px] -mr-48 -mt-48" />

                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">Can't find the exact product? <br /><span className="text-orange-500">Post a global request.</span></h2>
                        <p className="text-slate-600 mb-8 font-medium text-lg leading-relaxed">Connect with verified factories and wholesalers globally. Our operations team in Nigeria and Bangladesh will facilitate your request directly.</p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/rfq/new">
                                <Button className="bg-orange-500 text-white font-black px-12 py-8 rounded-2xl shadow-2xl shadow-orange-500/20 hover:bg-orange-600 transition-all text-sm uppercase tracking-widest active:scale-95 group">
                                    POST NEW RFQ <Icons.ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full max-w-sm">
                        <div className="bg-slate-50/50 backdrop-blur-sm rounded-[2.5rem] p-10 border border-slate-100 text-center shadow-inner">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-orange-500 mb-8 mx-auto">
                                <Icons.ShieldCheck size={40} />
                            </div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Guaranteed Sourcing</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">Every request is manually reviewed by our ops team to ensure quality and supplier reliability.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RFQ List Section */}
            <div className="flex flex-col gap-8 pb-20">
                <div className="flex items-center justify-between px-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Sourcing Feed</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Real-time Status Updates</p>
                        </div>
                    </div>
                    <Button variant="glass" className="rounded-xl border-slate-200 text-slate-500 font-black text-[10px] py-3 uppercase tracking-widest">
                        Filter Feed
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {requests.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-8 mx-auto shadow-inner">
                                <Icons.RFQ size={48} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">No sourcing requests yet.</h3>
                            <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto leading-relaxed">Banadama connects you to the world. Start by posting what you need and our network of verified suppliers will bid for your order.</p>
                            <Link href="/rfq/new">
                                <Button className="rounded-2xl bg-slate-900 text-white font-black px-12 py-6 shadow-xl hover:bg-black uppercase tracking-widest text-xs">CREATE YOUR FIRST RFQ</Button>
                            </Link>
                        </div>
                    ) : (
                        requests.map((r: any, i: number) => (
                            <Link href={`/rfq/${r.id}`} key={i}>
                                <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-8 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center gap-8 w-full lg:w-auto">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center transition-all group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/20">
                                            <Icons.RFQ size={28} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">{r.id}</span>
                                                {r.urgency === "High" && <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">Urgent</span>}
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-500 transition-colors tracking-tight uppercase">{r.title}</h3>
                                            <div className="flex items-center gap-4 mt-2">
                                                <Badge variant="glass" className="bg-slate-50 text-slate-500 border-none rounded-lg text-[10px] font-black uppercase tracking-wider">{r.category}</Badge>
                                                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12 w-full lg:w-auto justify-between lg:justify-end">
                                        <div className="text-center">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60">Supplier Bids</div>
                                            <div className="text-2xl font-black text-slate-900">{r.quotes || 0}</div>
                                        </div>

                                        <div className="text-center min-w-[120px]">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-60">Status</div>
                                            <Badge variant={r.status === "ACTIVE" || r.status === "PENDING" ? "success" : "glass"} className="w-full rounded-xl font-black uppercase text-[10px] py-2 shadow-sm">
                                                {r.status}
                                            </Badge>
                                        </div>

                                        <div className="hidden lg:flex w-12 h-12 rounded-full bg-slate-50 items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
                                            <Icons.ChevronRight size={24} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
