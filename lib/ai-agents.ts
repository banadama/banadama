// lib/ai-agents.ts - AI Recommendation Engine (SAFE MODE)
import { db } from './db';

/**
 * AI RECOMMENDATION ENGINE
 * 
 * CORE PRINCIPLE (LOCKED):
 * ========================
 * ANALYTICS = VISIBILITY
 * AI        = RECOMMENDATION  
 * HUMAN     = FINAL DECISION
 * 
 * AI CANNOT:
 * - Approve payouts
 * - Assign suppliers
 * - Change fees
 * - Grant verification
 * - Release escrow
 * - Execute ANY financial action
 * 
 * AI CAN ONLY:
 * - Generate insights
 * - Make recommendations
 * - Flag anomalies
 */

type InsightPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface InsightInput {
    agentType: 'MARKET_AI' | 'SUPPLIER_AI' | 'BUYER_AI' | 'OPS_AI' | 'PRICING_AI' | 'FINANCE_AI';
    title: string;
    description: string;
    priority: InsightPriority;
    suggestedAction?: string;
    targetType?: string;
    targetId?: string;
    visibleToRoles?: string[];
    contextData?: Record<string, unknown>;
    expiresInDays?: number;
}

/**
 * Create an AI insight (recommendation only)
 */
export async function createInsight(input: InsightInput): Promise<string> {
    const insight = await db.aIInsight.create({
        data: {
            agentType: input.agentType,
            title: input.title,
            description: input.description,
            priority: input.priority,
            status: 'ACTIVE',
            suggestedAction: input.suggestedAction,
            targetType: input.targetType,
            targetId: input.targetId,
            visibleToRoles: input.visibleToRoles || ['ADMIN'],
            contextData: input.contextData,
            expiresAt: input.expiresInDays
                ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
                : null,
        },
    });

    return insight.id;
}

/**
 * MARKET AI - Analyzes market trends
 */
export async function runMarketAI(): Promise<void> {
    try {
        // Analyze category demand
        const rfqsByCategory = await db.rfq.groupBy({
            by: ['productCategory'],
            _count: true,
            orderBy: { _count: { productCategory: 'desc' } },
            take: 10,
        });

        const ordersByCategory = await db.order.groupBy({
            by: ['productCategory'],
            _count: true,
        });

        // Create category-order map
        const orderMap = new Map(ordersByCategory.map(o => [o.productCategory, o._count]));

        // Find categories with high RFQ but low orders (demand gap)
        for (const cat of rfqsByCategory) {
            const rfqs = cat._count;
            const orders = orderMap.get(cat.productCategory) || 0;
            const conversionRate = rfqs > 0 ? orders / rfqs : 0;

            if (rfqs >= 10 && conversionRate < 0.2) {
                await createInsight({
                    agentType: 'MARKET_AI',
                    title: `Low conversion in ${cat.productCategory}`,
                    description: `${rfqs} RFQs but only ${orders} orders (${(conversionRate * 100).toFixed(1)}% conversion). May indicate supplier shortage or pricing issues.`,
                    priority: 'MEDIUM',
                    suggestedAction: 'Consider onboarding more suppliers in this category or reviewing pricing.',
                    targetType: 'CATEGORY',
                    targetId: cat.productCategory || undefined,
                    visibleToRoles: ['ADMIN'],
                });
            }
        }
    } catch (err) {
        console.error('MarketAI error:', err);
    }
}

/**
 * SUPPLIER AI - Analyzes supplier performance
 */
export async function runSupplierAI(): Promise<void> {
    try {
        // Find high-risk suppliers
        const highRiskScores = await db.supplierScore.findMany({
            where: {
                isHighRisk: true,
                // Don't re-flag recently flagged
            },
            take: 10,
        });

        for (const score of highRiskScores) {
            const supplier = await db.supplier.findUnique({
                where: { id: score.supplierId },
                select: { businessName: true },
            });

            await createInsight({
                agentType: 'SUPPLIER_AI',
                title: `High-risk supplier: ${supplier?.businessName}`,
                description: `Score: ${score.overallScore}/100. Reasons: ${score.riskReasons.join(', ')}`,
                priority: score.overallScore < 30 ? 'HIGH' : 'MEDIUM',
                suggestedAction: 'Review supplier performance and consider suspension if issues persist.',
                targetType: 'SUPPLIER',
                targetId: score.supplierId,
                visibleToRoles: ['ADMIN', 'OPS'],
                expiresInDays: 7,
            });
        }

        // Find top performers
        const topPerformers = await db.supplierScore.findMany({
            where: { isTopPerformer: true },
            orderBy: { overallScore: 'desc' },
            take: 5,
        });

        if (topPerformers.length > 0) {
            await createInsight({
                agentType: 'SUPPLIER_AI',
                title: `${topPerformers.length} top-performing suppliers identified`,
                description: 'These suppliers have excellent scores and could be highlighted or offered incentives.',
                priority: 'LOW',
                suggestedAction: 'Consider featuring these suppliers or offering partnership tiers.',
                visibleToRoles: ['ADMIN'],
                expiresInDays: 30,
            });
        }
    } catch (err) {
        console.error('SupplierAI error:', err);
    }
}

