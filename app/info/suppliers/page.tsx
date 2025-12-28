// app/info/suppliers/page.tsx - Supplier Trust & Success Stories
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Icons } from "@/components/icons/icons";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";

export const metadata = {
    title: "Supplier Success & Verification | Banadama",
    description: "Learn how factories and wholesalers scale their business on Banadama. Read success stories and understand our verification process.",
};

export default function SupplierInfoPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* Simple Sub-Header */}
            <div className="bg-[#232F3E] text-white py-3 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Icons.Globe size={24} className="text-[#FF9900]" />
                        <span className="text-xl font-bold tracking-tight">banadama <span className="text-gray-400 font-medium text-sm">business</span></span>
                    </Link>
                    <Link href="/supplier">
                        <span className="text-sm font-bold hover:text-[#FF9900] cursor-pointer">Back to Seller Central</span>
                    </Link>
                </div>
            </div>

            {/* Title Section */}
            <section className="py-20 bg-gray-50 border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-[#131921] mb-6">
                        Building Global Trust, <br />One <span className="text-[#FF9900]">Verified</span> Shipment at a Time.
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        We don't just list suppliers; we partner with them. Discover the stories of factories and wholesalers who have transformed their trade via Banadama.
                    </p>
                </div>
            </section>

            {/* Success Stories Grid */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-black text-[#131921] mb-12 flex items-center gap-3">
                    <Icons.TrendingUp className="text-[#FF9900]" />
                    Featured Success Stories
                </h2>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Story 1 */}
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start group">
                        <div className="w-full md:w-1/2 aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden relative shadow-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800"
                                alt="Dhaka Textile Factory"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-[#131921] shadow-sm">
                                TEXTILES & APPAREL
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <h3 className="text-2xl font-black text-[#131921] mb-4">How "GreenThread Dhaka" Grew Exports by 300% in 12 Months</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Struggling with payment delays from international buyers, GreenThread joined Banadama in 2024. By utilizing our escrow and RFQ system, they now fulfill weekly orders for retail chains in Lagos.
                            </p>
                            <div className="flex items-center gap-2 text-[#FF9900] font-bold cursor-pointer hover:underline">
                                Read the full case study <Icons.ChevronRight size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Story 2 */}
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start group">
                        <div className="w-full md:w-1/2 aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden relative shadow-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
                                alt="Lagos Wholesaler Warehouse"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-[#131921] shadow-sm">
                                ELECTRONICS
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <h3 className="text-2xl font-black text-[#131921] mb-4">Eliminating Logistics Friction for "Lagos Tech Hub"</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                As a major electronics wholesaler, Lagos Tech Hub faced constant customs bottlenecks. Banadama's integrated logistics cleared their path, reducing delivery times from 14 days to 4 days across the region.
                            </p>
                            <div className="flex items-center gap-2 text-[#FF9900] font-bold cursor-pointer hover:underline">
                                Read the full case study <Icons.ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Verification Process Section */}
            <section className="py-24 bg-[#131921] text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">Our 4-Step <span className="text-[#FF9900]">Verification</span> Gold Standard</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Every supplier on Banadama undergoes a rigorous vetting process to ensure they meet our standards for quality and reliability.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                title: "KYB Check",
                                desc: "Verification of business registration, tax IDs, and ownership documentation.",
                                icon: Icons.Document
                            },
                            {
                                title: "Factory Audit",
                                desc: "Physical site visits by our local operations teams in Lagos or Dhaka to verify capacity.",
                                icon: Icons.Building
                            },
                            {
                                title: "Product Quality",
                                desc: "Testing and inspection of product samples to match listed specifications.",
                                icon: Icons.ShieldCheck
                            },
                            {
                                title: "Financial Vetting",
                                desc: "Clean financial record and history of fulfillment performance.",
                                icon: Icons.Wallet
                            }
                        ].map((step, i) => (
                            <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#FF9900]/50 transition-colors group">
                                <div className="w-12 h-12 rounded-xl bg-[#FF9900]/20 text-[#FF9900] flex items-center justify-center mb-6">
                                    <step.icon size={24} />
                                </div>
                                <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supplier Tiers */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-[#131921]">Supplier Tiers</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                        <CardBody className="p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6">
                                <Icons.Shield size={14} /> STANDARD
                            </div>
                            <h4 className="text-2xl font-black mb-4">Verified Supplier</h4>
                            <ul className="space-y-3 mb-8 text-gray-600 text-sm">
                                <li className="flex items-center gap-2 font-medium"><Icons.Check size={16} className="text-green-500" /> Basic KYB Verified</li>
                                <li className="flex items-center gap-2 font-medium"><Icons.Check size={16} className="text-green-500" /> Email & Phone Verified</li>
                                <li className="flex items-center gap-2 font-medium text-gray-400"><Icons.X size={16} className="text-gray-300" /> Site Audit</li>
                                <li className="flex items-center gap-2 font-medium text-gray-400"><Icons.X size={16} className="text-gray-300" /> Premium Badge</li>
                            </ul>
                            <div className="text-3xl font-black mb-6">FREE</div>
                            <Button variant="glass" className="w-full border-gray-200 font-bold">Register Now</Button>
                        </CardBody>
                    </Card>

                    <Card className="border-2 border-[#FF9900] shadow-xl relative scale-105 z-10 bg-white">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF9900] text-[#131921] px-4 py-1 rounded-full text-xs font-black">
                            MOST POPULAR
                        </div>
                        <CardBody className="p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-6">
                                <Icons.Star size={14} /> GOLD PARTNER
                            </div>
                            <h4 className="text-2xl font-black mb-4">Gold Supplier</h4>
                            <ul className="space-y-3 mb-8 text-gray-600 text-sm">
                                <li className="flex items-center gap-2 font-bold"><Icons.Check size={16} className="text-green-500" /> Full KYB Verification</li>
                                <li className="flex items-center gap-2 font-bold"><Icons.Check size={16} className="text-green-500" /> Remote Video Audit</li>
                                <li className="flex items-center gap-2 font-bold"><Icons.Check size={16} className="text-green-500" /> Verified Trust Badge</li>
                                <li className="flex items-center gap-2 font-bold"><Icons.Check size={16} className="text-green-500" /> Priority Support</li>
                            </ul>
                            <div className="text-3xl font-black mb-6">Coming Soon</div>
                            <Button className="w-full bg-[#FF9900] text-white font-black hover:bg-[#E68A00]">Join Waitlist</Button>
                        </CardBody>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                        <CardBody className="p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-6">
                                <Icons.Building size={14} /> FACTORY DIRECT
                            </div>
                            <h4 className="text-2xl font-black mb-4">Factory Verified</h4>
                            <ul className="space-y-3 mb-8 text-gray-600 text-sm">
                                <li className="flex items-center gap-2 font-bold"><Icons.Check size={16} className="text-green-500" /> Physical Site Audit</li>
                                <li className="flex items-center gap-2 font-bold"><Icons.Check size={16} className="text-green-500" /> Capacity Verification</li>
                                <li className="flex items-center gap-2 font-bold"><Icons.Check size={16} className="text-green-500" /> Quality Labs Testing</li>
                                <li className="flex items-center gap-2 font-bold"><Icons.Check size={16} className="text-green-500" /> Direct Export Support</li>
                            </ul>
                            <div className="text-3xl font-black mb-6">Custom</div>
                            <Button variant="glass" className="w-full border-gray-200 font-bold">Contact Sales</Button>
                        </CardBody>
                    </Card>
                </div>
            </section>

            {/* Final FAQ Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-black text-[#131921] mb-12 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "How long does verification take?", a: "Standard verification typically takes 24-48 hours. Physical site audits for Factory status can take 5-7 business days." },
                            { q: "Do I need an export license?", a: "Not necessarily. Banadama's integrated logistics partners can handle export formalities for you in many cases." },
                            { q: "How do I get paid?", a: "Payments are received in local currency (NGN/BDT) or USD depending on your account setup, immediately after the buyer confirms receipt via our secure escrow." },
                        ].map((faq, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                                <h4 className="font-bold text-[#131921] mb-2">{faq.q}</h4>
                                <p className="text-gray-600 text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global CTA */}
            <section className="py-24 bg-[#FF9900]">
                <div className="max-w-7xl mx-auto px-4 text-center text-[#131921]">
                    <h3 className="text-4xl md:text-5xl font-black mb-8">Ready to be the next success story?</h3>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/auth/register">
                            <Button className="bg-[#131921] text-white font-black px-12 py-8 text-xl rounded-2xl hover:bg-black transition-all">
                                Create Supplier Account
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
