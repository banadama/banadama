// mobile/components/Button.tsx - React Native Button Component
import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { tokens } from "../tokens";

type Variant = "primary" | "ghost" | "soft" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
    title: string;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    onPress: () => void;
    style?: ViewStyle;
}

export function Button({
    title,
    variant = "ghost",
    size = "md",
    disabled = false,
    onPress,
    style,
}: ButtonProps) {
    const getContainerStyle = (): ViewStyle => {
        const base: ViewStyle = {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: tokens.radius.md,
            borderWidth: 1,
            opacity: disabled ? 0.5 : 1,
        };

        const sizeStyles: Record<Size, ViewStyle> = {
            sm: { paddingVertical: 8, paddingHorizontal: 12 },
            md: { paddingVertical: 12, paddingHorizontal: 16 },
            lg: { paddingVertical: 16, paddingHorizontal: 20 },
        };

        const variantStyles: Record<Variant, ViewStyle> = {
            primary: {
                backgroundColor: tokens.brand,
                borderColor: "transparent",
            },
            ghost: {
                backgroundColor: "transparent",
                borderColor: tokens.border,
            },
            soft: {
                backgroundColor: tokens.muted,
                borderColor: "transparent",
            },
            danger: {
                backgroundColor: tokens.danger,
                borderColor: "transparent",
            },
        };

        return { ...base, ...sizeStyles[size], ...variantStyles[variant] };
    };

    const getTextStyle = (): TextStyle => {
        const base: TextStyle = {
            fontWeight: tokens.fontWeight.bold,
        };

        const sizeStyles: Record<Size, TextStyle> = {
            sm: { fontSize: tokens.fontSize.sm },
            md: { fontSize: tokens.fontSize.base },
            lg: { fontSize: tokens.fontSize.md },
        };

        const variantStyles: Record<Variant, TextStyle> = {
            primary: { color: "#FFFFFF" },
            ghost: { color: tokens.fg },
            soft: { color: tokens.fg },
            danger: { color: "#FFFFFF" },
        };

        return { ...base, ...sizeStyles[size], ...variantStyles[variant] };
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[getContainerStyle(), style]}
        >
            <Text style={getTextStyle()}>{title}</Text>
        </Pressable>
    );
}
