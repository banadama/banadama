# Banadama Codebase Refactoring Plan

## 🎯 ROLE & OBJECTIVES

Senior Next.js 14+ (App Router) engineer refactoring the Banadama codebase into a clean multi-domain structure with strict separation of **Marketplace (Products)** vs **Creatorsmart (Creators)** listings.

### Goals:
1. ✅ Multi-domain routing (banadama.com, supplier.*, ng.*, bd.*, admin.*, ops.*)
2. ✅ Strict listing type separation: `listingType: "product" | "creator"`
3. ✅ Creators NEVER appear in main marketplace product list
4. ✅ Dedicated `/creators` route for creator listings only
5. ✅ Region-scoped browsing (NG, BD, GLOBAL)
6. ✅ Fix Vercel build issues (pnpm locks, API routes, env vars)
7. ✅ Production-ready deployment

---

## 📊 CURRENT STATE AUDIT

### ✅ What Exists (GOOD)

| Component | Status | Details |
|-----------|--------|---------|
| `middleware.ts` | ✅ Implemented | Multi-domain routing (supplier, ng, bd, admin, ops) |
| `/creators` route | ✅ Exists | Creator listings page with filters |
| `/marketplace` route | ✅ Exists | Main product marketplace UI |
| `lib/db.ts` | ✅ Implemented | Prisma wrapper with query() method support |
| Prisma schema | ✅ Complete | Has creator_listings table separate from products |
| Domain detection | ✅ Working | Header-based routing logic |

### ⚠️ What Needs Fixing

| Issue | Impact | Fix |
|-------|--------|-----|
| Marketplace mixes products + creators | HIGH | Add `listingType` filter to queries |
| No canonical listing type field | HIGH | Use DB field or add mapping layer |
| Admin routes not guarded for build | MEDIUM | Ensure API routes don't fetch at build time |
| Environment vars hardcoded | MEDIUM | Use .env.local, add .env.example |
| pnpm-lock.yaml conflicts | MEDIUM | Regenerate and commit single lock file |
| Vercel build cache stale | MEDIUM | Force redeploy via CLI or dashboard |

### 🔴 Critical Constraints

1. **No breaking changes to existing marketplace UI**
2. **Existing creator_listings table must be used as-is** (already has creator data)
3. **Products table must remain unchanged** (already has product data)
4. **Auth system must work for all domains**
5. **Regional filtering must not break NG/BD browsing**

---

## 📂 FOLDER STRUCTURE (TARGET)

```
banadama-platform/
├── app/
│   ├── (auth)/
│   │   ├── auth/login/page.tsx
│   │   ├── auth/register/page.tsx
│   │   └── layout.tsx (shared auth layout)
│   ├── (buyer)/
│   │   ├── marketplace/
│   │   │   ├── page.tsx (products only, no creators)
│   │   │   ├── [category]/page.tsx
│   │   │   └── products/[id]/page.tsx
│   │   └── layout.tsx
│   ├── (creators)/
│   │   ├── creators/
│   │   │   ├── page.tsx (creators only, no products)
│   │   │   ├── [type]/page.tsx (by creator type)
│   │   │   └── [id]/page.tsx (creator profile)
│   │   └── layout.tsx
│   ├── (supplier)/
│   │   ├── supplier/
│   │   │   ├── page.tsx (landing)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── onboarding/page.tsx
│   │   │   ├── products/new/page.tsx (with logistics selection)
│   │   │   └── layout.tsx
│   ├── (admin)/
│   │   ├── admin/page.tsx (stub or redirect)
│   │   └── layout.tsx
│   ├── (ops)/
│   │   ├── ops/page.tsx (stub or redirect)
│   │   └── layout.tsx
│   ├── (regional)/
│   │   ├── ng/page.tsx (Nigeria regional)
│   │   ├── bd/page.tsx (Bangladesh regional)
│   │   └── layout.tsx (injects region context)
│   ├── api/
│   │   ├── auth/route.ts
│   │   ├── marketplace/
│   │   │   ├── products/route.ts (filters: listingType=product)
│   │   │   ├── categories/route.ts
│   │   │   └── search/route.ts
│   │   ├── creators/
│   │   │   ├── listings/route.ts (filters: listingType=creator)
│   │   │   ├── types/route.ts
│   │   │   └── search/route.ts
│   │   └── admin/
│   │       └── accounts/[id]/controls/route.ts (GUARDED)
│   ├── layout.tsx (root, suppressHydrationWarning)
│   ├── page.tsx (landing page)
│   └── globals.css
├── components/
│   ├── marketplace/
│   │   ├── MarketplaceFilters.tsx (products only)
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   ├── creators/
│   │   ├── CreatorFilters.tsx (creators only)
│   │   ├── CreatorCard.tsx
│   │   └── CreatorGrid.tsx
│   ├── navigation/
│   │   ├── MainNav.tsx (includes Creatorsmart link)
│   │   └── MobileNav.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── db.ts (Prisma wrapper)
│   ├── queries/
│   │   ├── marketplace.ts (listingType=product)
│   │   ├── creators.ts (listingType=creator)
│   │   ├── region.ts (region-scoped queries)
│   │   └── utils.ts (shared utilities)
│   └── utils/
│       ├── listing-type.ts (determines listing type)
│       ├── region.ts (region detection)
│       └── validators.ts
├── middleware.ts (multi-domain routing)
├── types/
│   ├── listing.ts (Product | Creator union type)
│   ├── region.ts (Region enum)
│   └── index.ts
├── prisma/
│   ├── schema.prisma (unchanged, already has creator_listings)
│   └── migrations/
├── .env.example (template)
├── .env.local (private, not committed)
├── next.config.mjs (compatible with Next.js 16.1.1)
├── package.json (dependencies locked)
├── pnpm-lock.yaml (SINGLE lock file)
└── vercel.json (deployment config)
```

