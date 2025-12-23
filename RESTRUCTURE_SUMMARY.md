# Banadama Platform Restructure Summary
## What Will Change

### 🎯 Goal
Transform the current mixed structure into a clean, role-based architecture where each user type has its own dedicated route group.

### 📊 Current vs New Structure

#### Current Structure (Problematic)
```
app/
├── (public)/          # Public pages
├── (dashboard)/       # Mixed: buyer, factory, wholesaler, creator all together
└── (admin)/          # Admin pages
```

**Problems:**
- All roles mixed in `(dashboard)/`
- Unclear which features belong to which role
- Difficult to implement role-based access control
- Navigation is confusing

#### New Structure (Clean)
```
app/
├── (public)/          # Public pages (splash, market, creators)
├── (auth)/           # Authentication (login, register)
├── (buyer)/          # Buyer-only pages
├── (factory)/        # Factory-only pages
├── (wholesaler)/     # Wholesaler-only pages
├── (creator)/        # Creator-only pages
└── (admin)/          # Admin-only pages
```

**Benefits:**
- ✅ Clear role separation
- ✅ Easy to implement role-based middleware
- ✅ Better organization
- ✅ Scalable architecture

### 🔄 Specific Changes

#### 1. Auth Pages
**Action**: Move from `(public)` to new `(auth)` group

```
FROM: (public)/auth/login/page.tsx
TO:   (auth)/auth/login/page.tsx

FROM: (public)/auth/register/page.tsx
TO:   (auth)/auth/register/page.tsx
```

**URL**: No change (`/auth/login`, `/auth/register`)

#### 2. Buyer Pages
**Action**: Move from `(dashboard)/buyer/` to new `(buyer)/` group

```
FROM: (dashboard)/buyer/page.tsx
TO:   (buyer)/dashboard/page.tsx

FROM: (dashboard)/buyer/orders/page.tsx
TO:   (buyer)/orders/page.tsx

FROM: (dashboard)/buyer/rfq/page.tsx
TO:   (buyer)/rfq/page.tsx
```

**URL Change**: `/dashboard/buyer` → `/buyer/dashboard`

#### 3. Factory Pages
**Action**: Move from `(dashboard)/factory/` to new `(factory)/` group

```
FROM: (dashboard)/factory/page.tsx
TO:   (factory)/dashboard/page.tsx

FROM: (dashboard)/factory/products/page.tsx
TO:   (factory)/products/page.tsx

FROM: (dashboard)/factory/rfq/page.tsx
TO:   (factory)/rfq/page.tsx
```

**URL Change**: `/dashboard/factory` → `/factory/dashboard`

#### 4. Wholesaler Pages
**Action**: Move from `(dashboard)/wholesaler/` to new `(wholesaler)/` group

```
FROM: (dashboard)/wholesaler/page.tsx
TO:   (wholesaler)/dashboard/page.tsx

FROM: (dashboard)/wholesaler/products/page.tsx
TO:   (wholesaler)/products/page.tsx
```

**URL Change**: `/dashboard/wholesaler` → `/wholesaler/dashboard`

#### 5. Creator Pages
**Action**: Move from `(dashboard)/creator/` to new `(creator)/` group

```
FROM: (dashboard)/creator/page.tsx
TO:   (creator)/dashboard/page.tsx

FROM: (dashboard)/creator/products/page.tsx
TO:   (creator)/products/page.tsx

FROM: (dashboard)/creator/jobs/page.tsx
TO:   (creator)/jobs/page.tsx
```

**URL Change**: `/dashboard/creator` → `/creator/dashboard`

#### 6. Shared Pages (Orders, Shipments, Wallet, Messages, Settings)
**Action**: Duplicate to each role group or keep shared

**Option A** (Recommended): Duplicate to each role
```
(buyer)/orders/page.tsx
(buyer)/shipments/page.tsx
(buyer)/wallet/page.tsx
(buyer)/messages/page.tsx
(buyer)/settings/

(factory)/orders/page.tsx
(factory)/shipments/page.tsx
...
```

**Option B**: Keep shared and use middleware to filter
```
Keep in (dashboard)/ but add role-based filtering
```

#### 7. B2C Store
**Action**: Move to admin products

```
FROM: (dashboard)/b2c-store/page.tsx
TO:   (admin)/products/page.tsx
```

### 🆕 New Pages to Create

1. **Language Selection**
   - `(public)/language/page.tsx`

2. **Onboarding Flow**
   - `(public)/onboarding/user-type/page.tsx` (Buyer/Factory/Wholesaler/Creator)
   - `(public)/onboarding/creator-type/page.tsx` (Model/Designer/etc)
   - `(public)/onboarding/done/page.tsx`

3. **Role-Specific Layouts**
   - `(buyer)/layout.tsx`
   - `(factory)/layout.tsx`
   - `(wholesaler)/layout.tsx`
   - `(creator)/layout.tsx`
   - `(auth)/layout.tsx`

### ⚠️ Breaking Changes

**URLs will change:**
- `/dashboard/buyer` → `/buyer/dashboard`
- `/dashboard/factory` → `/factory/dashboard`
- `/dashboard/wholesaler` → `/wholesaler/dashboard`
- `/dashboard/creator` → `/creator/dashboard`
- `/dashboard/orders` → `/buyer/orders` (or role-specific)
- `/dashboard/shipments` → `/buyer/shipments` (or role-specific)

**All internal links must be updated:**
- Navigation components
- Redirect URLs
- Middleware routes
- Link components throughout the app

### 📋 Implementation Checklist

- [ ] Create new route group directories
- [ ] Create layout files for each route group
- [ ] Move buyer pages to `(buyer)/`
- [ ] Move factory pages to `(factory)/`
- [ ] Move wholesaler pages to `(wholesaler)/`
- [ ] Move creator pages to `(creator)/`
- [ ] Move auth pages to `(auth)/`
- [ ] Handle shared pages (orders, shipments, wallet, messages, settings)
- [ ] Create new onboarding pages
- [ ] Create language selection page
- [ ] Update middleware for new routes
- [ ] Update all navigation components
- [ ] Update all Link components
- [ ] Update redirect URLs
- [ ] Test all routes
- [ ] Remove old `(dashboard)/` directory

### 🚀 Ready to Proceed?

This is a significant restructure that will:
1. **Improve** code organization dramatically
2. **Break** existing URLs (need to update bookmarks/links)
3. **Require** updating middleware and navigation
4. **Take** approximately 30-45 minutes to complete

**Recommendation**: 
- Proceed if you're ready for a major refactor
- This is the right architecture for long-term scalability
- Better to do this now before adding more features

**Would you like me to:**
1. ✅ Proceed with full restructure
2. 🔄 Do it in phases (one role at a time)
3. 📝 Make modifications to the plan first
