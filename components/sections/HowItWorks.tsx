// components/sections/HowItWorks.tsx
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
        <section className="bd-container" style={{ padding: "0 16px 40px" }}>
            <div className="bd-grid" style={{ gap: 24 }}>
                <div className="bd-h2" style={{ textAlign: "center" }}>
                    How It Works
                </div>
                <div
                    className="bd-grid"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: 16,
                    }}
                >
                    {steps.map((s) => (
                        <Card key={s.step}>
                            <CardBody className="bd-grid" style={{ gap: 12 }}>
                                <div className="bd-row">
                                    <Badge
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            justifyContent: "center",
                                            background: "hsl(var(--bd-brand))",
                                            color: "white",
                                            border: "none",
                                        }}
                                    >
                                        {s.step}
                                    </Badge>
                                    <div style={{ fontWeight: 800 }}>{s.title}</div>
                                </div>
                                <div className="bd-p">{s.desc}</div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
