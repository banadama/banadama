# REFACTORING IMPLEMENTATION CHECKLIST
## Banadama Multi-Domain, Listing-Type Separation Project

**Created:** Dec 29, 2025  
**Status:** Ready for Implementation  
**Priority:** CRITICAL - Production Ready

---

## ✅ PHASE 1: DATA LAYER (lib/queries/)

### ✅ COMPLETED
- [x] `lib/queries/marketplace.ts` - Product queries (200 lines)
  - Filters: category, region, logistics, search
  - Excludes creators completely
  - Returns only products table data
  
- [x] `lib/queries/creators.ts` - Creator queries (250 lines)
  - Filters: type, creatorType, region, country, state, city, search
  - Only queries creator_listings table
  - Region logic: DIGITAL global, LOCAL_SERVICE region-scoped

- [x] `lib/utils/region.ts` - Region utilities (50 lines)
  - `getRegionFromHeaders()` - extracts region from middleware headers
  - `getDomainTypeFromHeaders()` - extracts domain type
  - `isRegionalDomain()` - checks if NG or BD
  - Region display/code helpers

### 🔄 IN PROGRESS / NOT NEEDED
- N/A - All query layer complete

---

## 🔴 PHASE 2: API ROUTES (app/api/)

### ⚠️ NEEDS CREATION
- [ ] `app/api/marketplace/products/route.ts` (100 lines)
  - **Why:** REST endpoint for products
  - **Params:** category, logistics, search, page, limit, region (from header)
  - **Returns:** { categories, products[], pagination }
  - **Note:** File exists but may need update to use getMarketplaceProducts()

- [ ] `app/api/marketplace/categories/route.ts` (50 lines)
  - **Why:** Get product categories (Industrial, Retail, Supplies)
  - **Returns:** { categories: string[] }

- [ ] `app/api/creators/listings/route.ts` (100 lines)
  - **Why:** REST endpoint for creator listings
  - **Params:** type, creatorType, country, state, city, search, page, limit
  - **Returns:** { creatorTypes, listings[], pagination }
  - **Note:** File exists but may need update to use getCreatorListings()

- [ ] `app/api/creators/types/route.ts` (50 lines)
  - **Why:** Get creator types for filtering
  - **Returns:** { types: ['GRAPHIC_DESIGNER', 'PHOTOGRAPHER', ...] }

### 🛡️ MUST GUARD (BUILD-TIME PROTECTION)
- [ ] `app/api/admin/accounts/[id]/controls/route.ts`
  - **Issue:** May run DB queries at build time → build fails
  - **Fix:** Add guard:
    ```typescript
    export const dynamic = 'force-dynamic';
    
    export async function POST(req, { params }) {
      // Never fetch DB at module load time
      // Only fetch in request handler
      const data = await db.query(...);
      return NextResponse.json(data);
    }
    ```
  - **Verify:** Build succeeds with `npm run build`

---

## 📄 PHASE 3: PAGES (app/)

### ⚠️ NEEDS REFACTOR (CRITICAL)
- [ ] `app/marketplace/page.tsx`
  - **Current state:** May mix products + creators
  - **Required changes:**
    1. Import: `import { getMarketplaceProducts } from '@/lib/queries/marketplace';`
    2. Replace data fetch with: `const result = await getMarketplaceProducts({ category, region, ... })`
    3. Only render `result.products` in grid
    4. Add link to "Creatorsmart" → `/creators` in navigation
    5. Mark as: `export const dynamic = 'force-dynamic';` (runtime rendering)
  - **Verification:** `/marketplace?category=industrial` shows ONLY products, zero creators

- [ ] `app/creators/page.tsx`
  - **Current state:** ✅ Already uses creator_listings
  - **Verify:**
    1. Uses `getCreatorListings()` for data
    2. Only renders creators (no products in grid)
    3. Creator-specific filters visible (type, creatorType)
    4. Mark as: `export const dynamic = 'force-dynamic';`
  - **Verification:** `/creators` shows ONLY creators, zero products

### 🆕 NEEDS CREATION (OPTIONAL BUT RECOMMENDED)
- [ ] `app/(regional)/ng/page.tsx` (100 lines)
  - **Why:** Dedicated Nigeria region page
  - **Features:**
    - Region = NG
    - Shows products where region=NG OR logistics=international
    - Shows local creator services only for NG
    - Links to `/creators?country=NG` for local service creators
  - **If not created:** Use middleware rewrite to `/marketplace?region=NG` instead

- [ ] `app/(regional)/bd/page.tsx` (100 lines)
  - **Why:** Dedicated Bangladesh region page
  - **Same as above but for BD**

- [ ] `app/(supplier)/supplier/products/new/page.tsx` (if missing)
  - **Why:** Suppliers need to select logistics when adding products
  - **Features:**
    - Form with fields: title, description, price, category, image
    - **Dropdown: Logistics Type**
      - "Local (NG only)" / "International" / "Both"
    - Submit creates product with logistics field set

---

