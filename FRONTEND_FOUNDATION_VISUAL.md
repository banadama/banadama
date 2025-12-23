# FRONTEND FOUNDATION - VISUAL REFERENCE

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION                       │
│  /auth/login → POST /api/auth/login → JWT Cookie Set        │
│  /auth/register → POST /api/auth/register → Auto-login      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    ROLE-BASED ROUTING                        │
│                                                              │
│  BUYER      → /buyer/dashboard                              │
│  OPS        → /ops/overview                                 │
│  FACTORY    → /factory/dashboard                            │
│  WHOLESALER → /wholesaler/dashboard                         │
│  CREATOR    → /creator/dashboard                            │
│  AFFILIATE  → /affiliate/dashboard                          │
│  ADMIN      → /admin/overview                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    RBAC ENFORCEMENT                          │
│                                                              │
│  requireRole() → Check JWT → Verify Role → Allow/Deny       │
│                                                              │
│  ✅ Correct Role → Render DashboardShell                    │
│  ❌ Wrong Role   → Redirect to /auth/forbidden              │
│  ❌ No Auth      → Redirect to /auth/login                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD LAYOUT                          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ TopNav: Banadama [Role] ............... [Logout]   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌──────────┬──────────────────────────────────────────┐   │
│  │ SideNav  │ Main Content Area                        │   │
│  │          │                                           │   │
│  │ 📊 Dash  │  <Dashboard Page Content>                │   │
│  │ 📝 RFQ   │                                           │   │
│  │ 🛒 Ord   │  - Statistics Cards                      │   │
│  │ 💰 Wal   │  - Data Tables                           │   │
│  │ 💬 Msg   │  - Forms                                 │   │
│  │          │  - Detail Views                          │   │
│  └──────────┴──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

```
┌───────────┐
│   User    │
└─────┬─────┘
      │
      ▼
┌─────────────────┐
│  /auth/login    │
│  Enter email    │
│  Enter password │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ POST /api/auth/login     │
│                          │
│ 1. Find user by email    │
│ 2. Verify password       │
│ 3. Create JWT            │
│ 4. Set httpOnly cookie   │
│ 5. Return dashboardUrl   │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Redirect to Dashboard    │
│                          │
│ BUYER → /buyer/dashboard │
│ OPS   → /ops/overview    │
│ etc.                     │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Dashboard Layout         │
│ await requireRole(ROLE)  │
│                          │
│ ✅ JWT valid + role OK   │
│ → Render page            │
└──────────────────────────┘
```

---

## 🛡️ RBAC Decision Tree

```
User Navigates to /buyer/dashboard
         │
         ▼
   ┌──────────┐
   │ Layout   │
   │ Runs     │
   └─────┬────┘
         │
         ▼
  requireRole('BUYER')
         │
         ├─────────────────────────────────┐
         │                                  │
         ▼                                  ▼
   ┌───────────┐                    ┌──────────────┐
   │ Has JWT?  │────NO─────────────▶│ Redirect to  │
   └─────┬─────┘                    │ /auth/login  │
         │ YES                       └──────────────┘
         ▼
   ┌──────────┐
   │ JWT      │
   │ Valid?   │────NO─────────────▶ Clear Cookie
   └─────┬────┘                     Redirect to /auth/login
         │ YES
         ▼
   ┌──────────┐
   │ User     │
   │ Active?  │────NO─────────────▶ Redirect to /auth/login
   └─────┬────┘
         │ YES
         ▼
   ┌──────────┐
   │ Role =   │────NO─────────────▶ Redirect to /auth/forbidden
   │ BUYER?   │
   └─────┬────┘
         │ YES
         ▼
   ┌──────────┐
   │ ✅ ALLOW │
   │ Render   │
   │ Page     │
   └──────────┘
```

---

## 📋 Component Hierarchy

```
app/layout.tsx (Root)
│
├── app/(auth)/auth/layout.tsx
│   ├── login/page.tsx (Client Component)
│   ├── register/page.tsx (Client Component)
│   └── forbidden/page.tsx
│
├── app/(buyer)/layout.tsx (Server Component)
│   │   └── await requireRole('BUYER')
│   │   └── <DashboardShell>
│   │       ├── <TopNav roleName="Buyer" />
│   │       ├── <SideNav items={BUYER_NAV} />
│   │       └── {children}
│   │
│   ├── buyer/dashboard/page.tsx
│   ├── buyer/requests/page.tsx
│   ├── buyer/orders/page.tsx
│   └── ... other buyer pages
│
├── app/(ops)/layout.tsx
│   │   └── await requireRole(['OPS', 'ADMIN'])
│   │   └── <DashboardShell>
│   │
│   ├── ops/overview/page.tsx
│   └── ... other ops pages
│
├── app/(factory)/layout.tsx
├── app/(wholesaler)/layout.tsx
├── app/(creator)/layout.tsx
├── app/(affiliate)/layout.tsx
└── app/(admin)/layout.tsx
```

