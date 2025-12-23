export async function registerServiceWorker() {
    if (typeof window === "undefined") return null;
    if (!("serviceWorker" in navigator)) return null;
    return navigator.serviceWorker.register("/sw.js");
}
