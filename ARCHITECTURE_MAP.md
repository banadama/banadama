# Banadama Platform - Enhanced Directory Structure
## Visual Architecture Map

```
src/app/
│
├── 🌍 (public)/                    # Public routes - No auth required
│   ├── page.tsx                    # → / (Splash page: logo + CTA)
│   ├── language/
│   │   └── page.tsx                # → /language (Language selection)
│   ├── onboarding/
│   │   ├── user-type/
│   │   │   └── page.tsx            # → /onboarding/user-type (Role selection)
│   │   ├── creator-type/
│   │   │   └── page.tsx            # → /onboarding/creator-type (Creator specialization)
│   │   └── done/
│   │       └── page.tsx            # → /onboarding/done (Onboarding complete)
│   ├── market/
│   │   ├── page.tsx                # → /market (Global marketplace)
│   │   ├── b2b/page.tsx            # → /market/b2b
│   │   ├── b2c/page.tsx            # → /market/b2c
│   │   ├── designs/page.tsx        # → /market/designs
│   │   └── product/[slug]/page.tsx # → /market/product/[slug]
│   ├── creators/
│   │   └── page.tsx                # → /creators (Public creator gallery)
│   └── pricing/
│       └── page.tsx                # → /pricing (Public pricing info)
│
├── 🔐 (auth)/                      # Authentication routes
│   └── auth/
│       ├── login/page.tsx          # → /auth/login
│       ├── register/page.tsx       # → /auth/register
│       └── layout.tsx              # Auth layout (centered form)
│
├── 🛒 (buyer)/                     # Buyer dashboard - Requires buyer role
│   ├── layout.tsx                  # Buyer-specific layout & nav
│   ├── dashboard/
│   │   └── page.tsx                # → /buyer/dashboard (Buyer home)
│   ├── orders/
│   │   ├── page.tsx                # → /buyer/orders (Orders list)
│   │   └── [id]/page.tsx           # → /buyer/orders/[id] (Order details)
│   ├── rfq/
│   │   └── page.tsx                # → /buyer/rfq (Request for Quote)
│   ├── shipments/
│   │   └── page.tsx                # → /buyer/shipments (Track shipments)
│   ├── wallet/
│   │   └── page.tsx                # → /buyer/wallet (Payments & balance)
│   ├── messages/
│   │   └── page.tsx                # → /buyer/messages (Chat with suppliers)
│   └── settings/
│       ├── page.tsx                # → /buyer/settings
│       ├── account/page.tsx        # → /buyer/settings/account
│       ├── shipping/page.tsx       # → /buyer/settings/shipping
│       └── notifications/page.tsx  # → /buyer/settings/notifications
│
├── 🏭 (factory)/                   # Factory dashboard - Requires factory role
│   ├── layout.tsx                  # Factory-specific layout & nav
│   ├── dashboard/
│   │   └── page.tsx                # → /factory/dashboard (Factory home)
│   ├── products/
│   │   ├── page.tsx                # → /factory/products (Product catalog)
│   │   └── new/page.tsx            # → /factory/products/new (Add product)
│   ├── rfq/
│   │   └── page.tsx                # → /factory/rfq (Manage quotes)
│   ├── orders/
│   │   ├── page.tsx                # → /factory/orders (Orders received)
│   │   └── [id]/page.tsx           # → /factory/orders/[id]
│   ├── shipments/
│   │   └── page.tsx                # → /factory/shipments (Outbound shipments)
│   ├── wallet/
│   │   └── page.tsx                # → /factory/wallet
│   ├── messages/
│   │   └── page.tsx                # → /factory/messages
│   └── settings/
│       └── page.tsx                # → /factory/settings
│
├── 📦 (wholesaler)/                # Wholesaler dashboard - Requires wholesaler role
│   ├── layout.tsx                  # Wholesaler-specific layout & nav
│   ├── dashboard/
│   │   └── page.tsx                # → /wholesaler/dashboard (Wholesaler home)
│   ├── products/
│   │   ├── page.tsx                # → /wholesaler/products (Bulk products)
│   │   └── new/page.tsx            # → /wholesaler/products/new (Add product)
│   ├── orders/
│   │   ├── page.tsx                # → /wholesaler/orders
│   │   └── [id]/page.tsx           # → /wholesaler/orders/[id]
│   ├── shipments/
│   │   └── page.tsx                # → /wholesaler/shipments
│   ├── wallet/
│   │   └── page.tsx                # → /wholesaler/wallet
│   ├── messages/
│   │   └── page.tsx                # → /wholesaler/messages
│   └── settings/
│       └── page.tsx                # → /wholesaler/settings
│
├── 🎨 (creator)/                   # Creator dashboard - Requires creator role
│   ├── layout.tsx                  # Creator-specific layout & nav
│   ├── dashboard/
│   │   └── page.tsx                # → /creator/dashboard (Creator home)
│   ├── products/
│   │   ├── page.tsx                # → /creator/products (Designs & mockups)
│   │   └── new/page.tsx            # → /creator/products/new (Upload design)
│   ├── jobs/
│   │   └── page.tsx                # → /creator/jobs (Job requests)
│   ├── portfolio/
│   │   └── page.tsx                # → /creator/portfolio (Public portfolio)
│   ├── wallet/
│   │   └── page.tsx                # → /creator/wallet (Earnings)
│   ├── messages/
│   │   └── page.tsx                # → /creator/messages
│   └── settings/
│       └── page.tsx                # → /creator/settings
│
├── 👑 (admin)/                     # Admin dashboard - Requires admin role
│   ├── layout.tsx                  # Admin-specific layout & nav
│   ├── dashboard/
│   │   └── page.tsx                # → /admin/dashboard (Admin overview)
│   ├── verification/
│   │   └── page.tsx                # → /admin/verification (KYC/company verification)
│   ├── users/
│   │   └── page.tsx                # → /admin/users (User management)
│   ├── companies/
│   │   └── page.tsx                # → /admin/companies (Company management)
│   ├── orders/
│   │   └── page.tsx                # → /admin/orders (All orders)
│   ├── shipments/
│   │   └── page.tsx                # → /admin/shipments (All shipments)
│   └── products/
│       ├── page.tsx                # → /admin/products (Banadama B2C store)
│       └── new/page.tsx            # → /admin/products/new (Add B2C product)
│
├── 🔌 api/                         # API routes
│   ├── pricing/
│   │   └── route.ts                # POST /api/pricing
│   ├── orders/
│   │   ├── create/route.ts         # POST /api/orders/create
│   │   └── update/route.ts         # PATCH /api/orders/update
│   ├── shipments/
│   │   ├── create/route.ts         # POST /api/shipments/create
│   │   └── update/route.ts         # PATCH /api/shipments/update
│   ├── auth/
│   │   ├── sign-in/route.ts        # POST /api/auth/sign-in
│   │   └── user/route.ts           # GET /api/auth/user
│   ├── rfq/
│   │   ├── create/route.ts         # POST /api/rfq/create
│   │   └── offer/route.ts          # POST /api/rfq/offer
│   └── wallet/
│       ├── balance/route.ts        # GET /api/wallet/balance
│       └── withdraw/route.ts       # POST /api/wallet/withdraw
│
├── layout.tsx                      # Root layout (global styles, providers)
└── page.tsx                        # Root redirect (→ /market or /language)
```