---

## 🎨 UI Component Tree

```
DashboardShell
├── TopNav (Client Component)
│   ├── Branding: "Banadama [Role]"
│   ├── Role Badge (colored)
│   └── Logout Button
│       └── onClick → POST /api/auth/logout → redirect
│
├── SideNav (Client Component)
│   ├── Navigation Items
│   │   ├── Link 1 (with icon)
│   │   ├── Link 2 (with icon)
│   │   └── ... (with active state)
│   │
│   └── Quick Actions (optional)
│       ├── Action 1
│       └── Action 2
│
└── Main Content Area
    └── {children} (Page content)
```

---

## 🔌 API Client Flow

```
Component/Page
    │
    ▼
apiPost<ResponseType>(path, body)
    │
    ├─ Set headers: { Content-Type: application/json }
    ├─ Set credentials: 'include' (sends cookies)
    ├─ Stringify body: JSON.stringify(body)
    │
    ▼
fetch(path, options)
    │
    ├──▶ Success (2xx)
    │    └─ return res.json() as ResponseType
    │
    └──▶ Error (non-2xx)
         └─ throw ApiError { status, message, details }

Caller handles with try/catch:
  try {
    const data = await apiPost<T>(...);
  } catch (error) {
    if (isApiError(error)) {
      // Handle typed error
    }
  }
```

---

## 📊 Data Flow Example: Login

```
1. User fills form in /auth/login
      │
      ▼
2. handleSubmit → apiPost<LoginResponse>('/api/auth/login', { email, password })
      │
      ▼
3. Backend: POST /api/auth/login/route.ts
      │
      ├─ Find user in database
      ├─ Verify password
      ├─ Create JWT with user data
      ├─ Set httpOnly cookie
      └─ Return: { success, user, dashboardUrl }
      │
      ▼
4. Frontend: Receive response
      │
      └─ router.push(dashboardUrl)
      │
      ▼
5. Navigate to /buyer/dashboard (example)
      │
      ▼
6. Layout: app/(buyer)/layout.tsx runs
      │
      └─ await requireRole('BUYER')
          │
          ├─ Read JWT from cookie
          ├─ Verify signature
          ├─ Fetch user from DB
          ├─ Check role
          └─ ✅ Allow
      │
      ▼
7. Render DashboardShell + Page Content
```

---

## 🗂️ Navigation Structure by Role

```
┌────────────────────────────────────────────────────────────┐
│ BUYER                                                      │
├────────────────────────────────────────────────────────────┤
│ 📊 Dashboard        → /buyer/dashboard                    │
│ 📝 Requests (RFQ)   → /buyer/requests                     │
│ 🛒 Orders           → /buyer/orders                       │
│ 💰 Wallet           → /buyer/wallet                       │
│ 💬 Messages         → /buyer/chat                         │
│ ─────────────────────────────────────────────────────────  │
│ Quick Actions:                                             │
│ + Create RFQ        → /buyer/requests/new                 │
│ 🛍️ Browse Market     → /marketplace                        │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ OPS (Operations Team)                                      │
├────────────────────────────────────────────────────────────┤
│ 📊 Overview         → /ops/overview                       │
│ 📝 Buyer Requests   → /ops/rfqs                           │
│ 💰 Quotes           → /ops/quotes                         │
│ 🛒 Orders           → /ops/orders                         │
│ ✓  Verifications    → /ops/verifications                  │
│ 💬 Messages         → /ops/messages                       │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ FACTORY / WHOLESALER                                       │
├────────────────────────────────────────────────────────────┤
│ 📊 Dashboard        → /factory/dashboard                  │
│ 📦 Products         → /factory/products                   │
│ 🛒 Purchase Orders  → /factory/purchase-orders            │
│ 💰 Wallet           → /factory/wallet                     │
│ 💬 Messages         → /factory/messages                   │
│ ─────────────────────────────────────────────────────────  │
│ Quick Actions:                                             │
│ + Add Product       → /factory/products/new               │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ CREATOR                                                    │
├────────────────────────────────────────────────────────────┤
│ 📊 Dashboard        → /creator/dashboard                  │
│ 🎨 Products         → /creator/products                   │
│ 📋 Jobs             → /creator/jobs                       │
│ 💰 Wallet           → /creator/wallet                     │
│ 💬 Messages         → /creator/messages                   │
│ ─────────────────────────────────────────────────────────  │
│ Quick Actions:                                             │
│ + Add Product       → /creator/products/new               │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ AFFILIATE                                                  │
├────────────────────────────────────────────────────────────┤
│ 📊 Dashboard        → /affiliate/dashboard                │
│ 🔗 Links            → /affiliate/links                    │
│ 🛒 Sales            → /affiliate/sales                    │
│ 💵 Earnings         → /affiliate/earnings                 │
│ 🏦 Withdraw         → /affiliate/withdraw                 │
│ 💰 Wallet           → /affiliate/wallet                   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ ADMIN                                                      │
├────────────────────────────────────────────────────────────┤
│ 📊 Overview         → /admin/overview                     │
│ 👥 Users            → /admin/users                        │
│ ✓  Verifications    → /admin/verifications                │
│ 💵 Payouts          → /admin/payouts                      │
│ 💰 Wallets          → /admin/wallets                      │
└────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette

```
Role Colors (for TopNav badge):
┌───────────────┬─────────────────┬──────────────┐
│ Role          │ Color           │ TailwindCSS  │
├───────────────┼─────────────────┼──────────────┤
│ BUYER         │ 🟢 Emerald      │ emerald-400  │
│ OPS           │ 🟠 Orange       │ orange-400   │
│ FACTORY       │ 🔵 Blue         │ blue-400     │
│ WHOLESALER    │ 🔵 Blue         │ blue-400     │
│ CREATOR       │ 🟣 Purple       │ purple-400   │
│ AFFILIATE     │ 🟡 Amber        │ amber-400    │
│ ADMIN         │ ⚪ Slate        │ slate-400    │
└───────────────┴─────────────────┴──────────────┘

