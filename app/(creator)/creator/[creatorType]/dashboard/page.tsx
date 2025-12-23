// app/(creator)/creator/[creatorType]/dashboard/page.tsx
import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCreatorTypeBySlug, getCreatorTypeInfo, CreatorType } from "@/types/creator";

interface Props {
    params: {
        creatorType: string;
    };
}

export default async function CreatorTypeDashboardPage({ params }: Props) {
    // Get current user
    const user = await getCurrentUser();

    if (!user || user.role !== "CREATOR") {
        redirect("/auth/login");
    }

    // Validate creator type from URL
    const creatorType = getCreatorTypeBySlug(params.creatorType);

    if (!creatorType) {
        notFound();
    }

    // Fetch creator profile
    const creatorProfile = await db.creatorProfile.findUnique({
        where: { userId: user.id },
        include: {
            products: true,
        },
    });

    if (!creatorProfile) {
        redirect("/creator/setup");
    }

    // Verify the user's creator type matches the URL
    if (creatorProfile.creatorType !== creatorType) {
        redirect(`/creator/${getCreatorTypeInfo(creatorProfile.creatorType).slug}/dashboard`);
    }

    const typeInfo = getCreatorTypeInfo(creatorType);

    // Type-specific stats and content
    const stats = {
        activeProjects: creatorProfile.products.length,
        totalEarnings: 0, // TODO: Calculate from orders/transactions
        portfolioItems: creatorProfile.products.length,
        completedProjects: 0, // TODO: Calculate from completed projects
    };

    return (
        <DashboardShell
            variant="creator"
            title={`${typeInfo.label} Dashboard`}
            subtitle={typeInfo.description}
        >
            {/* Stats Grid */}
            <div className="col-span-3 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <p className="text-xs text-slate-400">Active Projects</p>
                    <p className={`mt-2 text-3xl font-bold bg-gradient-to-r ${typeInfo.color} bg-clip-text text-transparent`}>
                        {stats.activeProjects}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <p className="text-xs text-slate-400">Portfolio Items</p>
                    <p className={`mt-2 text-3xl font-bold bg-gradient-to-r ${typeInfo.color} bg-clip-text text-transparent`}>
                        {stats.portfolioItems}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <p className="text-xs text-slate-400">Total Earnings</p>
                    <p className={`mt-2 text-3xl font-bold bg-gradient-to-r ${typeInfo.color} bg-clip-text text-transparent`}>
                        ₦{stats.totalEarnings.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Type-specific Quick Actions */}
            <div className="col-span-3">
                <h3 className="text-sm font-semibold text-slate-200 mb-4">Quick Actions</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {getQuickActions(creatorType).map((action, idx) => (
                        <a
                            key={idx}
                            href={action.href}
                            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${typeInfo.color} p-4 backdrop-blur-xl hover:scale-105 transition-all`}
                        >
                            <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/40 transition-colors"></div>
                            <div className="relative">
                                <div className="text-2xl mb-2">{action.icon}</div>
                                <p className="text-sm font-semibold text-white">{action.label}</p>
                                <p className="text-xs text-slate-300 mt-1">{action.description}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="col-span-3">
                <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Activity</h3>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <p className="text-sm text-slate-400 text-center py-8">
                        No recent activity yet. Start by creating your first project!
                    </p>
                </div>
            </div>
        </DashboardShell>
    );
}

// Type-specific quick actions
function getQuickActions(type: CreatorType) {
    const actionsMap = {
        [CreatorType.MODEL]: [
            { icon: "📸", label: "Upload Portfolio", description: "Add new photos", href: "#" },
            { icon: "📅", label: "View Bookings", description: "Manage your schedule", href: "#" },
            { icon: "💼", label: "Find Gigs", description: "Browse opportunities", href: "#" },
            { icon: "⭐", label: "Reviews", description: "Client feedback", href: "#" },
        ],
        [CreatorType.MOCK_DESIGNER]: [
            { icon: "🎨", label: "New Mockup", description: "Create design", href: "#" },
            { icon: "📦", label: "Templates", description: "Browse templates", href: "#" },
            { icon: "🖼️", label: "Gallery", description: "View your work", href: "#" },
            { icon: "💡", label: "Requests", description: "Client projects", href: "#" },
        ],
        [CreatorType.GRAPHIC_DESIGNER]: [
            { icon: "✏️", label: "New Design", description: "Start project", href: "#" },
            { icon: "🎭", label: "Brand Kits", description: "Manage brands", href: "#" },
            { icon: "📊", label: "Projects", description: "Active work", href: "#" },
            { icon: "💬", label: "Client Chat", description: "Messages", href: "#" },
        ],
        [CreatorType.PHOTOGRAPHER]: [
            { icon: "📷", label: "Upload Photos", description: "New session", href: "#" },
            { icon: "🖼️", label: "Portfolio", description: "Manage gallery", href: "#" },
            { icon: "📅", label: "Sessions", description: "Schedule shoots", href: "#" },
            { icon: "💰", label: "Packages", description: "Pricing plans", href: "#" },
        ],
        [CreatorType.VIDEOGRAPHER]: [
            { icon: "🎥", label: "Upload Video", description: "New project", href: "#" },
            { icon: "🎬", label: "Projects", description: "Manage videos", href: "#" },
            { icon: "📅", label: "Shoots", description: "Schedule", href: "#" },
            { icon: "✂️", label: "Edit Queue", description: "Pending edits", href: "#" },
        ],
    };

    return actionsMap[type] || [];
}

// Generate static paths for all creator types
export function generateStaticParams() {
    return [
        { creatorType: "model" },
        { creatorType: "mockdesigner" },
        { creatorType: "graphicdesigner" },
        { creatorType: "photographer" },
        { creatorType: "videographer" },
    ];
}
