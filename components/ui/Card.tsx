import React from "react";
import clsx from "clsx";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    footer?: React.ReactNode;
    hoverable?: boolean;
    noPadding?: boolean;
}

export function Card({
    children,
    className,
    title,
    subtitle,
    footer,
    hoverable = false,
    noPadding = false,
}: CardProps) {
    return (
        <div
            className={clsx(
                "glass rounded-2xl overflow-hidden transition-all duration-300",
                hoverable && "hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-1",
                className
            )}
        >
            {(title || subtitle) && (
                <div className="px-6 py-4 border-b border-white/5">
                    {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                    {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
                </div>
            )}
            <div className={clsx(!noPadding && "p-6")}>
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5">
                    {footer}
                </div>
            )}
        </div>
    );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={clsx("p-6", className)}>{children}</div>;
}

export function CardHeader({ title, children, className }: { title?: string; children?: React.ReactNode; className?: string }) {
    return (
        <div className={clsx("px-6 py-4 border-b border-white/5", className)}>
            {title && <h3 className="font-semibold">{title}</h3>}
            {children}
        </div>
    );
}
export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={clsx("px-6 py-4 bg-white/[0.02] border-t border-white/5", className)}>{children}</div>;
}
