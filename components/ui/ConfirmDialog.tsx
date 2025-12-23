// components/ui/ConfirmDialog.tsx
"use client";
import * as React from "react";
import { Card, CardBody } from "./Card";
import { Button } from "./Button";

export function ConfirmDialog({
    open,
    title,
    description,
    confirmText = "Confirm",
    confirmVariant = "primary",
    onConfirm,
    onClose,
    loading = false,
}: {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    confirmVariant?: "primary" | "danger";
    onConfirm: () => void;
    onClose: () => void;
    loading?: boolean;
}) {
    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.35)",
                display: "grid",
                placeItems: "center",
                padding: 16,
                zIndex: 50,
            }}
            onClick={onClose}
        >
            <Card style={{ maxWidth: 520, width: "100%" }} onClick={(e) => e.stopPropagation()}>
                <CardBody className="bd-grid" style={{ gap: 12 }}>
                    <div className="bd-h2">{title}</div>
                    {description && <p className="bd-p">{description}</p>}
                    <div className="bd-row" style={{ justifyContent: "flex-end", marginTop: 8 }}>
                        <Button onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
                            {loading ? "Loading..." : confirmText}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
