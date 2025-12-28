import React from "react";
import { Icons } from "@/components/icons/icons";
import clsx from "clsx";

export type VerificationLevel = "IDENTITY" | "BUSINESS" | "PREMIUM" | "NONE";

interface VerificationBadgeProps {
    level: VerificationLevel;
    showLabel?: boolean;
    className?: string;
}

export function VerificationBadge({
    level,
    showLabel = false,
    className,
}: VerificationBadgeProps) {
    if (level === "NONE") return null;

    const configs = {
        IDENTITY: {
            icon: Icons.TickBlue,
            label: "Verified Identity",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        BUSINESS: {
            icon: Icons.TickGreen,
            label: "Verified Business",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
        PREMIUM: {
            icon: Icons.TickGold,
            label: "Premium Partner",
            color: "text-amber-400",
            bg: "bg-amber-500/10",
        },
    };

    const config = configs[level];
    const Icon = config.icon;

    return (
        <div
            className={clsx(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase",
                config.bg,
                config.color,
                className
            )}
            title={config.label}
        >
            <Icon size={14} />
            {showLabel && <span>{config.label}</span>}
        </div>
    );
}
