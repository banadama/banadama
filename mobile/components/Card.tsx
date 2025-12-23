// mobile/components/Card.tsx - React Native Card Component
import React from "react";
import { View, ViewStyle } from "react-native";
import { tokens } from "../tokens";

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    padded?: boolean;
}

export function Card({ children, style, padded = true }: CardProps) {
    return (
        <View
            style={[
                {
                    backgroundColor: tokens.bg,
                    borderWidth: 1,
                    borderColor: tokens.border,
                    borderRadius: tokens.radius.lg,
                    ...tokens.shadow.sm,
                },
                padded && { padding: tokens.spacing.lg },
                style,
            ]}
        >
            {children}
        </View>
    );
}

export function CardHeader({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
    return (
        <View
            style={[
                {
                    paddingHorizontal: tokens.spacing.lg,
                    paddingVertical: tokens.spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: tokens.border,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}

export function CardBody({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
    return (
        <View style={[{ padding: tokens.spacing.lg }, style]}>
            {children}
        </View>
    );
}
