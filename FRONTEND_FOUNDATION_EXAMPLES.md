# FRONTEND FOUNDATION - CODE EXAMPLES

## Example 1: API Client Usage

### Basic GET Request
```typescript
import { apiGet } from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: string;
}

// In a component or API route
const user = await apiGet<User>("/api/auth/me");
console.log(user.email); // Type-safe!
```

### POST Request with Body
```typescript
import { apiPost } from "@/lib/api";

interface LoginResponse {
  success: boolean;
  user: { id: string; email: string; role: string };
  dashboardUrl: string;
}

const result = await apiPost<LoginResponse>("/api/auth/login", {
  email: "buyer@example.com",
  password: "password123",
});

if (result.success) {
  router.push(result.dashboardUrl);
}
```

### Error Handling
```typescript
import { apiPost, isApiError } from "@/lib/api";

try {
  await apiPost("/api/orders/create", orderData);
} catch (error) {
  if (isApiError(error)) {
    // Type-safe error handling
    console.error(`Error ${error.status}: ${error.message}`);
    setErrorMsg(error.message);
  } else {
    setErrorMsg("An unexpected error occurred");
  }
}
```

---

## Example 2: Role Layout Implementation

### Buyer Layout (Server Component)
```typescript
// app/(buyer)/layout.tsx
import { requireRole } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import type { NavItem } from "@/components/layout/SideNav";

const BUYER_NAV_ITEMS: NavItem[] = [
  { href: "/buyer/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/buyer/requests", label: "Requests (RFQ)", icon: "📝" },
  { href: "/buyer/orders", label: "Orders", icon: "🛒" },
  { href: "/buyer/wallet", label: "Wallet", icon: "💰" },
  { href: "/buyer/chat", label: "Messages", icon: "💬" },
];

const BUYER_QUICK_ACTIONS = [
  { href: "/buyer/requests/new", label: "Create RFQ", icon: "+", color: "text-emerald-400" },
  { href: "/marketplace", label: "Browse Marketplace", icon: "🛍️", color: "text-purple-400" },
];

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  // 🔐 RBAC: Only BUYER role can access
  await requireRole("BUYER");

  return (
    <DashboardShell
      topNav={{ roleName: "Buyer", roleColor: "emerald" }}
      navItems={BUYER_NAV_ITEMS}
      quickActions={BUYER_QUICK_ACTIONS}
    >
      {children}
    </DashboardShell>
  );
}
```

**What happens:**
1. User navigates to `/buyer/dashboard`
2. Layout runs `await requireRole("BUYER")`
3. If not logged in → redirect to `/auth/login`
4. If logged in as wrong role → redirect to `/auth/forbidden`
5. If logged in as BUYER → render DashboardShell with children

---

## Example 3: Dashboard Page Implementation

### Buyer Dashboard Page
```typescript
// app/(buyer)/buyer/dashboard/page.tsx
import { apiGet } from "@/lib/api";

interface DashboardStats {
  totalRequests: number;
  pendingOrders: number;
  walletBalance: number;
}

export default async function BuyerDashboardPage() {
  // Server Component - fetch data directly
  const stats = await apiGet<DashboardStats>("/api/buyer/stats");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-50">
        Buyer Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Requests"
          value={stats.totalRequests}
          icon="📝"
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon="🛒"
        />
        <StatCard
          label="Wallet Balance"
          value={`$${stats.walletBalance.toFixed(2)}`}
          icon="💰"
        />
      </div>

      {/* More dashboard content */}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-slate-50">{value}</p>
    </div>
  );
}
```

---

## Example 4: Client Component Form

### Create RFQ Form (Client Component)
```typescript
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

interface RFQFormData {
  productName: string;
  quantity: number;
  targetPrice: number;
  description: string;
}

export default function CreateRFQPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: RFQFormData = {
      productName: formData.get("productName") as string,
      quantity: Number(formData.get("quantity")),
      targetPrice: Number(formData.get("targetPrice")),
      description: formData.get("description") as string,
    };

    try {
      const result = await apiPost<{ id: string }>("/api/rfq/create", data);
      router.push(`/buyer/requests/${result.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create RFQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-50 mb-6">
        Create New RFQ
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              required
              min="1"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Target Price (USD)
            </label>
            <input
              type="number"
              name="targetPrice"
              required
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create RFQ"}
        </button>
      </form>
    </div>
  );
}
```

---

## Example 5: Using RoleRedirect

### Home Page with Auto-Redirect
```typescript
// app/page.tsx
import { RoleRedirect } from "@/components/layout/RoleRedirect";