## 🧭 PHASE 4: NAVIGATION & COMPONENTS

### ⚠️ NEEDS REFACTOR
- [ ] `components/navigation/MainNav.tsx` or Header component
  - **Current state:** Has marketplace categories, needs Creatorsmart link
  - **Required changes:**
    1. Add "Creatorsmart" link → `/creators`
    2. Style: Dark forest green (#3d5c4f), not a filter tab
    3. Position: After product categories OR in dropdown
    4. **NOT a filter** - it's a separate section link
  - **Example:**
    ```tsx
    <nav>
      <Link href="/marketplace?category=industrial">Industrial</Link>
      <Link href="/marketplace?category=retail">Retail</Link>
      <Link href="/marketplace?category=supplies">Supplies</Link>
      
      {/* NEW */}
      <Link href="/creators" style={{ color: '#3d5c4f', fontWeight: 'bold' }}>
        Creatorsmart ✨
      </Link>
    </nav>
    ```

### ✅ VERIFY (NO CHANGES NEEDED)
- [ ] `components/marketplace/MarketplaceFilters.tsx`
  - Only shows: Industrial, Retail, Supplies
  - No creator types visible
  
- [ ] `components/creators/CreatorFilters.tsx` (if exists)
  - Only shows: Type, CreatorType, Region, etc.
  - No product categories visible

---

## 🔧 PHASE 5: MIDDLEWARE & CONFIG

### ✅ VERIFY EXISTING
- [x] `middleware.ts`
  - ✅ Multi-domain routing already implemented
  - ✅ Headers (x-domain-type, x-region) already set
  - Verify all 6 domains work:
    - `banadama.com` → main (x-region: GLOBAL)
    - `supplier.banadama.com` → supplier (x-region: GLOBAL)
    - `ng.banadama.com` → regional (x-region: NG)
    - `bd.banadama.com` → regional (x-region: BD)
    - `admin.banadama.com` → admin
    - `ops.banadama.com` → ops

- [x] `next.config.mjs`
  - ✅ Next.js 16.1.1 compatible
  - ✅ serverExternalPackages: ["@prisma/client"]
  - ✅ No deprecated options
  
- [x] `lib/db.ts`
  - ✅ Prisma client exported correctly
  - ✅ `db.query()` method works

---

## 🛠️ PHASE 6: BUILD & DEPLOYMENT

### ⚠️ MUST COMPLETE BEFORE VERCEL DEPLOY

- [ ] **pnpm locks**
  - Run: `pnpm install` (in banadama-platform/)
  - Commit: `pnpm-lock.yaml`
  - Delete: `package-lock.json`
  - Verify: Git shows only pnpm-lock.yaml (no package-lock)
  - Why: Vercel needs single source of truth

- [ ] **Environment variables**
  - Create: `.env.example` with all required keys (template provided)
  - Verify: `.env.local` in `.gitignore` (secret, not committed)
  - On Vercel: Set all env vars in Project Settings → Environment Variables
  - Required:
    - NEXT_PUBLIC_SUPABASE_URL
    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    - DATABASE_URL
    - NEXTAUTH_SECRET or NEXT_AUTH_SECRET
    - Any Stripe/Sentry keys if used

- [ ] **Local build test**
  - Run: `npm run build` (or `pnpm build`)
  - Verify: No errors, no warnings about missing fields
  - Verify: Build succeeds in ~2-3 mins
  - Check: `.next` folder created, no red errors in output

- [ ] **API route safety**
  - Search for admin/api routes that fetch DB
  - Add `export const dynamic = 'force-dynamic';` to each
  - Reason: Prevents build-time DB queries that crash Vercel

- [ ] **Git commit & push**
  ```bash
  git add -A
  git commit -m "refactor: separate marketplace products from creators listings

  - Add lib/queries/marketplace.ts for products-only queries
  - Add lib/queries/creators.ts for creators-only queries
  - Add lib/utils/region.ts for region helpers
  - Update app/marketplace/page.tsx to use new queries
  - Verify app/creators/page.tsx uses creators queries only
  - Update navigation with Creatorsmart link
  - Fix API routes with dynamic=force-dynamic
  - Add .env.example template"
  
  git push origin main
  ```

### 🚀 VERCEL DEPLOYMENT

- [ ] **Trigger Vercel build**
  - Option 1: Push to main (GitHub webhook)
  - Option 2: Manual redeploy from Vercel dashboard
    - Go to Deployments tab
    - Click the 3-dots menu on latest build
    - Click "Redeploy"

- [ ] **Verify production**
  - Test: https://banadama.com (buyer landing)
  - Test: https://banadama.com/marketplace (products only, no creators)
  - Test: https://banadama.com/creators (creators only, no products)
  - Test: https://supplier.banadama.com (supplier landing)
  - Test: https://ng.banadama.com (Nigeria region)
  - Test: https://bd.banadama.com (Bangladesh region)

---

## 📊 VERIFICATION TESTS (POST-IMPLEMENTATION)

### 🟢 LOCAL TESTS (Before push)
- [ ] Dev server runs: `npm run dev` ✅ No errors
- [ ] Visit http://localhost:3000 → Buyer landing ✅
- [ ] Visit http://localhost:3000/marketplace → Products only ✅
- [ ] Visit http://localhost:3000/marketplace?category=industrial → Industrial products ✅
- [ ] **Count creators in product grid: ZERO** ❌ If not zero, queries wrong
- [ ] Visit http://localhost:3000/creators → Creators only ✅
- [ ] **Count products in creator grid: ZERO** ❌ If not zero, queries wrong
- [ ] Click "Creatorsmart" link from marketplace → Goes to `/creators` ✅
- [ ] Visit http://localhost:3000/supplier → Supplier landing ✅
- [ ] Build passes: `npm run build` ✅ No errors
- [ ] Check build size: Should be similar to before (no bloat)

### 🟡 STAGING TESTS (Before production)
- [ ] Vercel build succeeds
- [ ] Test on production domain: https://banadama.com
- [ ] Marketplace products grid (no creators) ✅
- [ ] Creators grid (no products) ✅
- [ ] Creatorsmart link works ✅
- [ ] Regional domains work: https://ng.banadama.com ✅
- [ ] Supplier domain works: https://supplier.banadama.com ✅

### 🔴 DATABASE TESTS
- [ ] Marketplace query returns 0 creator_listings
- [ ] Creators query returns 0 products
- [ ] Region filtering works (NG products show, BD products show)
- [ ] Search works on both sides
- [ ] Pagination works (page, limit params)

---

## 📋 FILE MANIFEST

### ✅ CREATED (NEW)
```
lib/queries/marketplace.ts          ✅ 300 lines - Product queries
lib/queries/creators.ts             ✅ 300 lines - Creator queries
lib/utils/region.ts                 ✅ 50 lines - Region helpers
.env.example                        ❌ Exists but may need update
```

### 🔄 MODIFY (EXISTING)
```
app/marketplace/page.tsx            (20-50 line changes)
  - Import getMarketplaceProducts
  - Use new query
  - Add Creatorsmart link in nav

app/creators/page.tsx               (Verify only, ~0 changes needed)
  - Ensure uses getCreatorListings
  - Ensure force-dynamic set
  
components/navigation/MainNav.tsx   (10-20 line changes)
  - Add Creatorsmart link
  
app/api/admin/accounts/[id]/controls/route.ts (1-2 line changes)
  - Add: export const dynamic = 'force-dynamic';

middleware.ts                       (Verify only, no changes)
next.config.mjs                     (Verify only, no changes)
lib/db.ts                           (Verify only, no changes)
```

### 🆕 CREATE (IF MISSING)
```
app/(regional)/ng/page.tsx          (Optional, ~100 lines)
app/(regional)/bd/page.tsx          (Optional, ~100 lines)
app/(supplier)/supplier/products/new/page.tsx (Optional, ~150 lines)
```

---

## ⚠️ CRITICAL WARNINGS

🚨 **DO NOT:**
- ❌ Mix products and creators in same query
- ❌ Show creator types in marketplace filters
- ❌ Show product categories in creators page
- ❌ Hardcode environment variables in code
- ❌ Commit `.env.local` to git
- ❌ Use `package-lock.json` with pnpm
- ❌ Leave DB queries in API routes without `force-dynamic`

✅ **DO:**
- ✅ Use separate query functions for each listing type
- ✅ Keep navigation structure clear (Creatorsmart ≠ filter)
- ✅ Test locally before pushing
- ✅ Use `.env.example` for public variables template
- ✅ Add region context to all queries
- ✅ Mark all dynamic pages with `export const dynamic = 'force-dynamic';`

---

## 🎯 SUCCESS CRITERIA

All of these must be true for launch:

1. ✅ `/marketplace` shows ZERO creators in product grid
2. ✅ `/creators` shows ZERO products in creator grid
3. ✅ "Creatorsmart" link navigates to `/creators`
4. ✅ Regional domains (NG, BD) show region-scoped content
5. ✅ Supplier domain routes correctly to `/supplier`
6. ✅ Build passes locally: `npm run build`
7. ✅ Vercel deployment succeeds (green checkmark)
8. ✅ All 6 domains accessible in production
9. ✅ No console errors in browser (dev tools)
10. ✅ Response times < 2s for API endpoints

---

## 📞 NEXT STEPS

1. **Review this checklist** → Confirm all items understood
2. **Implement Phase 1-2** → Complete in local dev
3. **Test locally** → Run through verification tests
4. **Implement Phase 3-5** → Page updates + navigation
5. **Final verification** → All tests pass
6. **Deploy** → Push to main, trigger Vercel redeploy
7. **Monitor** → Watch Vercel logs for errors

---

**Document Status:** READY FOR IMPLEMENTATION  
**Estimated Time:** 4-6 hours (with testing)  
**Risk Level:** LOW (no breaking changes, separation only)  
**Rollback Plan:** Revert last commit if issues arise
