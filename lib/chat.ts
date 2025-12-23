// lib/chat.ts - Chat/Messaging System with Thread Types & Permissions

import { db } from "./db";
import type { Role } from "@prisma/client";

// ============================================
// THREAD TYPES & PERMISSIONS
// ============================================

export type ThreadType =
    | "BUYER_TO_OPS"        // Buyer asking Ops for help
    | "OPS_TO_SUPPLIER"     // Ops coordinating with Supplier
    | "CREATOR_TO_SUPPLIER" // Creator working with Supplier
    | "MINI_MARKET";        // General marketplace discussion

export interface ThreadPermissions {
    allowedRoles: Role[];
    description: string;
    maxParticipants: number;
}

export const THREAD_PERMISSIONS: Record<ThreadType, ThreadPermissions> = {
    BUYER_TO_OPS: {
        allowedRoles: ["BUYER", "OPS", "ADMIN"],
        description: "Buyer support - Buyer communicates with Ops",
        maxParticipants: 2, // 1 Buyer + 1 Ops
    },
    OPS_TO_SUPPLIER: {
        allowedRoles: ["OPS", "ADMIN", "SUPPLIER", "FACTORY", "WHOLESALER"],
        description: "Ops coordinates with Supplier on RFQ/Order",
        maxParticipants: 2, // 1 Ops + 1 Supplier
    },
    CREATOR_TO_SUPPLIER: {
        allowedRoles: ["CREATOR", "SUPPLIER", "FACTORY", "WHOLESALER"],
        description: "Creator sources materials from Supplier",
        maxParticipants: 2, // 1 Creator + 1 Supplier
    },
    MINI_MARKET: {
        allowedRoles: ["BUYER", "SUPPLIER", "CREATOR", "OPS", "ADMIN"],
        description: "General marketplace discussion (product questions, etc.)",
        maxParticipants: 10, // Group chat
    },
};

// ============================================
// PERMISSION CHECKS
// ============================================

/**
 * Check if user can create a thread of this type
 */
export function canCreateThread(userRole: Role, threadType: ThreadType): boolean {
    return THREAD_PERMISSIONS[threadType].allowedRoles.includes(userRole);
}

/**
 * Check if user can participate in a thread
 */
export function canParticipateInThread(
    userRole: Role,
    threadType: ThreadType
): boolean {
    return THREAD_PERMISSIONS[threadType].allowedRoles.includes(userRole);
}

/**
 * Get allowed thread types for a user role
 */
export function getAllowedThreadTypes(userRole: Role): ThreadType[] {
    return Object.entries(THREAD_PERMISSIONS)
        .filter(([_, perms]) => perms.allowedRoles.includes(userRole))
        .map(([type, _]) => type as ThreadType);
}

// ============================================
// THREAD CREATION
// ============================================

export interface CreateThreadParams {
    type: ThreadType;
    creatorId: string;
    creatorRole: Role;
    participantIds: string[]; // Additional participant IDs
    title?: string;
    initialMessage?: string;
    metadata?: any;
}

/**
 * Create a new thread/conversation
 */
export async function createThread(params: CreateThreadParams) {
    const {
        type,
        creatorId,
        creatorRole,
        participantIds,
        title,
        initialMessage,
        metadata,
    } = params;

    // Permission check
    if (!canCreateThread(creatorRole, type)) {
        throw new Error(
            `User with role ${creatorRole} cannot create ${type} threads`
        );
    }

    // Check participant limit
    const totalParticipants = 1 + participantIds.length; // creator + others
    if (totalParticipants > THREAD_PERMISSIONS[type].maxParticipants) {
        throw new Error(
            `Thread type ${type} allows max ${THREAD_PERMISSIONS[type].maxParticipants} participants`
        );
    }

    // Auto-assign Ops for BUYER_TO_OPS threads
    let finalParticipantIds = [...participantIds];
    if (type === "BUYER_TO_OPS" && creatorRole === "BUYER") {
        // Find available Ops user
        const opsUser = await db.user.findFirst({
            where: { role: "OPS", isActive: true },
        });

        if (!opsUser) {
            throw new Error("No Ops team member available");
        }

        finalParticipantIds = [opsUser.id];
    }

    // Create thread
    const thread = await db.$transaction(async (tx) => {
        const conversation = await tx.conversation.create({
            data: {
                type: type as any, // This will be stored in a JSON field or string
                title: title || `${type} Thread`,
                isActive: true,
                lastMessageAt: initialMessage ? new Date() : null,
                participants: {
                    create: [
                        { userId: creatorId },
                        ...finalParticipantIds.map((id) => ({ userId: id })),
                    ],
                },
                ...(initialMessage
                    ? {
                        messages: {
                            create: {
                                senderId: creatorId,
                                content: initialMessage,
                                status: "SENT",
                            },
                        },
                    }
                    : {}),
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, email: true, role: true },
                        },
                    },
                },
            },
        });

        return conversation;
    });

    return thread;
}

