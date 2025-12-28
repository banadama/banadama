import React from "react";
import clsx from "clsx";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "neutral" | "accent" | "success" | "warning" | "danger" | "glass";
    size?: "sm" | "md";
    className?: string;
}

export function Badge({
    children,
    variant = "neutral",
    size = "md",
    className,
}: BadgeProps) {
    const variants = {
        neutral: "bg-slate-800 text-slate-300",
        accent: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
        success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
        danger: "bg-red-500/20 text-red-400 border border-red-500/30",
        glass: "bg-white/5 backdrop-blur-md text-white border border-white/10",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
    };

    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full font-medium tracking-wide uppercase",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </span>
    );
}
