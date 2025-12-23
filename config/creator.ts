// Creator System Configuration

import { CreatorRole, CreatorProjectType } from "@/types/creatorPortfolio";

/**
 * Standard creator roles for UI filters and profile tags
 */
export const CREATOR_ROLES: CreatorRole[] = [
    "Model",
    "Mockup Designer",
    "Graphic Designer",
    "Photographer",
    "Video Editor",
    "Other",
];

/**
 * Project types with display information
 */
export const PROJECT_TYPES: Record<CreatorProjectType, { label: string; icon: string; description: string }> = {
    MODEL: {
        label: "3D Model",
        icon: "🎨",
        description: "3D models for product visualization",
    },
    MOCKUP: {
        label: "Mockup",
        icon: "📱",
        description: "Product mockups and presentations",
    },
    GRAPHIC: {
        label: "Graphic Design",
        icon: "🖼️",
        description: "Graphics, logos, and visual designs",
    },
    VIDEO: {
        label: "Video",
        icon: "🎬",
        description: "Video content and animations",
    },
    OTHER: {
        label: "Other",
        icon: "📦",
        description: "Other creative work",
    },
};

/**
 * Default portfolio visibility settings
 */
export const DEFAULT_VISIBILITY = {
    showToFactories: true,
    showToWholesalers: true,
    showInPublicDirectory: false,
};

/**
 * Banadama commission rate for creators
 */
export const CREATOR_COMMISSION_RATE = 0.10; // 10%

/**
 * Calculate creator earnings after commission
 */
export function calculateCreatorEarnings(grossAmount: number): {
    commission: number;
    netEarnings: number;
} {
    const commission = Math.floor(grossAmount * CREATOR_COMMISSION_RATE);
    const netEarnings = grossAmount - commission;

    return { commission, netEarnings };
}

/**
 * Format currency for creator earnings
 */
export function formatCreatorCurrency(amount: number, currency: string = "NGN"): string {
    const symbol = currency === "NGN" ? "₦" : currency === "USD" ? "$" : currency;
    return `${symbol}${amount.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

/**
 * Supported currencies for creator pricing
 */
export const SUPPORTED_CURRENCIES = [
    { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
];

/**
 * Supported languages for creator profiles
 */
export const SUPPORTED_LANGUAGES = [
    "English",
    "French",
    "Arabic",
    "Hausa",
    "Yoruba",
    "Igbo",
    "Swahili",
    "Portuguese",
    "Spanish",
    "Chinese",
];

/**
 * Creator rating levels
 */
export const RATING_LEVELS = {
    EXCELLENT: { min: 4.5, label: "Excellent", color: "emerald" },
    GOOD: { min: 4.0, label: "Good", color: "blue" },
    AVERAGE: { min: 3.0, label: "Average", color: "yellow" },
    POOR: { min: 0, label: "Needs Improvement", color: "red" },
};

/**
 * Get rating level for a given rating
 */
export function getRatingLevel(rating: number) {
    if (rating >= RATING_LEVELS.EXCELLENT.min) return RATING_LEVELS.EXCELLENT;
    if (rating >= RATING_LEVELS.GOOD.min) return RATING_LEVELS.GOOD;
    if (rating >= RATING_LEVELS.AVERAGE.min) return RATING_LEVELS.AVERAGE;
    return RATING_LEVELS.POOR;
}

/**
 * Offer types with descriptions
 */
export const OFFER_TYPES = {
    HIRE: {
        label: "Hire Creator",
        description: "Hire this creator for a custom project",
    },
    USE_DESIGN: {
        label: "Use Design",
        description: "Request to use an existing design",
    },
    CUSTOM_REQUEST: {
        label: "Custom Request",
        description: "Custom collaboration request",
    },
};

/**
 * Maximum file sizes for uploads
 */
export const UPLOAD_LIMITS = {
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_IMAGES_PER_PROJECT: 10,
    MAX_FILES_PER_PROJECT: 5,
};

/**
 * Validate project data
 */
export function validateProject(data: {
    title: string;
    type: CreatorProjectType;
    images: string[];
}): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length < 3) {
        errors.push("Title must be at least 3 characters");
    }

    if (!data.type || !PROJECT_TYPES[data.type]) {
        errors.push("Invalid project type");
    }

    if (!data.images || data.images.length === 0) {
        errors.push("At least one image is required");
    }

    if (data.images && data.images.length > UPLOAD_LIMITS.MAX_IMAGES_PER_PROJECT) {
        errors.push(`Maximum ${UPLOAD_LIMITS.MAX_IMAGES_PER_PROJECT} images allowed`);
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