---

## 🔑 KEY IMPLEMENTATION DETAILS

### 1️⃣ Listing Type Separation

**Database Reality:**
- `products` table: Traditional products (industrial, retail, supplies)
- `creator_listings` table: Creator services (graphic design, video, photography, etc.)

**Implementation Strategy:**
```typescript
// lib/queries/marketplace.ts - PRODUCTS ONLY
export async function getMarketplaceProducts(filters: {
  category?: string;
  region?: 'NG' | 'BD' | 'GLOBAL';
  logistics?: 'local' | 'international';
}) {
  // Query products table
  // Filter: status = ACTIVE
  // Filter: listingType = 'product' (if field exists)
  // Filter: category in [industrial, retail, supplies]
  // Filter: region matches (NG/BD scoping)
}

// lib/queries/creators.ts - CREATORS ONLY
export async function getCreatorListings(filters: {
  type?: 'DIGITAL' | 'LOCAL_SERVICE';
  creatorType?: string;
  region?: 'NG' | 'BD' | 'GLOBAL';
}) {
  // Query creator_listings table
  // Filter: status = ACTIVE
  // Filter: listingType = 'creator' (already implicit)
  // Filter: type matches
  // Filter: region matches (DIGITAL = global, LOCAL_SERVICE = region)
}
```

### 2️⃣ Region Context

**Middleware Detection:**
```typescript
// middleware.ts - extracts region from host
function getDomainInfo(host: string) {
  if (host.includes('ng.')) return { type: 'regional', region: 'NG' };
  if (host.includes('bd.')) return { type: 'regional', region: 'BD' };
  return { type: 'main', region: 'GLOBAL' };
}

// Adds x-region header to all requests
// Pages access via: headers().get('x-region') or context
```

**Query Application:**
```typescript
// In pages/marketplace/page.tsx
const region = headers().get('x-region') || 'GLOBAL';
const products = await getMarketplaceProducts({
  category: searchParams.category,
  region: region as 'NG' | 'BD' | 'GLOBAL',
});
```

### 3️⃣ Navigation Structure

**Main Marketplace Header (banadama.com):**
```
[Logo] [Search]
  [Industrial] [Retail] [Supplies] [Creatorsmart] [Login/User]
           ↑ Product category tabs
                                 ↑ Link to /creators (NO filter)
```

