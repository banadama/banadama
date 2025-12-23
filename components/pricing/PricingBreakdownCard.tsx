// components/pricing/PricingBreakdownCard.tsx
import { Card, CardBody } from "../ui/Card";

export function PricingBreakdownCard({
    items,
    totalLabel = "Total",
    total,
    currency = "₦",
}: {
    items: { label: string; amount: number; highlight?: boolean }[];
    totalLabel?: string;
    total: number;
    currency?: string;
}) {
    const formatMoney = (amount: number) => `${currency}${(amount / 100).toLocaleString()}`;

    return (
        <Card>
            <CardBody className="bd-grid" style={{ gap: 10 }}>
                <div className="bd-h2">Pricing Breakdown</div>
                <div className="bd-grid" style={{ gap: 8 }}>
                    {items.map((it) => (
                        <div
                            key={it.label}
                            className="bd-row"
                            style={{ justifyContent: "space-between" }}
                        >
                            <div style={{ opacity: it.highlight ? 1 : 0.8 }}>{it.label}</div>
                            <div
                                style={{
                                    fontWeight: it.highlight ? 900 : 700,
                                    color: it.highlight ? "hsl(var(--bd-brand))" : "inherit",
                                }}
                            >
                                {formatMoney(it.amount)}
                            </div>
                        </div>
                    ))}
                    <div className="bd-divider" />
                    <div className="bd-row" style={{ justifyContent: "space-between" }}>
                        <div style={{ fontWeight: 900, fontSize: 18 }}>{totalLabel}</div>
                        <div style={{ fontWeight: 900, fontSize: 18, color: "hsl(var(--bd-brand))" }}>
                            {formatMoney(total)}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
