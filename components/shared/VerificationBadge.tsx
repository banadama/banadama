// components/shared/VerificationBadge.tsx - Verification Tick Display Component
import React from 'react';

type VerificationLevel = 'NONE' | 'BLUE' | 'GREEN' | 'GOLD';

interface VerificationBadgeProps {
    level: VerificationLevel | string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const VERIFICATION_CONFIG = {
    NONE: {
        icon: '',
        label: '',
        color: 'transparent',
        bgColor: 'transparent',
    },
    BLUE: {
        icon: '🔵',
        label: 'Verified',
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.15)',
    },
    GREEN: {
        icon: '🟢',
        label: 'Business Verified',
        color: '#22c55e',
        bgColor: 'rgba(34, 197, 94, 0.15)',
    },
    GOLD: {
        icon: '🟡',
        label: 'Premium',
        color: '#eab308',
        bgColor: 'rgba(234, 179, 8, 0.15)',
    },
};

const SIZE_CONFIG = {
    sm: {
        iconSize: '0.75rem',
        fontSize: '0.65rem',
        padding: '0.125rem 0.375rem',
        gap: '0.125rem',
    },
    md: {
        iconSize: '1rem',
        fontSize: '0.75rem',
        padding: '0.25rem 0.5rem',
        gap: '0.25rem',
    },
    lg: {
        iconSize: '1.25rem',
        fontSize: '0.85rem',
        padding: '0.375rem 0.75rem',
        gap: '0.375rem',
    },
};

export default function VerificationBadge({
    level,
    size = 'md',
    showLabel = false,
    className = '',
    style = {},
}: VerificationBadgeProps) {
    const config = VERIFICATION_CONFIG[level as VerificationLevel] || VERIFICATION_CONFIG.NONE;
    const sizeConfig = SIZE_CONFIG[size];

    if (level === 'NONE' || !config.icon) {
        return null;
    }

    return (
        <span
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: sizeConfig.gap,
                padding: showLabel ? sizeConfig.padding : '0',
                background: showLabel ? config.bgColor : 'transparent',
                borderRadius: '9999px',
                ...style,
            }}
            title={config.label}
        >
            <span style={{ fontSize: sizeConfig.iconSize }}>{config.icon}</span>
            {showLabel && (
                <span
                    style={{
                        fontSize: sizeConfig.fontSize,
                        fontWeight: 500,
                        color: config.color,
                    }}
                >
                    {config.label}
                </span>
            )}
        </span>
    );
}

// Component for inline display next to names
export function VerificationTick({
    level,
    size = 'md',
}: {
    level: VerificationLevel | string;
    size?: 'sm' | 'md' | 'lg';
}) {
    return <VerificationBadge level={level} size={size} showLabel={false} />;
}

// Component for profile pages with full label
export function VerificationStatus({
    level,
}: {
    level: VerificationLevel | string;
}) {
    if (level === 'NONE') {
        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(148, 163, 184, 0.15)',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                }}
            >
                ⚪ Not Verified
            </span>
        );
    }

    return <VerificationBadge level={level} size="md" showLabel />;
}

// Utility function for use in other components
export function getVerificationInfo(level: VerificationLevel | string) {
    return VERIFICATION_CONFIG[level as VerificationLevel] || VERIFICATION_CONFIG.NONE;
}
