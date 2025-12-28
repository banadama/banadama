// components/sections/WhyBanadama.tsx - VERSION 2 (LIQUID GLASS)
import { Card, CardBody } from "../ui/Card";
import { Icons } from "../icons/icons";

const items = [
    {
        icon: <Icons.Lock size={32} />,
        title: "Escrow Protection",
        desc: "Funds release only after delivery confirmation. Your money stays safe.",
    },
    {
        icon: <Icons.ShieldCheck size={32} />,
        title: "Verified Suppliers",
        desc: "All sellers go through verification before listing. Blue & green ticks.",
    },
    {
        icon: <Icons.Users size={32} />,
        title: "Ops-Mediated Trade",
        desc: "Quotes, orders, and fulfillment handled cleanly by our Ops team.",
    },
    {
        icon: <Icons.Globe size={32} />,
        title: "Local + Global Modes",
        desc: "Buy Near Me (NG/BD) + Global Market (buy-only) in one platform.",
    },
];

export function WhyBanadama() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    Why Choose Banadama?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((it) => (
                        <Card key={it.title} hoverable className="h-full border-white/5 bg-white/[0.02]">
                            <CardBody className="flex flex-col gap-4">
                                <div className="text-orange-500 opacity-80">{it.icon}</div>
                                <h3 className="text-xl font-bold text-white tracking-tight">{it.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{it.desc}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

