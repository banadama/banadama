# Banadama Platform Restructure - Route Conflict Resolution

## Issue
Next.js route groups `(name)` do not create URL segments. This means:
- `/(public)/page.tsx` → `/`
- `/(dashboard)/page.tsx` → `/` (CONFLICT!)
- `/(public)/market/page.tsx` → `/market`
- `/(dashboard)/market/page.tsx` → `/market` (CONFLICT!)

## Solution
We need to use actual path segments for dashboard and admin routes:

### Correct Structure:
```
src/app/
├── layout.tsx (root)
├── page.tsx (splash - root `/`)
├── market/
│   └── page.tsx (public market `/market`)
├── creators/
│   └── page.tsx (public creators `/creators`)
├── pricing/
│   └── page.tsx (public pricing `/pricing`)
├── auth/
│   ├── layout.tsx
│   ├── login/page.tsx (`/auth/login`)
│   ├── register/page.tsx (`/auth/register`)
│   └── callback/route.ts
├── dashboard/
│   ├── layout.tsx (dashboard shell)
│   ├── page.tsx (`/dashboard`)
│   ├── market/page.tsx (`/dashboard/market`)
│   ├── buyer/, factory/, wholesaler/, creator/
│   ├── orders/, shipments/, wallet/, messages/
│   ├── onboarding/, settings/
│   └── b2c-store/
└── admin/
    ├── layout.tsx (admin shell)
    ├── dashboard/page.tsx (`/admin/dashboard`)
    ├── verification/, users/, role-approvals/
    ├── orders/, shipments/, companies/
    └── ...
```

### Changes Needed:
1. Remove route groups `(public)`, `(dashboard)`, `(admin)`
2. Move public pages to root level or specific paths
3. Keep `dashboard/` and `admin/` as actual path segments
4. Update middleware to protect `/dashboard/*` and `/admin/*`

This way:
- Public pages: `/`, `/market`, `/creators`, `/pricing`, `/auth/*`
- Dashboard: `/dashboard`, `/dashboard/market`, `/dashboard/orders`, etc.
- Admin: `/admin/dashboard`, `/admin/orders`, `/admin/shipments`, etc.