export default async function HomePage() {
  // If user is logged in, redirect to their role dashboard
  await RoleRedirect({ ifAuthenticated: true });

  // This only renders if user is NOT logged in
  return (
    <div className="min-h-screen bg-slate-950">
      <h1>Welcome to Banadama</h1>
      <p>Please log in to continue</p>
      <a href="/auth/login">Login</a>
      <a href="/auth/register">Register</a>
    </div>
  );
}
```

---

## Example 6: API Route with RBAC

### Protected API Route (Ops Only)
```typescript
// app/api/ops/rfqs/route.ts
import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  // Check if user is OPS or ADMIN
  const { user, error } = await requireApiRole(["OPS", "ADMIN"]);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  // User is authorized, fetch data
  const rfqs = await db.request.findMany({
    where: { status: "PENDING" },
    include: {
      buyer: { select: { email: true } },
      product: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    success: true,
    rfqs,
  });
}
```

---

## Example 7: Multi-Role Layout

### Admin Layout (Allows ADMIN only)
```typescript
// app/(admin)/layout.tsx
import { requireRole } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";

const ADMIN_NAV_ITEMS = [
  { href: "/admin/overview", label: "Overview", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/verifications", label: "Verifications", icon: "✓" },
  { href: "/admin/payouts", label: "Payouts", icon: "💵" },
  { href: "/admin/wallets", label: "Wallets", icon: "💰" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Only ADMIN role
  await requireRole("ADMIN");

  return (
    <DashboardShell
      topNav={{ roleName: "Admin", roleColor: "slate" }}
      navItems={ADMIN_NAV_ITEMS}
    >
      {children}
    </DashboardShell>
  );
}
```

### Ops Layout (Allows OPS + ADMIN)
```typescript
// app/(ops)/layout.tsx
import { requireRole } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";

const OPS_NAV_ITEMS = [
  { href: "/ops/overview", label: "Overview", icon: "📊" },
  { href: "/ops/rfqs", label: "Buyer Requests", icon: "📝" },
  { href: "/ops/quotes", label: "Quotes", icon: "💰" },
  { href: "/ops/orders", label: "Orders", icon: "🛒" },
  { href: "/ops/verifications", label: "Verifications", icon: "✓" },
  { href: "/ops/messages", label: "Messages", icon: "💬" },
];

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  // Allow OPS and ADMIN
  await requireRole(["OPS", "ADMIN"]);

  return (
    <DashboardShell
      topNav={{ roleName: "Ops", roleColor: "orange" }}
      navItems={OPS_NAV_ITEMS}
    >
      {children}
    </DashboardShell>
  );
}
```

---

## Color Scheme Reference

```typescript
// TopNav roleColor options
const colorMapping = {
  emerald: "text-emerald-400",  // Buyer
  orange: "text-orange-400",    // Ops
  purple: "text-purple-400",    // Creator
  blue: "text-blue-400",        // Factory, Wholesaler
  amber: "text-amber-400",      // Affiliate
  pink: "text-pink-400",        // (unused)
  slate: "text-slate-400",      // Admin
};
```

---

## Testing Checklist

✅ **Login Flow**
1. Visit `/auth/login`
2. Enter valid credentials
3. Should redirect to role dashboard
4. TopNav should show role badge
5. SideNav should show role-specific nav items
6. Logout button should work

✅ **RBAC Enforcement**
1. Login as BUYER
2. Try to access `/ops/overview`
3. Should redirect to `/auth/forbidden`
4. Try to access `/buyer/dashboard`
5. Should work normally

✅ **API Client**
1. Make GET request to `/api/auth/me`
2. Should return current user
3. Make POST request with invalid data
4. Should throw ApiError with status/message

✅ **Registration Flow**
1. Visit `/auth/register`
2. Fill in name, email, password
3. Click Continue
4. Select role (restricted roles may be disabled)
5. Click Create Account
6. Should redirect to role dashboard

---

**End of Examples**