/**
 * OPS AI - Analyzes operational efficiency
 */
export async function runOpsAI(): Promise<void> {
    try {
        const latestMetric = await db.opsMetric.findFirst({
            orderBy: { periodStart: 'desc' },
        });

        if (!latestMetric) return;

        // Check response time
        if (latestMetric.avgRfqResponseTimeHours && latestMetric.avgRfqResponseTimeHours > 24) {
            await createInsight({
                agentType: 'OPS_AI',
                title: 'RFQ response time above 24h',
                description: `Average response time is ${latestMetric.avgRfqResponseTimeHours.toFixed(1)} hours. Target is under 24h.`,
                priority: latestMetric.avgRfqResponseTimeHours > 48 ? 'HIGH' : 'MEDIUM',
                suggestedAction: 'Consider adding more Ops capacity or reviewing workflow efficiency.',
                visibleToRoles: ['ADMIN', 'OPS'],
                expiresInDays: 7,
            });
        }

        // Check on-time rate
        const total = latestMetric.deliveriesOnTime + latestMetric.deliveriesLate;
        if (total > 0) {
            const onTimeRate = latestMetric.deliveriesOnTime / total;
            if (onTimeRate < 0.85) {
                await createInsight({
                    agentType: 'OPS_AI',
                    title: 'On-time delivery rate below target',
                    description: `Current rate: ${(onTimeRate * 100).toFixed(1)}%. Target: 85%+`,
                    priority: 'HIGH',
                    suggestedAction: 'Review logistics bottlenecks and carrier performance.',
                    visibleToRoles: ['ADMIN', 'OPS'],
                    expiresInDays: 7,
                });
            }
        }
    } catch (err) {
        console.error('OpsAI error:', err);
    }
}

/**
 * FINANCE AI - Analyzes financial health
 */
export async function runFinanceAI(): Promise<void> {
    try {
        const latestMetric = await db.financeMetric.findFirst({
            orderBy: { periodStart: 'desc' },
        });

        if (!latestMetric) return;

        // Check refund rate
        if (latestMetric.refundCount > 10) {
            await createInsight({
                agentType: 'FINANCE_AI',
                title: 'High refund volume detected',
                description: `${latestMetric.refundCount} refunds totaling ₦${(latestMetric.refundsIssued / 100).toLocaleString()}`,
                priority: 'HIGH',
                suggestedAction: 'Investigate common refund reasons and supplier quality.',
                visibleToRoles: ['ADMIN', 'FINANCE_ADMIN'],
                expiresInDays: 7,
            });
        }

        // Check dispute resolution
        if (latestMetric.disputesOpened > 0) {
            const resolutionRate = latestMetric.disputesResolved / latestMetric.disputesOpened;
            if (resolutionRate < 0.8) {
                await createInsight({
                    agentType: 'FINANCE_AI',
                    title: 'Dispute resolution rate below 80%',
                    description: `${latestMetric.disputesResolved}/${latestMetric.disputesOpened} disputes resolved (${(resolutionRate * 100).toFixed(0)}%)`,
                    priority: 'MEDIUM',
                    suggestedAction: 'Review pending disputes and prioritize resolution.',
                    visibleToRoles: ['ADMIN', 'FINANCE_ADMIN', 'OPS'],
                    expiresInDays: 7,
                });
            }
        }
    } catch (err) {
        console.error('FinanceAI error:', err);
    }
}

/**
 * Run all AI agents
 * Should be called by a cron job (daily/weekly)
 */
export async function runAllAIAgents(): Promise<void> {
    console.log('🤖 Running AI agents...');

    // Expire old insights first
    await db.aIInsight.updateMany({
        where: {
            status: 'ACTIVE',
            expiresAt: { lt: new Date() },
        },
        data: { status: 'EXPIRED' },
    });

    await runMarketAI();
    await runSupplierAI();
    await runOpsAI();
    await runFinanceAI();

    console.log('✅ AI agents completed');
}

/**
 * IMPORTANT: This module ONLY creates recommendations.
 * It NEVER executes any action.
 * All actions require human approval through the UI.
 */
