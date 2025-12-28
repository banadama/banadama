"use client";

import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "glass";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Button({
    children,
    variant = "primary",
    size = "md",
    isLoading,
    leftIcon,
    rightIcon,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:bg-orange-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:scale-[1.02]",
        secondary: "bg-white/5 border border-white/10 text-white backdrop-blur-md hover:bg-white/10 hover:border-white/20",
        ghost: "bg-transparent text-white hover:bg-white/5",
        danger: "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30",
        glass: "glass-v2 text-white hover:bg-white/10 transition-all",
    };

    const sizes = {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
    };

    return (
        <button
            disabled={disabled || isLoading}
            className={clsx(
                "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : leftIcon ? (
                <span className="mr-2">{leftIcon}</span>
            ) : null}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
}
