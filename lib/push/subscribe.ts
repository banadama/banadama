import { registerServiceWorker } from "./register";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    const out = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
}

export async function enablePush(vapidPublicKey: string) {
    const reg = await registerServiceWorker();
    if (!reg) throw new Error("Service Worker not supported");

    const perm = await Notification.requestPermission();
    if (perm !== "granted") throw new Error("Permission denied");

    const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    const json = sub.toJSON();
    const body = {
        endpoint: sub.endpoint,
        keys: json.keys, // { p256dh, auth }
    };

    const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Subscribe failed");

    return true;
}

export async function disablePush() {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
        await fetch("/api/push/unsubscribe", {
            method: "POST",
            headers: { "content-type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
    }
}
