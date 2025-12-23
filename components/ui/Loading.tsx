// components/ui/Loading.tsx
import * as React from "react";

export function Loading({
    size = "md",
    text
}: {
    size?: "sm" | "md" | "lg";
    text?: string;
}) {
    const sizeMap = {
        sm: 24,
        md: 40,
        lg: 64,
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: 24,
            }}
        >
            <div
                style={{
                    width: sizeMap[size],
                    height: sizeMap[size],
                    border: "3px solid hsl(var(--bd-border))",
                    borderTopColor: "hsl(var(--bd-brand))",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }}
            />
            {text && <div className="bd-small">{text}</div>}
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

export function LoadingPage({ text = "Loading..." }: { text?: string }) {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
            }}
        >
            <Loading size="lg" text={text} />
        </div>
    );
}