// ============================================
// MESSAGING
// ============================================

export interface SendMessageParams {
    conversationId: string;
    senderId: string;
    content: string;
    attachments?: string[];
}

/**
 * Send a message in a thread
 */
export async function sendMessage(params: SendMessageParams) {
    const { conversationId, senderId, content, attachments } = params;

    // Verify sender is participant
    const conversation = await db.conversation.findUnique({
        where: { id: conversationId },
        include: {
            participants: true,
        },
    });

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    const isParticipant = conversation.participants.some(
        (p) => p.userId === senderId
    );

    if (!isParticipant) {
        throw new Error("User is not a participant in this conversation");
    }

    // Create message and update conversation
    const message = await db.$transaction(async (tx) => {
        const msg = await tx.message.create({
            data: {
                conversationId,
                senderId,
                content: content.trim(),
                attachments: attachments || [],
                status: "SENT",
            },
            include: {
                sender: {
                    select: { id: true, email: true, role: true },
                },
            },
        });

        // Update conversation last message time
        await tx.conversation.update({
            where: { id: conversationId },
            data: { lastMessageAt: new Date() },
        });

        // Increment unread count for other participants
        const otherParticipants = conversation.participants.filter(
            (p) => p.userId !== senderId
        );

        await Promise.all(
            otherParticipants.map((p) =>
                tx.conversationParticipant.update({
                    where: { id: p.id },
                    data: { unreadCount: { increment: 1 } },
                })
            )
        );

        return msg;
    });

    return message;
}

/**
 * Mark messages as read
 */
export async function markAsRead(conversationId: string, userId: string) {
    const participant = await db.conversationParticipant.findFirst({
        where: {
            conversationId,
            userId,
        },
    });

    if (!participant) {
        throw new Error("Participant not found");
    }

    await db.conversationParticipant.update({
        where: { id: participant.id },
        data: {
            lastReadAt: new Date(),
            unreadCount: 0,
        },
    });
}

/**
 * Get thread messages
 */
export async function getThreadMessages(
    conversationId: string,
    userId: string,
    limit = 50,
    before?: Date
) {
    // Verify user is participant
    const conversation = await db.conversation.findUnique({
        where: { id: conversationId },
        include: {
            participants: true,
        },
    });

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    const isParticipant = conversation.participants.some(
        (p) => p.userId === userId
    );

    if (!isParticipant) {
        throw new Error("Access denied");
    }

    // Fetch messages
    const messages = await db.message.findMany({
        where: {
            conversationId,
            ...(before ? { createdAt: { lt: before } } : {}),
        },
        include: {
            sender: {
                select: { id: true, email: true, role: true },
            },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
    });

    return messages.reverse(); // Oldest first
}

/**
 * Get user's threads/inbox
 */
export async function getUserThreads(
    userId: string,
    filters?: {
        type?: ThreadType;
        unreadOnly?: boolean;
    }
) {
    const conversations = await db.conversation.findMany({
        where: {
            participants: {
                some: {
                    userId,
                    ...(filters?.unreadOnly ? { unreadCount: { gt: 0 } } : {}),
                },
            },
            isActive: true,
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: { id: true, email: true, role: true },
                    },
                },
            },
            messages: {
                take: 1,
                orderBy: { createdAt: "desc" },
                include: {
                    sender: {
                        select: { id: true, email: true, role: true },
                    },
                },
            },
        },
        orderBy: { lastMessageAt: "desc" },
    });

    return conversations.map((conv) => {
        const userParticipant = conv.participants.find((p) => p.userId === userId);

        return {
            id: conv.id,
            type: conv.type,
            title: conv.title,
            participants: conv.participants.map((p) => ({
                id: p.user.id,
                email: p.user.email,
                role: p.user.role,
            })),
            lastMessage: conv.messages[0] || null,
            unreadCount: userParticipant?.unreadCount || 0,
            lastMessageAt: conv.lastMessageAt,
        };
    });
}
