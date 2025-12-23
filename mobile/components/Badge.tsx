// mobile/components/Badge.tsx - React Native Badge Component
import React from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import { tokens } from "../tokens";

type Variant = "default" | "success" | "warning" | "danger";

interface BadgeProps {
    children: React.ReactNode;
    variant?: Variant;
    style?: ViewStyle;
}

export function Badge({ children, variant = "default", style }: BadgeProps) {
    const getContainerStyle = (): ViewStyle => {
        const base: ViewStyle = {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: tokens.radius.full,
            borderWidth: 1,
            gap: 6,
        };

        const variantStyles: Record<Variant, ViewStyle> = {
            default: {
                backgroundColor: tokens.muted,
                borderColor: tokens.border,
            },
            success: {
                backgroundColor: `${tokens.success}22`,
                borderColor: `${tokens.success}44`,
            },
            warning: {
                backgroundColor: `${tokens.warning}22`,
                borderColor: `${tokens.warning}44`,
            },
            danger: {
                backgroundColor: `${tokens.danger}22`,
                borderColor: `${tokens.danger}44`,
            },
        };

        return { ...base, ...variantStyles[variant] };
    };

    const getTextStyle = (): TextStyle => {
        const base: TextStyle = {
            fontSize: tokens.fontSize.sm,
            fontWeight: tokens.fontWeight.bold,
        };

        const variantStyles: Record<Variant, TextStyle> = {
            default: { color: tokens.fg },
            success: { color: tokens.success },
            warning: { color: tokens.warning },
            danger: { color: tokens.danger },
        };

        return { ...base, ...variantStyles[variant] };
    };

    return (
        <View style={[getContainerStyle(), style]}>
            {typeof children === "string" ? (
                <Text style={getTextStyle()}>{children}</Text>
            ) : (
                children
            )}
        </View>
    );
}
