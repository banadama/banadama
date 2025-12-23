"use client";

import * as React from "react";
import { getNotificationSettings, setNotificationSettings } from "@/lib/notificationSettings";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";
import { enablePush, disablePush } from "@/lib/push/subscribe";

export function NotificationSettingsCard() {
    const toast = useToast();
    const [sound, setSound] = React.useState(false);
    const [vibration, setVibration] = React.useState(false);

    React.useEffect(() => {
        const s = getNotificationSettings();
        setSound(s.sound);
        setVibration(s.vibration);
    }, []);

    function save(nextSound: boolean, nextVibration: boolean) {
        setNotificationSettings({ sound: nextSound, vibration: nextVibration });
    }

    function test() {
        const s = getNotificationSettings();
        if (s.sound) {
            // simple beep using Web Audio (no external file)
            try {
                const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
                if (AudioContextClass) {
                    const ctx = new AudioContextClass();
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.type = "sine";
                    o.frequency.value = 880;
                    g.gain.value = 0.04;
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.start();
                    setTimeout(() => {
                        o.stop();
                        ctx.close();
                    }, 140);
                }
            } catch { }
        }
        if (s.vibration && "vibrate" in navigator) {
            try { (navigator as any).vibrate([80, 40, 80]); } catch { }
        }
        toast.push({ type: "info", title: "Test notification sent" });
    }

    async function handleEnablePush() {
        try {
            const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!key) throw new Error("Push is not configured on this server");
            await enablePush(key);
            toast.push({ type: "success", title: "Push enabled", message: "You'll receive notifications for new messages." });
        } catch (e: any) {
            if (e.message?.includes("denied")) {
                toast.push({
                    type: "error",
                    title: "Permission denied",
                    message: "To enable push, allow notifications in your browser settings."
                });
            } else {
                toast.push({ type: "error", title: "Failed to enable push", message: e.message });
            }
        }
    }

    async function handleDisablePush() {
        try {
            await disablePush();
            toast.push({ type: "success", title: "Push disabled" });
        } catch (e: any) {
            toast.push({ type: "error", title: "Failed to disable push", message: e.message });
        }
    }

    return (
        <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 950, fontSize: 16 }}>Message Notifications</div>
            <div style={{ color: "var(--bd-muted)", fontSize: 13, lineHeight: 1.6 }}>
                Control optional sound and vibration for new message alerts. (Default: off)
            </div>

            <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                <input
                    type="checkbox"
                    checked={sound}
                    onChange={(e) => {
                        const v = e.target.checked;
                        setSound(v);
                        save(v, vibration);
                    }}
                />
                <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Icons.Volume2 size={16} /> Sound
                </span>
            </label>

            <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                <input
                    type="checkbox"
                    checked={vibration}
                    onChange={(e) => {
                        const v = e.target.checked;
                        setVibration(v);
                        save(sound, v);
                    }}
                />
                <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Icons.Vibrate size={16} /> Vibration (mobile)
                </span>
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                <button className="bd-btn" onClick={test}>
                    <Icons.Bell size={18} /> Test
                </button>
                <div style={{ flex: 1 }} />
                <button className="bd-btn" onClick={handleEnablePush}>
                    Enable Push
                </button>
                <button className="bd-btn" onClick={handleDisablePush}>
                    Disable Push
                </button>
            </div>
        </div>
    );
}
