// lib/push-notifications.ts - Push Notification Service
import { db } from './db';

/**
 * PUSH NOTIFICATION SERVICE
 * 
 * Events that trigger notifications:
 * - New RFQ assigned (OPS)
 * - Order status changed (Buyer, Supplier)
 * - Shipment status updated (Buyer)
 * - New message received (All)
 * - Payout approved (Supplier, Growth Agent, Affiliate)
 * 
 * Configurable per role. No spam.
 */

export type NotificationType =
    | 'NEW_RFQ'
    | 'ORDER_STATUS_CHANGE'
    | 'SHIPMENT_UPDATE'
    | 'MESSAGE_RECEIVED'
    | 'PAYOUT_APPROVED'
    | 'DELIVERY_CONFIRMATION_NEEDED'
    | 'SUPPLIER_ONBOARDED'
    | 'EARNING_UNLOCKED';

interface PushPayload {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, string>;
}

// Store device tokens
interface DeviceToken {
    userId: string;
    token: string;
    platform: 'android' | 'ios' | 'web';
    createdAt: Date;
}

// In-memory store (in production, use Redis or DB)
const deviceTokens: Map<string, DeviceToken[]> = new Map();

/**
 * Register a device token for push notifications
 */
export async function registerDeviceToken(
    userId: string,
    token: string,
    platform: 'android' | 'ios' | 'web'
): Promise<void> {
    const existing = deviceTokens.get(userId) || [];

    // Remove duplicate tokens
    const filtered = existing.filter(t => t.token !== token);

    filtered.push({
        userId,
        token,
        platform,
        createdAt: new Date(),
    });

    deviceTokens.set(userId, filtered);

    // In production, also save to DB
    // await db.deviceToken.upsert({ ... });
}

/**
 * Unregister a device token
 */
export async function unregisterDeviceToken(
    userId: string,
    token: string
): Promise<void> {
    const existing = deviceTokens.get(userId) || [];
    const filtered = existing.filter(t => t.token !== token);
    deviceTokens.set(userId, filtered);
}

/**
 * Send push notification (Platform-agnostic wrapper)
 */
export async function sendPushNotification(payload: PushPayload): Promise<boolean> {
    const tokens = deviceTokens.get(payload.userId) || [];

    if (tokens.length === 0) {
        console.log(`No device tokens for user ${payload.userId}`);
        return false;
    }

    // In production, integrate with:
    // - Firebase Cloud Messaging (FCM) for Android
    // - Apple Push Notification Service (APNs) for iOS
    // - Web Push API for PWA

    console.log(`📲 Push notification to ${payload.userId}:`, payload.title);

    for (const device of tokens) {
        try {
            if (device.platform === 'android' || device.platform === 'ios') {
                // await sendFCM(device.token, payload);
            } else if (device.platform === 'web') {
                // await sendWebPush(device.token, payload);
            }
        } catch (err) {
            console.error(`Failed to send to ${device.platform}:`, err);
        }
    }

    // Log notification
    // await db.notificationLog.create({ ... });

    return true;
}

/**
 * Notification event handlers
 */

export async function notifyNewRfq(opsUserId: string, rfqId: string, category: string): Promise<void> {
    await sendPushNotification({
        userId: opsUserId,
        type: 'NEW_RFQ',
        title: '📋 New RFQ Assigned',
        body: `New RFQ in ${category} needs your attention`,
        data: { rfqId, route: `/mobile/ops/rfqs/${rfqId}` },
    });
}

export async function notifyOrderStatusChange(
    userId: string,
    orderId: string,
    newStatus: string,
    productName: string
): Promise<void> {
    await sendPushNotification({
        userId,
        type: 'ORDER_STATUS_CHANGE',
        title: `📦 Order ${newStatus}`,
        body: `Your order for ${productName} is now ${newStatus}`,
        data: { orderId, route: `/mobile/buyer/orders/${orderId}` },
    });
}

export async function notifyShipmentUpdate(
    buyerId: string,
    orderId: string,
    status: string
): Promise<void> {
    const statusMessages: Record<string, string> = {
        PICKED_UP: 'Your package has been picked up',
        IN_TRANSIT: 'Your package is on the way',
        OUT_FOR_DELIVERY: 'Your package is out for delivery today',
        DELIVERED: 'Your package has been delivered',
    };

    await sendPushNotification({
        userId: buyerId,
        type: 'SHIPMENT_UPDATE',
        title: `🚚 Delivery Update`,
        body: statusMessages[status] || `Shipment status: ${status}`,
        data: { orderId, route: `/mobile/buyer/orders/${orderId}/tracking` },
    });
}

export async function notifyMessageReceived(
    userId: string,
    senderName: string,
    preview: string
): Promise<void> {
    await sendPushNotification({
        userId,
        type: 'MESSAGE_RECEIVED',
        title: `💬 ${senderName}`,
        body: preview.substring(0, 100),
        data: { route: '/mobile/messages' },
    });
}

export async function notifyPayoutApproved(
    userId: string,
    amount: number
): Promise<void> {
    await sendPushNotification({
        userId,
        type: 'PAYOUT_APPROVED',
        title: '💰 Payout Approved',
        body: `₦${(amount / 100).toLocaleString()} has been approved for payout`,
        data: { route: '/mobile/wallet' },
    });
}

export async function notifyEarningUnlocked(
    agentUserId: string,
    amount: number,
    reason: string
): Promise<void> {
    await sendPushNotification({
        userId: agentUserId,
        type: 'EARNING_UNLOCKED',
        title: '🎉 Earning Unlocked',
        body: `₦${(amount / 100).toLocaleString()} - ${reason}`,
        data: { route: '/mobile/growth/earnings' },
    });
}

/**
 * NOTIFICATION CONFIGURATION
 * Stored per user, controls what they receive
 */
export interface NotificationPreferences {
    newRfq: boolean;
    orderUpdates: boolean;
    shipmentUpdates: boolean;
    messages: boolean;
    payouts: boolean;
    marketing: boolean;
}

export const DEFAULT_PREFERENCES: Record<string, NotificationPreferences> = {
    OPS: {
        newRfq: true,
        orderUpdates: true,
        shipmentUpdates: true,
        messages: true,
        payouts: false,
        marketing: false,
    },
    SUPPLIER: {
        newRfq: false,
        orderUpdates: true,
        shipmentUpdates: false,
        messages: true,
        payouts: true,
        marketing: false,
    },
    BUYER: {
        newRfq: false,
        orderUpdates: true,
        shipmentUpdates: true,
        messages: true,
        payouts: false,
        marketing: true,
    },
    GROWTH_AGENT: {
        newRfq: false,
        orderUpdates: false,
        shipmentUpdates: false,
        messages: true,
        payouts: true,
        marketing: false,
    },
};