## 🎯 Route Group Explanation

### What are Route Groups?
Route groups (folders with parentheses) organize routes **without affecting the URL**.

**Example:**
- File: `(buyer)/dashboard/page.tsx`
- URL: `/buyer/dashboard` (not `/(buyer)/dashboard`)

### Benefits:
1. **Organization**: Group related routes together
2. **Layouts**: Each group can have its own layout
3. **Middleware**: Apply role-based access control per group
4. **Clean URLs**: Parentheses don't appear in URLs

## 🔒 Access Control by Route Group

| Route Group | Access Level | Middleware Check |
|-------------|--------------|------------------|
| `(public)` | Everyone | None |
| `(auth)` | Unauthenticated only | Redirect if logged in |
| `(buyer)` | Authenticated + Buyer role | Check buyer role |
| `(factory)` | Authenticated + Factory role | Check factory role |
| `(wholesaler)` | Authenticated + Wholesaler role | Check wholesaler role |
| `(creator)` | Authenticated + Creator role | Check creator role |
| `(admin)` | Authenticated + Admin role | Check admin role |

## 📱 Navigation Examples

### Buyer Navigation
```tsx
// (buyer)/layout.tsx
const buyerNav = [
  { href: "/buyer/dashboard", label: "Dashboard" },
  { href: "/buyer/orders", label: "Orders" },
  { href: "/buyer/rfq", label: "Request Quote" },
  { href: "/buyer/shipments", label: "Shipments" },
  { href: "/buyer/wallet", label: "Wallet" },
  { href: "/buyer/messages", label: "Messages" },
  { href: "/buyer/settings", label: "Settings" },
];
```

### Factory Navigation
```tsx
// (factory)/layout.tsx
const factoryNav = [
  { href: "/factory/dashboard", label: "Dashboard" },
  { href: "/factory/products", label: "Products" },
  { href: "/factory/rfq", label: "Quotes" },
  { href: "/factory/orders", label: "Orders" },
  { href: "/factory/shipments", label: "Shipments" },
  { href: "/factory/wallet", label: "Wallet" },
];
```

## 🚀 Migration Impact

### URLs Before → After

| Before | After |
|--------|-------|
| `/dashboard/buyer` | `/buyer/dashboard` |
| `/dashboard/factory` | `/factory/dashboard` |
| `/dashboard/wholesaler` | `/wholesaler/dashboard` |
| `/dashboard/creator` | `/creator/dashboard` |
| `/dashboard/orders` | `/buyer/orders` (role-specific) |
| `/dashboard/shipments` | `/buyer/shipments` (role-specific) |
| `/b2c-store` | `/admin/products` |
| `/auth/login` | `/auth/login` (unchanged) |
| `/market` | `/market` (unchanged) |

### What Needs Updating

1. **Middleware** (`middleware.ts`)
   - Update route matching patterns
   - Add role-based redirects

2. **Navigation Components**
   - Update all `href` attributes
   - Make navigation role-aware

3. **Link Components**
   - Search and replace old URLs
   - Update redirect URLs

4. **API Redirects**
   - Update success/error redirects
   - Update auth redirects

## ✅ Implementation Status

- [x] Plan created
- [x] Structure documented
- [ ] Create new route groups
- [ ] Create layouts
- [ ] Move files
- [ ] Update middleware
- [ ] Update navigation
- [ ] Update links
- [ ] Test all routes
- [ ] Clean up old structure
