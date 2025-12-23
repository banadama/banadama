export type CreatorCategory =
    | "GRAPHIC_DESIGNER"
    | "MOCK_DESIGNER"
    | "AI_AGENT_DEV"
    | "MODELLING"
    | "PHOTOGRAPHER"
    | "VIDEOGRAPHER";

export const CREATOR_CATEGORY_LABELS: Record<CreatorCategory, string> = {
    GRAPHIC_DESIGNER: "Graphic Design",
    MOCK_DESIGNER: "Mockups",
    AI_AGENT_DEV: "AI Agents",
    MODELLING: "Modelling",
    PHOTOGRAPHER: "Photography",
    VIDEOGRAPHER: "Videography",
};

export function creatorCategoryLabel(category?: string | null) {
    if (!category) return "Creator";
    return (CREATOR_CATEGORY_LABELS as any)[category] ?? category;
}
