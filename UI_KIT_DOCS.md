# Banadama UI Kit - Documentation

## Overview

The Banadama UI Kit provides consistent design tokens and components for both web (Next.js) and mobile (React Native) platforms.

---

## Design Tokens

### CSS Tokens (`styles/tokens.css`)

```css
:root {
  --bd-brand: 152 60% 40%;      /* Primary green */
  --bd-brand-2: 210 90% 55%;    /* Accent blue */
  --bd-bg: 0 0% 100%;           /* Background */
  --bd-fg: 222 47% 11%;         /* Foreground text */
  --bd-muted: 220 14% 96%;      /* Muted backgrounds */
  --bd-border: 220 13% 91%;     /* Borders */
  --bd-success: 142 71% 45%;    /* Success green */
  --bd-warning: 38 92% 50%;     /* Warning orange */
  --bd-danger: 0 84% 60%;       /* Danger red */
  --bd-radius: 18px;            /* Border radius */
}
```

### Mobile Tokens (`mobile/tokens.ts`)

```ts
import { tokens } from "./tokens";

tokens.brand      // "#2E9E5B"
tokens.brand2     // "#3B82F6"
tokens.spacing.lg // 16
tokens.radius.md  // 14
tokens.fontSize.md // 16
```

---

## Web Components

### UI Components

| Component | Import | Purpose |
|-----------|--------|---------|
| `Button` | `@/components/ui` | Primary action buttons |
| `Card` | `@/components/ui` | Content containers |
| `Badge` | `@/components/ui` | Status labels |
| `StatusBadge` | `@/components/ui` | Order/product status |
| `DataTable` | `@/components/ui` | Data tables |
| `ConfirmDialog` | `@/components/ui` | Confirmation modals |
| `EmptyState` | `@/components/ui` | Empty state placeholders |
| `Loading` | `@/components/ui` | Loading spinners |

### Layout Components

| Component | Import | Purpose |
|-----------|--------|---------|
| `DashboardShell` | `@/components/layout` | Dashboard wrapper |
| `SideNav` | `@/components/layout` | Sidebar navigation |
| `TopNav` | `@/components/layout` | Top navigation bar |
| `AccountSwitch` | `@/components/layout` | Account switcher |

### Section Components

| Component | Import | Purpose |
|-----------|--------|---------|
| `Hero` | `@/components/sections` | Landing hero |
| `WhyBanadama` | `@/components/sections` | Feature cards |
| `HowItWorks` | `@/components/sections` | Step cards |
| `CTA` | `@/components/sections` | Call to action |
| `Footer` | `@/components/sections` | Footer |

---

## Usage Examples

### Button

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="lg" onClick={handleClick}>
  Start Sourcing
</Button>
```

**Variants:** `primary` | `soft` | `ghost` | `danger`
**Sizes:** `sm` | `md` | `lg`

### Card

```tsx
import { Card, CardBody, CardHeader } from "@/components/ui";

<Card>
  <CardHeader>
    <h2>Order Details</h2>
  </CardHeader>
  <CardBody>
    <p>Content here...</p>
  </CardBody>
</Card>
```

### Badge

```tsx
import { Badge } from "@/components/ui";

<Badge variant="success">✓ Verified</Badge>
```

**Variants:** `default` | `success` | `warning` | `danger`

### StatusBadge

```tsx
import { StatusBadge } from "@/components/ui";

<StatusBadge status="DELIVERED" />
```

**Statuses:** `PENDING` | `ACTIVE` | `CONFIRMED` | `IN_TRANSIT` | `DELIVERED` | `CANCELLED` | `IN_STOCK` | `LOW_STOCK` | `OUT_OF_STOCK` | `VERIFIED` | `SUSPENDED`

### DataTable

```tsx
import { DataTable } from "@/components/ui";

<DataTable
  title="Orders"
  columns={[
    { key: "id", label: "ID" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ]}
  rows={orders}
  onRowClick={(row) => router.push(`/orders/${row.id}`)}
/>
```

### DashboardShell

```tsx
import { DashboardShell } from "@/components/layout";

<DashboardShell
  title="Dashboard"
  nav={[
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/orders", label: "Orders", icon: "📦" },
  ]}
>
  {children}
</DashboardShell>
```

### PricingBreakdownCard

```tsx
import { PricingBreakdownCard } from "@/components/pricing/PricingBreakdownCard";

<PricingBreakdownCard
  items={[
    { label: "Product Cost", amount: 500000 },
    { label: "Platform Fee", amount: 25000 },
    { label: "Shipping", amount: 15000 },
  ]}
  total={540000}
  currency="₦"
/>
```

### StepTimeline

```tsx
import { StepTimeline } from "@/components/timeline/StepTimeline";

<StepTimeline
  steps={[
    { label: "Order Placed", description: "Dec 15, 2024" },
    { label: "Processing", description: "In progress" },
    { label: "Shipped" },
    { label: "Delivered" },
  ]}
  current={1}
/>
```

---

## Mobile Components

### Button (React Native)

```tsx
import { Button } from "@/mobile/components";

<Button 
  title="Start Sourcing" 
  variant="primary" 
  onPress={handlePress} 
/>
```

### Card (React Native)

```tsx
import { Card, CardBody } from "@/mobile/components";

<Card>
  <CardBody>
    <Text>Content here...</Text>
  </CardBody>
</Card>
```

### Badge (React Native)

```tsx
import { Badge } from "@/mobile/components";

<Badge variant="success">Verified</Badge>
```

---

## CSS Classes

### Layout

| Class | Purpose |
|-------|---------|
| `.bd-container` | Max-width container |
| `.bd-grid` | Grid layout |
| `.bd-row` | Flexbox row |

### Components

| Class | Purpose |
|-------|---------|
| `.bd-card` | Card styling |
| `.bd-card-pad` | Card padding |
| `.bd-btn` | Button base |
| `.bd-btn-primary` | Primary button |
| `.bd-btn-soft` | Soft button |
| `.bd-btn-danger` | Danger button |
| `.bd-badge` | Badge styling |

### Typography

| Class | Purpose |
|-------|---------|
| `.bd-h1` | Heading 1 |
| `.bd-h2` | Heading 2 |
| `.bd-h3` | Heading 3 |
| `.bd-p` | Paragraph |
| `.bd-small` | Small text |

### Forms

| Class | Purpose |
|-------|---------|
| `.bd-input` | Input field |
| `.bd-label` | Form label |

### Tables

| Class | Purpose |
|-------|---------|
| `.bd-table` | Table styling |
| `.bd-table-wrap` | Table wrapper |
| `.bd-table-empty` | Empty state |

---

## File Structure

```
components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── StatusBadge.tsx
│   ├── DataTable.tsx
│   ├── ConfirmDialog.tsx
│   ├── EmptyState.tsx
│   ├── Loading.tsx
│   └── index.ts
├── layout/
│   ├── DashboardShell.tsx
│   ├── SideNav.tsx
│   ├── TopNav.tsx
│   ├── AccountSwitch.tsx
│   └── index.ts
├── pricing/
│   └── PricingBreakdownCard.tsx
├── timeline/
│   └── StepTimeline.tsx
└── sections/
    ├── Hero.tsx
    ├── TrustBadges.tsx
    ├── WhyBanadama.tsx
    ├── HowItWorks.tsx
    ├── CTA.tsx
    ├── Footer.tsx
    └── index.ts

styles/
├── tokens.css
├── ui.css
└── tables.css

mobile/
├── tokens.ts
└── components/
    ├── Button.tsx
    ├── Card.tsx
    ├── Badge.tsx
    └── index.ts
```

---

*Banadama UI Kit v1.0*
