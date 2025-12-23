self.addEventListener("push", (event) => {
    let data = {};
    try { data = event.data ? event.data.json() : {}; } catch { }

    const title = data.title || "Banadama";
    const options = {
        body: data.body || "You have a new update.",
        icon: "/icons/icon-192.png",
        badge: "/icons/badge-72.png",
        data: data.data || {}, // e.g. { url: "/buyer/creator-orders/..." }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification?.data?.url || "/";
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
            for (const c of list) {
                if ("focus" in c) return (c as any).focus();
            }
            if ((clients as any).openWindow) return (clients as any).openWindow(url);
        })
    );
});