Background Palette:
- slate-950  (darkest background)
- slate-900  (card background)
- slate-800  (border, hover states)
- slate-700  (input border)

Text Palette:
- slate-100  (primary text)
- slate-300  (labels)
- slate-400  (secondary text)
- slate-500  (hints)
```

---

## 📱 Responsive Breakpoints

```
Mobile (< 768px):
┌──────────────┐
│   TopNav     │
├──────────────┤
│              │
│  Main        │
│  Content     │
│  (full)      │
│              │
└──────────────┘
SideNav: Hidden

Desktop (≥ 768px):
┌──────────────────────────┐
│       TopNav             │
├──────┬───────────────────┤
│Side  │                   │
│Nav   │  Main Content     │
│(64w) │                   │
│      │                   │
└──────┴───────────────────┘
SideNav: Visible (w-64)
```

---

## 🔗 URL Structure

```
Public Routes (no auth):
/                           → Landing page
/auth/login                 → Login page
/auth/register              → Registration page
/marketplace                → Public marketplace
/buy-near-me                → Location-based buying
/global-market              → Global products
/group-buy                  → Group buying feature
/creators                   → Creator marketplace
/affiliate                  → Affiliate program info

Protected Routes (auth required):
/buyer/*                    → Buyer dashboard (BUYER only)
/ops/*                      → Ops dashboard (OPS, ADMIN)
/factory/*                  → Factory dashboard (FACTORY)
/wholesaler/*               → Wholesaler dashboard (WHOLESALER)
/creator/*                  → Creator dashboard (CREATOR)
/affiliate/*                → Affiliate dashboard (AFFILIATE)
/admin/*                    → Admin dashboard (ADMIN only)

API Routes:
/api/auth/login             → POST - Login
/api/auth/logout            → POST - Logout
/api/auth/register          → POST - Register
/api/auth/me                → GET - Current user
/api/user                   → GET - Current user (legacy)
/api/*                      → Other business logic APIs
```

---

## ✅ Checklist for New Developers

**Setup:**
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set `JWT_SECRET` in environment
- [ ] Run `npm run dev`

**Understanding the Foundation:**
- [ ] Read `AGENT_A_FOUNDATION_COMPLETE.md`
- [ ] Review `FRONTEND_FOUNDATION_EXAMPLES.md`
- [ ] Explore `lib/api.ts` for API client usage
- [ ] Explore `lib/auth.ts` for RBAC system
- [ ] Check layout files to understand structure

**Before Adding New Pages:**
- [ ] Determine target role (BUYER, OPS, etc.)
- [ ] Add route to appropriate `NAV_ITEMS` in layout
- [ ] Create page in correct route group folder
- [ ] Use `apiGet/apiPost` for data fetching
- [ ] Follow dark theme styling (slate-950, etc.)

**Before Creating Forms:**
- [ ] Mark component as `"use client"`
- [ ] Import `apiPost` from `@/lib/api`
- [ ] Add loading and error states
- [ ] Handle form submission with try/catch
- [ ] Display errors in friendly UI

---

**Visual Reference Version:** 1.0  
**Last Updated:** 2025-12-14  
**Agent:** Agent A (Foundation)
