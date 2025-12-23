// DEPLOY CHECKLIST - BANADAMA PUSH NOTIFICATIONS
// ================================================
// This file documents the deployment requirements for push notifications.
// Copy the VAPID keys from vapid.env to your production .env file.

/*
===================================================================
                     DEPLOY CHECKLIST
===================================================================

1. HTTPS + Domain (mandatory)
   ☐ Deploy on a real domain with HTTPS
   ☐ Ensure https://yourdomain.com/sw.js returns 200 (not redirect)
   ☐ No mixed content (all APIs, images, assets over HTTPS)

2. VAPID Keys + Env
   ☐ Copy keys from vapid.env to production .env:
      - VAPID_PUBLIC_KEY
      - VAPID_PRIVATE_KEY  
      - VAPID_SUBJECT=mailto:support@banadama.com
      - NEXT_PUBLIC_VAPID_PUBLIC_KEY (must match VAPID_PUBLIC_KEY)
   ☐ Confirm env exists in production runtime

3. Service Worker
   ✓ File location: public/sw.js (serves at /sw.js)
   ✓ SW scope: default "/" 
   ✓ Minimal SW for push (push + notificationclick handlers)

4. Icons
   ✓ public/icons/icon-192.png
   ✓ public/icons/icon-512.png
   ✓ public/icons/badge-72.png
   ✓ SW references correct paths

5. Web App Manifest
   ✓ public/manifest.webmanifest created
   ✓ Contains name, short_name, icons (192+512)
   ✓ start_url: "/", display: "standalone"
   ✓ Link added to root layout

6. Database
   ✓ push_subscriptions table defined in Prisma schema
   ☐ Run: npx prisma db push (after connecting to production DB)

7. Backend Push Send
   ✓ lib/push/sendPush.ts handles sending
   ✓ Deletes stale subscriptions on 404/410 errors
   ✓ Triggers on Ops→Buyer dispute messages

8. Notification Permission UX
   ✓ Permission request only after "Enable Push" click
   ✓ Toast feedback on success/failure

9. CSP Headers (if applicable)
   Ensure these are allowed:
   - worker-src 'self' (for service worker)
   - connect-src 'self' https: (for API + push endpoints)

10. Cache Headers
    ☐ Set Cache-Control: no-cache for /sw.js in production

===================================================================
                  PRODUCTION VERIFICATION
===================================================================

1. Open DevTools → Application → Service Workers
   ☐ SW registered and running

2. Click "Enable Push" in Settings
   ☐ Permission granted
   ☐ Subscription saved in DB

3. Trigger test push (send a dispute message)
   ☐ Notification shows when tab is closed

4. Click notification
   ☐ Opens correct URL

===================================================================
*/

export { };
