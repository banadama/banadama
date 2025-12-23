// components/ui/Badge.tsx
import * as React from "react";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "success" | "warning" | "danger";
};

export function Badge({ variant = "default", className = "", ...props }: Props) {
    const v =
        variant === "success" ? "bd-badge-success" :
            variant === "warning" ? "bd-badge-warning" :
                variant === "danger" ? "bd-badge-danger" : "";

    return <span className={`bd-badge ${v} ${className}`} {...props} />;
}
