import webpush from "web-push";
import { db } from "@/lib/db";

const PUBLIC = process.env.VAPID_PUBLIC_KEY!;
const PRIVATE = process.env.VAPID_PRIVATE_KEY!;
const SUBJECT = process.env.VAPID_SUBJECT || "mailto:support@banadama.com";

// Only set details if keys are present to avoid startup crashes if env missing
if (PUBLIC && PRIVATE) {
    webpush.setVapidDetails(SUBJECT, PUBLIC, PRIVATE);
}

export async function sendPushToAccount(accountId: string, payload: any) {
    if (!PUBLIC || !PRIVATE) {
        console.warn("VAPID keys not configured, skipping push.");
        return;
    }

    const subs = await db.query(
        `SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE account_id=$1`,
        [accountId]
    );

    const body = JSON.stringify(payload);

    for (const s of subs ?? []) {
        try {
            await webpush.sendNotification(
                {
                    endpoint: s.endpoint,
                    keys: { p256dh: s.p256dh, auth: s.auth },
                } as any,
                body
            );
        } catch (e: any) {
            // If subscription expired (410/404), delete it
            const code = e?.statusCode;
            if (code === 404 || code === 410) {
                await db.query(`DELETE FROM push_subscriptions WHERE endpoint=$1`, [s.endpoint]);
            } else {
                console.error("Push send error:", e);
            }
        }
    }
}
