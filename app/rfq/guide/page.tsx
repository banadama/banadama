// app/rfq/guide/page.tsx - Premium RFQ Guide
import { Icons } from "@/components/icons/icons";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function RFQGuidePage() {
    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-16 pb-32">
            {/* Hero Section */}
            <div className="relative rounded-[3rem] bg-[#1E293B] p-12 md:p-20 overflow-hidden text-center shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -ml-32 -mb-32" />

                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-orange-500 shadow-inner backdrop-blur-sm border border-white/10">
                        <Icons.RFQ size={40} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Mastering the <br /><span className="text-orange-500">RFQ Process.</span></h1>
                    <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto">Learn how to get custom quotes for bulk orders and special requirements with Banadama.</p>
                </div>
            </div>

            {/* Core Concept */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight uppercase">What is an RFQ?</h2>
                    <p className="text-slate-600 font-medium leading-relaxed mb-6">
                        Request for Quotation (RFQ) is a specialized procurement process where you request customized pricing from suppliers for specific quantities, specifications, or delivery terms.
                    </p>
                    <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl italic text-sm text-slate-700 font-medium quote">
                        "Unlike fixed-price listings, RFQ allows you to negotiate based on your unique business requirements."
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <div className="text-2xl font-black text-orange-500 mb-1">98%</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <div className="text-2xl font-black text-emerald-500 mb-1">12h</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Response</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <div className="text-2xl font-black text-slate-900 mb-1">50+</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Factory Types</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <div className="text-2xl font-black text-slate-900 mb-1">Zero</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upfront Fees</div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">The Sourcing Journey</h2>
                    <p className="text-slate-500 font-medium">A structured workflow designed for transparency and reliability.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
                    {[
                        { step: "01", title: "Submit", desc: "Define your requirements, quantity, and delivery region.", icon: "Plus" },
                        { step: "02", title: "Review", desc: "Banadama Ops verifies and invites qualified suppliers.", icon: "ShieldCheck" },
                        { step: "03", title: "Quote", desc: "Suppliers bid and you compare offers in real-time.", icon: "TrendingUp" }
                    ].map((s, i) => (
                        <div key={i} className="relative z-10 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center group hover:border-orange-500 transition-all">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors shadow-lg shadow-black/10">
                                <span className="text-xs font-black">{s.step}</span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">{s.title}</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comparison */}
            <Card className="border-none shadow-premium bg-slate-50 rounded-[2.5rem] overflow-hidden">
                <CardBody className="p-10 md:p-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h4 className="text-lg font-black text-orange-500 uppercase tracking-widest mb-6 border-b border-orange-500/20 pb-4">Use RFQ When</h4>
                            <ul className="space-y-4">
                                {[
                                    "Ordering bulk quantities for business",
                                    "Need custom branding or packaging",
                                    "Special delivery or logistics terms",
                                    "Comparing multiple factory offers"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                        <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                                            <Icons.Check size={12} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-emerald-600 uppercase tracking-widest mb-6 border-b border-emerald-500/20 pb-4">Use Buy Now When</h4>
                            <ul className="space-y-4">
                                {[
                                    "Ordering small to mid-size batches",
                                    "Standard product specs are fine",
                                    "Need immediate fulfillment",
                                    "Prices are already optimized"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                            <Icons.Check size={12} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Bottom CTA */}
            <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Ready to Source?</h3>
                <p className="text-slate-500 font-medium mb-10">Our global network of verified suppliers is waiting for your request.</p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link href="/rfq/new">
                        <Button className="bg-orange-500 text-white font-black px-10 py-6 rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 uppercase tracking-widest text-xs">POST NEW RFQ</Button>
                    </Link>
                    <Link href="/marketplace">
                        <Button variant="glass" className="rounded-2xl border-slate-200 font-black px-10 py-6 uppercase tracking-widest text-xs text-slate-600">BROWSE STORE</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