**Creatorsmart Navigation (/creators):**
```
[Logo] [Search]
  [Digital] [Local Service] [Design] [Photo] [Video] [Login/User]
  ↑ Creator type filters
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Data Layer (lib/queries/)

- [ ] Create `lib/queries/marketplace.ts` with `getMarketplaceProducts()`
  - [ ] Filters: category, region, logistics
  - [ ] Ensure listingType = 'product' or category filters out creators
  - [ ] Add pagination support
  - [ ] Add search support

- [ ] Create `lib/queries/creators.ts` with `getCreatorListings()`
  - [ ] Filters: type (DIGITAL/LOCAL_SERVICE), creatorType, region
  - [ ] Ensure only creator_listings table
  - [ ] Add pagination and search
  - [ ] Region logic: DIGITAL global, LOCAL_SERVICE region-scoped

- [ ] Create `lib/queries/region.ts`
  - [ ] `getRegionFromHeaders()` utility
  - [ ] Region-scoped product filtering
  - [ ] Region-scoped creator service filtering

- [ ] Update `lib/db.ts` (if needed)
  - [ ] Ensure Prisma client is correctly exported
  - [ ] No changes needed if working properly

### Phase 2: API Routes (app/api/)

- [ ] Create `app/api/marketplace/products/route.ts`
  - [ ] GET endpoint: returns products (listingType=product)
  - [ ] Add region, category, search params
  - [ ] Add error handling and pagination

- [ ] Create `app/api/marketplace/categories/route.ts`
  - [ ] GET endpoint: returns [Industrial, Retail, Supplies]
  - [ ] No creators categories

- [ ] Create `app/api/creators/listings/route.ts`
  - [ ] GET endpoint: returns creator_listings only
  - [ ] Add type, creatorType, region params
  - [ ] Add error handling and pagination

- [ ] Create `app/api/creators/types/route.ts`
  - [ ] GET endpoint: returns creator types (design, video, etc.)

- [ ] Guard `app/api/admin/...` routes
  - [ ] Add `if (process.env.NODE_ENV === 'build')` guards
  - [ ] Ensure no data fetching at build time
  - [ ] Add auth checks for non-build requests

### Phase 3: Pages (app/)

- [ ] Update `app/marketplace/page.tsx`
  - [ ] Remove creator listings from product grid
  - [ ] Call `getMarketplaceProducts()` only
  - [ ] Keep existing UI, only change data source
  - [ ] Add "Creatorsmart" link in navigation (→ /creators)
  - [ ] Mark as `force-dynamic` (runtime rendering)

- [ ] Update `app/creators/page.tsx`
  - [ ] Ensure calls `getCreatorListings()` only
  - [ ] Creator-specific filters (type, creatorType)
  - [ ] No product categories visible
  - [ ] Mark as `force-dynamic`

- [ ] Create `app/(supplier)/supplier/products/new/page.tsx` (if missing)
  - [ ] Form: "Add New Product"
  - [ ] Dropdown: Logistics Type (Local / International)
  - [ ] Submit creates product with logistics field

- [ ] Create `app/(regional)/ng/page.tsx` (if missing)
  - [ ] Region = NG
  - [ ] Shows products where region=NG OR logistics=international
  - [ ] Shows local creator services only for NG

- [ ] Create `app/(regional)/bd/page.tsx` (if missing)
  - [ ] Region = BD
  - [ ] Same logic as NG but for BD

### Phase 4: Navigation & Components

- [ ] Update `components/navigation/MainNav.tsx`
  - [ ] Add "Creatorsmart" link → `/creators`
  - [ ] Style matching dark forest green (#3d5c4f)
  - [ ] Not a filter tab, but a separate section link

- [ ] Create `components/marketplace/MarketplaceFilters.tsx` (if needed)
  - [ ] Only show product categories (Industrial, Retail, Supplies)
  - [ ] No creator type filters

- [ ] Create `components/creators/CreatorFilters.tsx` (if needed)
  - [ ] Creator-specific filters (type, creatorType, region)
  - [ ] No product categories

### Phase 5: Middleware & Context

- [ ] Update `middleware.ts`
  - [ ] ✅ Already implemented mostly
  - [ ] Ensure all 6 domains handled (main, supplier, ng, bd, admin, ops)
  - [ ] Verify headers set correctly (x-domain-type, x-region)
  - [ ] Add logging for development debugging

- [ ] Create `lib/utils/region.ts`
  - [ ] `getRegionFromHeaders(headers)` function
  - [ ] `getRegionFromHost(host)` function
  - [ ] Export region type constants

### Phase 6: Build & Deployment

- [ ] Fix pnpm locks
  - [ ] Run `pnpm install` to regenerate pnpm-lock.yaml
  - [ ] Remove package-lock.json (use pnpm only)
  - [ ] Commit pnpm-lock.yaml

- [ ] Fix environment variables
  - [ ] Create `.env.example` with all required vars
  - [ ] Ensure `.env.local` is in `.gitignore`
  - [ ] Document all env vars needed

- [ ] Update `next.config.mjs`
  - [ ] Ensure no deprecated options (already done in v16.1.1)
  - [ ] Check turbopack root config
  - [ ] Verify serverExternalPackages: ["@prisma/client"]

- [ ] Test Vercel build locally
  - [ ] `npm run build` (or pnpm build)
  - [ ] Verify no errors
  - [ ] Check bundle size

- [ ] Deploy to Vercel
  - [ ] Push commits to origin/main
  - [ ] Trigger manual redeploy on Vercel dashboard
  - [ ] Verify all domains working

---

## 📋 FILES TO CREATE/MODIFY

### Create (NEW FILES)

```
lib/queries/marketplace.ts          (200 lines - product queries)
lib/queries/creators.ts             (250 lines - creator queries)
lib/queries/region.ts               (100 lines - region utilities)
lib/utils/region.ts                 (50 lines - helper functions)
app/api/marketplace/products/route.ts (100 lines - API endpoint)
app/api/marketplace/categories/route.ts (50 lines - API endpoint)
app/api/creators/listings/route.ts  (100 lines - API endpoint)
app/api/creators/types/route.ts     (50 lines - API endpoint)
app/(regional)/ng/page.tsx          (100 lines - Nigeria region page)
app/(regional)/bd/page.tsx          (100 lines - Bangladesh region page)
types/listing.ts                    (50 lines - type definitions)
.env.example                        (30 lines - template)
```

### Modify (EXISTING FILES)

```
middleware.ts                       (verify region header logic)
app/marketplace/page.tsx            (add Creatorsmart link, use getMarketplaceProducts)
app/creators/page.tsx               (verify uses getCreatorListings only)
components/navigation/MainNav.tsx   (add Creatorsmart link)
app/(supplier)/supplier/products/new/page.tsx (add logistics selector if missing)
next.config.mjs                     (verify Next.js 16 compatibility)
.gitignore                          (ensure .env.local, pnpm-lock listed)
package.json                        (ensure pnpm as package manager)
```

### Delete (OBSOLETE)

```
package-lock.json                   (use pnpm-lock.yaml only)
app/supplier/page.tsx               (if duplicate with (supplier)/supplier)
app/landing/page.tsx                (if old landing exists)
```

---

## 🔧 IMPLEMENTATION PRIORITY

### 🔴 CRITICAL (DO FIRST)

1. **Fix pnpm locks** → Run `pnpm install`, commit lock
2. **Create query separation layer** → lib/queries/marketplace.ts + creators.ts
3. **Update marketplace query** → Filter out creators
4. **Update creators query** → Filter only creators
5. **Add region context helper** → lib/utils/region.ts
6. **Update navigation** → Add Creatorsmart link

### 🟠 HIGH (DO SECOND)

7. **Create API routes** → /api/marketplace/products, /api/creators/listings
8. **Create regional pages** → app/(regional)/ng/page.tsx, bd/page.tsx
9. **Guard admin routes** → Prevent build-time data fetching
10. **Update next.config.mjs** → Final Vercel compatibility check

### 🟡 MEDIUM (DO THIRD)

11. **Update navigation components** → MainNav, filters
12. **Create type definitions** → types/listing.ts
13. **Create .env.example** → Template for deployment
14. **Add Vercel logs monitoring** → Watch build for errors

### 🟢 LOW (DO LAST)

15. **Add analytics/logging** → Track listing type separation
16. **Create documentation** → Admin guide for listing types
17. **Add tests** (optional) → Query logic tests

---

## 🚀 VERIFICATION CHECKLIST (POST-IMPLEMENTATION)

- [ ] Local dev server runs without errors (`npm run dev`)
- [ ] `/marketplace` shows ONLY products (no creators visible in grid)
- [ ] `/creators` shows ONLY creators (no products visible)
- [ ] "Creatorsmart" link in marketplace nav goes to `/creators`
- [ ] `/supplier` domain routes to `/supplier/...` correctly
- [ ] `/ng` shows NG region products
- [ ] `/bd` shows BD region products
- [ ] `/admin` and `/ops` show stubs or redirects (no 404s)
- [ ] Build passes locally: `npm run build` ✅
- [ ] Vercel build succeeds without errors
- [ ] All 6 domains accessible in production
- [ ] No creators in main marketplace API response
- [ ] Creators API only returns creators
- [ ] Region filtering works (NG, BD, GLOBAL)
- [ ] Pagination and search functional

---

## 📞 QUESTIONS BEFORE STARTING

1. **Database**: Is creator_listings table already in your Supabase database?
   - If YES: We map to existing table
   - If NO: We need to create it via Prisma migration

2. **Logistics field**: Does products table have a "logistics" or "shipmentType" field?
   - If YES: Use existing field
   - If NO: Add it via migration or fallback to metadata column

3. **Regional scoping**: Should products have a "region" field, or infer from seller country?
   - If field exists: Use it directly
   - If not: Infer from seller profile region

4. **Creators global vs local**: Are digital creators always global (DIGITAL = worldwide)?
   - Assumed YES based on enum CreatorListingType

5. **Launch timeline**: Do you need this in production immediately, or staged rollout?
   - ASAP: Push all at once
   - Staged: Deploy creators to `/creators` first, then remove from marketplace

---

## 🎬 NEXT STEPS

1. **Review this document** → Confirm all assumptions with your product/design team
2. **Answer the 5 questions above** → Clarify database/field assumptions
3. **Phase 1 implementation** → Start with data layer (queries)
4. **Phase 2-3 implementation** → API routes + pages
5. **Local testing** → Verify behavior before Vercel push
6. **Vercel deployment** → Final production rollout

---

**Document Version:** 1.0  
**Last Updated:** Dec 29, 2025  
**Status:** Ready for Implementation
