// Creator Portfolio Types

export type CreatorProjectType =
    | "MODEL"
    | "MOCKUP"
    | "GRAPHIC"
    | "VIDEO"
    | "OTHER";

export interface CreatorProject {
    id: string;
    creatorId: string;
    title: string;
    description?: string;
    type: CreatorProjectType;
    images: string[]; // URLs
    files: string[]; // Optional downloadable assets
    basePrice?: number; // For licensing/selling the design
    currency: string;
    isPublic: boolean;
    tags: string[];
    stats: {
        views: number;
        clicks: number;
        saves: number;
        inquiries: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatorProfile {
    id: string;
    userId: string;
    displayName: string;
    bio?: string;
    avatar?: string;
    roles: CreatorRole[];
    country?: string;
    languages: string[];
    rating: number;
    completedJobs: number;
    totalEarnings: number; // After 10% Banadama commission
    isAvailable: boolean;
    baseRates?: {
        hourly?: number;
        project?: number;
        currency: string;
    };
    visibility: {
        showToFactories: boolean;
        showToWholesalers: boolean;
        showInPublicDirectory: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

export type CreatorRole =
    | "Model"
    | "Mockup Designer"
    | "Graphic Designer"
    | "Photographer"
    | "Video Editor"
    | "Other";

export interface CreatorOffer {
    id: string;
    creatorId: string;
    buyerId: string; // Factory or wholesaler
    buyerType: "FACTORY" | "WHOLESALER";
    projectId?: string; // If related to a specific project
    type: "HIRE" | "USE_DESIGN" | "CUSTOM_REQUEST";
    title: string;
    description: string;
    budget: number;
    currency: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatorStats {
    totalViews: number;
    totalInquiries: number;
    completedJobs: number;
    totalEarnings: number; // After commission
    pendingOffers: number;
    activeProjects: number;
}

export interface CreatorEarning {
    id: string;
    creatorId: string;
    type: "SALE" | "USAGE_FEE" | "COMMISSION" | "PROJECT_PAYMENT";
    amount: number; // After 10% Banadama commission
    grossAmount: number; // Before commission
    commission: number; // Banadama's 10%
    currency: string;
    projectId?: string;
    offerId?: string;
    description: string;
    status: "PENDING" | "PAID" | "CANCELLED";
    paidAt?: Date;
    createdAt: Date;
}

export interface CreatorAnalytics {
    period: "7d" | "30d" | "90d" | "all";
    views: number;
    clicks: number;
    saves: number;
    inquiries: number;
    conversionRate: number; // inquiries / views
    topProjects: Array<{
        projectId: string;
        title: string;
        views: number;
        inquiries: number;
    }>;
    viewsBySource: {
        factories: number;
        wholesalers: number;
        public: number;
    };
}

export interface CreatorFilter {
    role?: CreatorRole;
    country?: string;
    languages?: string[];
    minRating?: number;
    isAvailable?: boolean;
    search?: string;
}

export interface ProjectFilter {
    type?: CreatorProjectType;
    isPublic?: boolean;
    tags?: string[];
    search?: string;
}
