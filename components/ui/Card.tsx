// components/ui/Card.tsx
import * as React from "react";

export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`bd-card ${className}`} {...props} />;
}

export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`bd-card-pad border-b border-[hsl(var(--bd-border))] ${className}`} {...props} />;
}

export function CardBody({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`bd-card-pad ${className}`} {...props} />;
}

export function CardFooter({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`bd-card-pad border-t border-[hsl(var(--bd-border))] ${className}`} {...props} />;
}
