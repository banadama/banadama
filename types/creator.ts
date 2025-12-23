// types/creator.ts
export enum CreatorType {
    MODEL = "MODEL",
    MOCK_DESIGNER = "MOCK_DESIGNER",
    GRAPHIC_DESIGNER = "GRAPHIC_DESIGNER",
    PHOTOGRAPHER = "PHOTOGRAPHER",
    VIDEOGRAPHER = "VIDEOGRAPHER",
}

export interface CreatorTypeInfo {
    type: CreatorType;
    label: string;
    description: string;
    slug: string;
    icon: string;
    color: string;
}

export const CREATOR_TYPE_INFO: Record<CreatorType, CreatorTypeInfo> = {
    [CreatorType.MODEL]: {
        type: CreatorType.MODEL,
        label: "Model",
        description: "Fashion modeling, photography shoots, runway, and commercial work",
        slug: "model",
        icon: "👤",
        color: "from-pink-500 to-rose-500",
    },
    [CreatorType.MOCK_DESIGNER]: {
        type: CreatorType.MOCK_DESIGNER,
        label: "Mock Designer",
        description: "Create mockups, product visualizations, and design prototypes",
        slug: "mockdesigner",
        icon: "🎨",
        color: "from-purple-500 to-indigo-500",
    },
    [CreatorType.GRAPHIC_DESIGNER]: {
        type: CreatorType.GRAPHIC_DESIGNER,
        label: "Graphic Designer",
        description: "Logo design, branding, marketing materials, and visual content",
        slug: "graphicdesigner",
        icon: "✏️",
        color: "from-blue-500 to-cyan-500",
    },
    [CreatorType.PHOTOGRAPHER]: {
        type: CreatorType.PHOTOGRAPHER,
        label: "Photographer",
        description: "Product photography, lifestyle shoots, and commercial photography",
        slug: "photographer",
        icon: "📷",
        color: "from-amber-500 to-orange-500",
    },
    [CreatorType.VIDEOGRAPHER]: {
        type: CreatorType.VIDEOGRAPHER,
        label: "Videographer",
        description: "Video production, commercial shoots, and content creation",
        slug: "videographer",
        icon: "🎥",
        color: "from-green-500 to-emerald-500",
    },
};

export function getCreatorTypeBySlug(slug: string): CreatorType | null {
    const entry = Object.values(CREATOR_TYPE_INFO).find((info) => info.slug === slug);
    return entry?.type || null;
}

export function getCreatorTypeInfo(type: CreatorType): CreatorTypeInfo {
    return CREATOR_TYPE_INFO[type];
}

export function getAllCreatorTypes(): CreatorTypeInfo[] {
    return Object.values(CREATOR_TYPE_INFO);
}
