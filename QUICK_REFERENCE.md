# QUICK REFERENCE - Marketplace vs Creators Separation

## 🚀 QUICK START (5 MIN READ)

### The Goal
Split Banadama into two distinct experiences:
1. **Marketplace** (`/marketplace`) - Products only (Industrial, Retail, Supplies)
2. **Creatorsmart** (`/creators`) - Creators only (Design, Photo, Video, Services)

### The Solution (Already Built)
```typescript
// PRODUCTS ONLY
import { getMarketplaceProducts } from '@/lib/queries/marketplace';
const products = await getMarketplaceProducts({
  category: 'industrial',
  region: 'GLOBAL'
});
// Returns: Products[] - ZERO creators

// CREATORS ONLY  
import { getCreatorListings } from '@/lib/queries/creators';
const creators = await getCreatorListings({
  type: 'DIGITAL',
  region: 'GLOBAL'
});
// Returns: CreatorListing[] - ZERO products
```

---

## 📋 WHAT TO CHANGE

### 1. Update `/marketplace` Page (20 lines)
```typescript
// app/marketplace/page.tsx
import { getMarketplaceProducts } from '@/lib/queries/marketplace';
import { getRegionFromHeaders } from '@/lib/utils/region';

export const dynamic = 'force-dynamic'; // ← ADD THIS

export default async function MarketplacePage({ searchParams }) {
  const region = getRegionFromHeaders();
  
  // ← CHANGE: Use getMarketplaceProducts() instead of raw query
  const products = await getMarketplaceProducts({
    category: searchParams.category,
    region,
    search: searchParams.search,
  });
  
  // ← KEEP: Render products in grid (no creators)
  return <ProductGrid products={products} />;
}
```

### 2. Verify `/creators` Page (0 changes needed)
```typescript
// app/creators/page.tsx
// ✅ Already uses creator_listings
// ✅ Just verify it calls getCreatorListings()
// ✅ Just verify mark as force-dynamic
```

### 3. Add "Creatorsmart" Link (5 lines)
```typescript
// components/navigation/MainNav.tsx
export default function MainNav() {
  return (
    <nav>
      <Link href="/marketplace">Marketplace</Link>
      {/* ← ADD THIS */}
      <Link href="/creators" style={{ color: '#3d5c4f', fontWeight: 'bold' }}>
        Creatorsmart ✨
      </Link>
      <Link href="/auth/login">Login</Link>
    </nav>
  );
}
```

---

## 🗂️ FILES CREATED

| File | Lines | Purpose |
|------|-------|---------|
| `lib/queries/marketplace.ts` | 300 | Product queries (no creators) |
| `lib/queries/creators.ts` | 300 | Creator queries (no products) |
| `lib/utils/region.ts` | 50 | Region helper functions |

---

## 📊 DATA FLOW

```
Request arrives
     ↓
middleware.ts detects domain → sets x-region header
     ↓
Page reads: getRegionFromHeaders() → NG | BD | GLOBAL
     ↓
Query filters applied:
  - If Marketplace: WHERE table=products AND region=? AND category=?
  - If Creators: WHERE table=creator_listings AND type=? AND region=?
     ↓
Results returned: Products[] OR CreatorListing[]
     ↓
UI renders: ONLY products OR ONLY creators
```

---

## ✅ TESTS

### Local (before push)
```bash
npm run dev
# Visit http://localhost:3000/marketplace
# ✓ See products only (count creators = 0)
# ✓ See category filters (Industrial, Retail, Supplies)

# Visit http://localhost:3000/creators  
# ✓ See creators only (count products = 0)
# ✓ See creator filters (Type, Design, etc.)

# Click "Creatorsmart" link
# ✓ Navigates to /creators

npm run build
# ✓ Build succeeds, no errors
```

### Production (after deploy)
```
https://banadama.com/marketplace
  → Products only ✓

https://banadama.com/creators
  → Creators only ✓

https://ng.banadama.com/marketplace
  → NG products + international ✓

https://ng.banadama.com/creators
  → NG local services + global digital ✓

https://supplier.banadama.com
  → Supplier hub ✓

https://admin.banadama.com
  → Admin stub (no error) ✓
```

---

## 🎨 MULTI-DOMAIN BEHAVIOR

| URL | Products | Creators | Region |
|-----|----------|----------|--------|
| banadama.com/marketplace | All global | All global | GLOBAL |
| banadama.com/creators | N/A | Digital only | GLOBAL |
| ng.banadama.com/marketplace | NG + intl | N/A | NG |
| ng.banadama.com/creators | N/A | NG local + global digital | NG |
| bd.banadama.com/marketplace | BD + intl | N/A | BD |
| bd.banadama.com/creators | N/A | BD local + global digital | BD |

---

## 🔄 REGION LOGIC

### Products (Marketplace)
```
Global domain (banadama.com)
  → Show all products

NG domain (ng.banadama.com)
  → Show products WHERE region=NG OR logistics=international

BD domain (bd.banadama.com)
  → Show products WHERE region=BD OR logistics=international
```

### Creators (Creatorsmart)
```
Digital creators (GRAPHIC_DESIGNER, VIDEOGRAPHER)
  → Visible in ALL regions globally

Local service creators (PHOTOGRAPHER, MODELLING)
  → Visible ONLY in their region
  
Example:
  - NG domain sees: All digital + NG local services
  - BD domain sees: All digital + BD local services  
  - Global domain sees: Only digital creators
```

---

## 🚨 DON'T FORGET

- [ ] Add `export const dynamic = 'force-dynamic';` to ALL dynamic pages
- [ ] Run `npm run build` before pushing
- [ ] Fix pnpm locks: `pnpm install`
- [ ] Test `/marketplace` has 0 creators in grid
- [ ] Test `/creators` has 0 products in grid
- [ ] Verify "Creatorsmart" link in nav
- [ ] Check Vercel logs after deploy

---

## 🆘 TROUBLESHOOTING

**Problem:** Marketplace still shows creators  
**Solution:** Ensure page calls `getMarketplaceProducts()`, not raw query

**Problem:** Build fails with "Failed to collect page data"  
**Solution:** Add `export const dynamic = 'force-dynamic';` to pages

**Problem:** Region filtering not working  
**Solution:** Verify `getRegionFromHeaders()` called, middleware sets x-region

**Problem:** Creators don't show on NG domain  
**Solution:** Check LOCAL_SERVICE creators have country='NG' in DB

---

## 📞 DOCUMENTATION

- **Full Details:** See `REFACTORING_PLAN_COMPREHENSIVE.md`
- **Step by Step:** See `REFACTORING_CHECKLIST.md`
- **Architecture:** See `ARCHITECTURE_SUMMARY_LISTING_SEPARATION.md`
- **Code:** See `lib/queries/marketplace.ts` and `lib/queries/creators.ts`

---

## ⏱️ ESTIMATE

- Update marketplace page: **15 min**
- Verify creators page: **5 min**
- Add Creatorsmart link: **5 min**
- Test locally: **15 min**
- Deploy & verify: **20 min**

**Total: ~1 hour** (for experienced developer)

---

**Status:** 🟢 Ready to implement  
**Confidence:** ⭐⭐⭐⭐⭐ (5/5)  
**Complexity:** 🟢 Low (well-documented, clear separation)
