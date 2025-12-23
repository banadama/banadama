// mobile/tokens.ts - Mobile Design Tokens

export const tokens = {
    // Brand Colors
    brand: "#2E9E5B",
    brand2: "#3B82F6",

    // Background & Foreground
    bg: "#FFFFFF",
    bgDark: "#0F172A",
    fg: "#0F172A",
    fgDark: "#FFFFFF",

    // Utility Colors
    muted: "#F3F4F6",
    mutedDark: "#1E293B",
    border: "#E5E7EB",
    borderDark: "#334155",

    // Status Colors
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",

    // Spacing
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
    },

    // Border Radius
    radius: {
        sm: 8,
        md: 14,
        lg: 18,
        full: 999,
    },

    // Typography
    fontSize: {
        xs: 10,
        sm: 12,
        base: 14,
        md: 16,
        lg: 18,
        xl: 22,
        xxl: 28,
        display: 42,
    },

    fontWeight: {
        normal: "400" as const,
        medium: "500" as const,
        semibold: "600" as const,
        bold: "700" as const,
        extrabold: "800" as const,
        black: "900" as const,
    },

    // Shadows
    shadow: {
        sm: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        md: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
        },
        lg: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 8,
        },
    },
};

// Dark mode tokens
export const darkTokens = {
    ...tokens,
    bg: tokens.bgDark,
    fg: tokens.fgDark,
    muted: tokens.mutedDark,
    border: tokens.borderDark,
};
