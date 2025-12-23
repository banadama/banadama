// components/ui/Button.tsx
import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "soft" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
};

export function Button({ variant = "ghost", size = "md", className = "", ...props }: Props) {
    const base = "bd-btn";
    const v =
        variant === "primary" ? "bd-btn-primary" :
            variant === "soft" ? "bd-btn-soft" :
                variant === "danger" ? "bd-btn-danger" : "";

    const sizeClass =
        size === "sm" ? "text-sm py-2 px-3" :
            size === "lg" ? "text-lg py-4 px-6" : "";

    return <button className={`${base} ${v} ${sizeClass} ${className}`} {...props} />;
}
