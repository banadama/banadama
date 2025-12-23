import { getNotificationSettings } from "@/lib/notificationSettings";

export function notifyNewMessage() {
    const s = getNotificationSettings();

    if (s.sound) {
        try {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            if (AudioContextClass) {
                const ctx = new AudioContextClass();
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = "sine";
                o.frequency.value = 740;
                g.gain.value = 0.04;
                o.connect(g);
                g.connect(ctx.destination);
                o.start();
                setTimeout(() => {
                    o.stop();
                    ctx.close();
                }, 120);
            }
        } catch { }
    }

    if (s.vibration && "vibrate" in navigator) {
        try { (navigator as any).vibrate(120); } catch { }
    }
}
