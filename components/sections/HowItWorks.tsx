// components/sections/HowItWorks.tsx - VERSION 2 (LIQUID GLASS)
import { Card, CardBody } from "../ui/Card";
import { Badge } from "../ui/Badge";

const steps = [
    {
        step: 1,
        title: "Browse or Submit RFQ",
        desc: "Explore products from verified suppliers or submit a custom Request for Quote.",
    },
    {
        step: 2,
        title: "Place Order",
        desc: "Choose Buy Now (Card) or Request Quote (RFQ) based on your needs.",
    },
    {
        step: 3,
        title: "Pay Into Escrow",
        desc: "Funds are held securely until delivery confirmation. Never at risk.",
    },
    {
        step: 4,
        title: "Receive & Confirm",
        desc: "Confirm delivery and supplier gets paid automatically. Simple.",
    },
];

export function HowItWorks() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    How It Works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((s) => (
                        <Card key={s.step} className="border-white/5 bg-white/[0.01]">
                            <CardBody className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-black font-black shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                                        {s.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">{s.title}</h3>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

