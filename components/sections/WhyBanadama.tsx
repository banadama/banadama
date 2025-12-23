// components/sections/WhyBanadama.tsx - NO EMOJIS
import { Card, CardBody } from "../ui/Card";
import { Icons } from "../icons/icons";

const items = [
    {
        icon: <Icons.Lock size={32} />,
        title: "Escrow Protection",
        desc: "Funds release only after delivery confirmation. Your money stays safe.",
    },
    {
        icon: <Icons.Shield size={32} />,
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
        <section className="bd-container" style={{ padding: "0 16px 40px" }}>
            <div className="bd-grid" style={{ gap: 24 }}>
                <div className="bd-h2" style={{ textAlign: "center" }}>
                    Why Banadama?
                </div>
                <div
                    className="bd-grid"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: 16,
                    }}
                >
                    {items.map((it) => (
                        <Card key={it.title}>
                            <CardBody className="bd-grid" style={{ gap: 12 }}>
                                <div style={{ opacity: 0.7 }}>{it.icon}</div>
                                <div style={{ fontWeight: 800, fontSize: 18 }}>{it.title}</div>
                                <div className="bd-p">{it.desc}</div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
