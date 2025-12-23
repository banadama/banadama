// components/icons/Icon.tsx - SVG Icon Base Component
import * as React from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function IconBase({
    size = 18,
    children,
    ...props
}: IconProps & { children: React.ReactNode }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            {children}
        </svg>
    );
}
