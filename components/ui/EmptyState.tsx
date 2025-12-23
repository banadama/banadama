// components/ui/EmptyState.tsx
import * as React from "react";
import { Card, CardBody } from "./Card";
import { Button } from "./Button";

export function EmptyState({
    icon = "📭",
    title,
    description,
    actionLabel,
    onAction,
}: {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <Card>
            <CardBody
                className="bd-grid"
                style={{ gap: 12, textAlign: "center", padding: "48px 24px" }}
            >
                <div style={{ fontSize: 48 }}>{icon}</div>
                <div className="bd-h2">{title}</div>
                {description && <p className="bd-p">{description}</p>}
                {actionLabel && onAction && (
                    <div style={{ marginTop: 8 }}>
                        <Button variant="primary" onClick={onAction}>
                            {actionLabel}
                        </Button>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
