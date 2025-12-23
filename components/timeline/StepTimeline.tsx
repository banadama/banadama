// components/timeline/StepTimeline.tsx
import { Card, CardBody } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function StepTimeline({
    steps,
    current,
}: {
    steps: { label: string; description?: string }[];
    current: number; // 0-based index
}) {
    return (
        <Card>
            <CardBody className="bd-grid" style={{ gap: 16 }}>
                <div className="bd-h2">Progress</div>
                <div className="bd-grid" style={{ gap: 12 }}>
                    {steps.map((s, i) => {
                        const isComplete = i < current;
                        const isCurrent = i === current;
                        const isPending = i > current;

                        return (
                            <div
                                key={s.label}
                                style={{
                                    display: "flex",
                                    gap: 12,
                                    opacity: isPending ? 0.5 : 1,
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        background: isComplete
                                            ? "hsl(var(--bd-success))"
                                            : isCurrent
                                                ? "hsl(var(--bd-brand-2))"
                                                : "hsl(var(--bd-muted))",
                                        color: isComplete || isCurrent ? "white" : "hsl(var(--bd-fg))",
                                        flexShrink: 0,
                                    }}
                                >
                                    {isComplete ? "✓" : i + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        {s.label}
                                        {isCurrent && (
                                            <Badge variant="warning" style={{ fontSize: 10 }}>
                                                Current
                                            </Badge>
                                        )}
                                    </div>
                                    {s.description && (
                                        <div className="bd-small" style={{ marginTop: 2 }}>
                                            {s.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardBody>
        </Card>
    );
}
