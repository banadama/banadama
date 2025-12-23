# Banadama Platform Restructure Plan V2
## Enhanced Role-Based Architecture

### Overview
This restructure organizes the application into clear role-based route groups:
- **(public)** - Public pages accessible to everyone
- **(buyer)** - Buyer-specific dashboard and features
- **(factory)** - Factory-specific dashboard and features
- **(wholesaler)** - Wholesaler-specific dashboard and features
- **(creator)** - Creator-specific dashboard and features
- **(admin)** - Admin-only pages
- **(auth)** - Authentication pages

### Current Structure → New Structure Mapping

#### 1. Public Routes (public)
**Current**: `(public)/`
**New**: `(public)/`

Changes:
- ✅ Keep: `page.tsx` (splash page)
- ✅ Keep: `auth/` (move to separate (auth) group)
- ✅ Keep: `market/` 
- ✅ Keep: `creators/`
- 🆕 Add: `language/page.tsx`
- 🆕 Add: `onboarding/user-type/page.tsx`
- 🆕 Add: `onboarding/creator-type/page.tsx`
- 🆕 Add: `onboarding/done/page.tsx`

#### 2. Buyer Routes (buyer)
**Current**: `(dashboard)/buyer/`
**New**: `(buyer)/`

Structure:
```
(buyer)/
├── dashboard/page.tsx          # Buyer home
├── orders/
│   ├── page.tsx               # Orders list
│   └── [id]/page.tsx          # Order details
├── rfq/page.tsx               # Request for Quote
└── shipments/page.tsx         # Buyer shipments
```

#### 3. Factory Routes (factory)
**Current**: `(dashboard)/factory/`
**New**: `(factory)/`

Structure:
```
(factory)/
├── dashboard/page.tsx          # Factory home
├── products/
│   ├── page.tsx               # Products list
│   └── new/page.tsx           # Add new product
├── rfq/page.tsx               # RFQ management
└── shipments/page.tsx         # Factory shipments
```

#### 4. Wholesaler Routes (wholesaler)
**Current**: `(dashboard)/wholesaler/`
**New**: `(wholesaler)/`

Structure:
```
(wholesaler)/
├── dashboard/page.tsx          # Wholesaler home
├── products/
│   ├── page.tsx               # Products list
│   └── new/page.tsx           # Add new product
└── shipments/page.tsx         # Wholesaler shipments
```

#### 5. Creator Routes (creator)
**Current**: `(dashboard)/creator/`
**New**: `(creator)/`

Structure:
```
(creator)/
├── dashboard/page.tsx          # Creator home
├── products/
│   ├── page.tsx               # Designs/mockups list
│   └── new/page.tsx           # Upload new design
└── jobs/page.tsx              # Job requests from factories/wholesalers
```

#### 6. Admin Routes (admin)
**Current**: `(admin)/`
**New**: `(admin)/`

Structure:
```
(admin)/
├── dashboard/page.tsx          # Admin overview
├── verification/page.tsx       # KYC/company verification
├── users/page.tsx             # User management
├── companies/page.tsx         # Company management
├── orders/page.tsx            # All orders
├── shipments/page.tsx         # All shipments
└── products/
    ├── page.tsx               # Banadama B2C products
    └── new/page.tsx           # Add B2C product
```

#### 7. Auth Routes (auth)
**Current**: `(public)/auth/`
**New**: `(auth)/auth/`

Structure:
```
(auth)/
└── auth/
    ├── login/page.tsx
    ├── register/page.tsx
    └── layout.tsx
```

#### 8. Shared Routes (moved from dashboard)
**Current**: `(dashboard)/`
**Action**: Move to appropriate role groups or remove

- `messages/` → Keep in each role group or create shared
- `settings/` → Keep in each role group
- `wallet/` → Keep in each role group
- `b2c-store/` → Move to `(admin)/products/`

### Implementation Steps

1. **Phase 1: Create New Route Groups**
   - Create `(buyer)/` directory structure
   - Create `(factory)/` directory structure
   - Create `(wholesaler)/` directory structure
   - Create `(creator)/` directory structure
   - Create `(auth)/` directory structure

2. **Phase 2: Move Existing Files**
   - Move buyer pages from `(dashboard)/buyer/` to `(buyer)/`
   - Move factory pages from `(dashboard)/factory/` to `(factory)/`
   - Move wholesaler pages from `(dashboard)/wholesaler/` to `(wholesaler)/`
   - Move creator pages from `(dashboard)/creator/` to `(creator)/`
   - Move auth pages from `(public)/auth/` to `(auth)/auth/`

3. **Phase 3: Create Layouts**
   - Create `(buyer)/layout.tsx`
   - Create `(factory)/layout.tsx`
   - Create `(wholesaler)/layout.tsx`
   - Create `(creator)/layout.tsx`
   - Update `(admin)/layout.tsx`
   - Create `(auth)/layout.tsx`

4. **Phase 4: Update Middleware**
   - Update middleware to handle new route structure
   - Add role-based access control

5. **Phase 5: Update Links & Navigation**
   - Update all internal links
   - Update navigation components

### URL Changes

| Old URL | New URL |
|---------|---------|
| `/dashboard/buyer` | `/buyer/dashboard` |
| `/dashboard/factory` | `/factory/dashboard` |
| `/dashboard/wholesaler` | `/wholesaler/dashboard` |
| `/dashboard/creator` | `/creator/dashboard` |
| `/dashboard/orders` | `/buyer/orders` (or role-specific) |
| `/dashboard/shipments` | `/buyer/shipments` (or role-specific) |
| `/auth/login` | `/auth/login` (same) |
| `/auth/register` | `/auth/register` (same) |

### Benefits

1. **Clearer Role Separation**: Each role has its own route group
2. **Better Access Control**: Easier to implement role-based middleware
3. **Improved Organization**: Related features grouped by role
4. **Scalability**: Easy to add role-specific features
5. **Better Developer Experience**: Clear where to add new features

### Notes

- Route groups with parentheses don't affect URLs
- `(buyer)/dashboard/page.tsx` → `/buyer/dashboard`
- `(auth)/auth/login/page.tsx` → `/auth/login`
- Shared components can still be used across route groups
