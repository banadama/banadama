export type NotificationSettings = {
    sound: boolean;
    vibration: boolean;
};

const KEY = "banadama:notif_settings:v1";

export function getNotificationSettings(): NotificationSettings {
    if (typeof window === "undefined") return { sound: false, vibration: false };
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return { sound: false, vibration: false };
        const parsed = JSON.parse(raw);
        return {
            sound: !!parsed.sound,
            vibration: !!parsed.vibration,
        };
    } catch {
        return { sound: false, vibration: false };
    }
}

export function setNotificationSettings(next: NotificationSettings) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(next));
}
