# Admin vs Ops Governance Model

## Overview

This document defines the clear separation of authority between **Admin** and **Ops** roles in the Banadama platform.

> **ADMIN = POLICY & CONTROL** (rules, market structure)
> **OPS = EXECUTION & OPERATIONS** (day-to-day work)

They do **not** overlap.

---

## Admin = The Brain 🧠

Admin does NOT manage individual orders daily.
Admin defines and controls **the rules under which Ops operates**.

### Admin Route: `/admin/studio/*`

### Admin Has Authority Over:

#### A) System & Market Control (`/admin/studio/market-control`)
- Enable/Disable countries (NG/BD)
- Enable/Disable categories
- Enable/Disable Buy Now / RFQ per category
- Market modes (Local only, Global buy-only)

#### B) Users & Accounts (`/admin/studio/users`, `/admin/studio/accounts`)
- Create users
- Link multiple accounts to one user
- Enable/Disable/Freeze accounts
- Assign account types (Buyer, Wholesaler, Creator, etc.)

#### C) Verification & Trust (`/admin/studio/verifications`)
- Assign 🔵 Blue tick
- Assign 🟢 Green tick
- Upgrade/downgrade verification
- Remove verification

#### D) Pricing & Fees (`/admin/studio/pricing`)
- Platform commission
- Category-based fees
- Country-based fees
- Escrow rules

#### E) Content & CMS (`/admin/studio/content`)
- Landing pages
- Footer
- Terms & Privacy
- Banners and announcements

#### F) Feature Flags (`/admin/studio/features`)
- RFQ ON/OFF
- Buy Now ON/OFF
- Near Me ON/OFF
- Creators ON/OFF
- Affiliate ON/OFF

#### G) Admin Governance (`/admin/studio/admins`)
- Add/remove admins
- Admin roles: SUPER_ADMIN, OPS_ADMIN, FINANCE_ADMIN, CONTENT_ADMIN
- Audit log (who changed what)

#### H) Dispute Resolution (`/admin/studio/disputes`)
- Final authority on disputes
- Issue refunds
- Apply supplier penalties
- Override payouts

---

## Ops = The Hands 🤲

Ops does NOT change market rules.
Ops operates **strictly within rules set by Admin**.

### Ops Route: `/ops/*`

### Ops Has Authority Over:

#### A) RFQ & Order Flow (`/ops/rfqs`, `/ops/orders`)
- View RFQ queue
- Assign suppliers
- Generate quotes
- Track order status
- Mark orders as shipped/delivered (based on proof)

#### B) Communication (`/ops/messages`)
- Buyer ↔ Ops chat
- Supplier ↔ Ops chat
- Resolve confusion
- Escalate issues

#### C) Disputes - LIMITED (`/ops/disputes`)
- Review disputes
- Add internal notes
- Mark as "Investigating"
- **Recommend** actions: Release / Partial Release / Hold
- ❗ Ops does NOT have final authority — Admin/Finance makes final decisions

#### D) Verification Review - NOT Assignment (`/ops/verifications`)
- Review submitted documents
- Mark as "Recommended for BLUE/GREEN"
- Forward to Admin for final decision
- ⚠️ Ops CANNOT assign verification ticks

#### E) Daily Operations (`/ops/reports`)
- Monitor delays
- Follow up with suppliers
- Daily reports
- KPI tracking

---

## ❌ What Ops MUST NOT Do

| Action | Why Not |
|--------|---------|
| Change fees | Policy decision - Admin only |
| Enable/disable features | Market control - Admin only |
| Assign Green tick | Trust decision - Admin only |
| Freeze accounts | Compliance decision - Admin only |
| Edit landing pages | Brand control - Admin only |
| Final dispute resolution | Financial authority - Admin/Finance only |
| Override payouts | Financial authority - Admin/Finance only |

---

## Technical Enforcement

### API Level
```typescript
// OPS APIs enforce LIMITED authority
const ALLOWED_OPS_STATUS_UPDATES = {
  CONFIRMED: ['PROCESSING'],
  PROCESSING: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
};

// OPS cannot resolve disputes
const ALLOWED_OPS_DISPUTE_STATUS = ['INVESTIGATING'];

// OPS cannot assign verification
// OPS can only RECOMMEND
```

### Page Level
All Ops pages show "LIMITED AUTHORITY" warnings.

### RBAC
- `/admin/*` routes: `requireRole('ADMIN')`
- `/ops/*` routes: `requireRole(['OPS', 'ADMIN'])`

---

## Why This Model Works

1. **Prevents abuse of power** - Clear boundaries prevent overreach
2. **Simplifies scaling** - Ops can be scaled without security risks
3. **Protects trust** - Only Admin can make trust decisions
4. **Aligns with proven platforms:**
   - Amazon (Admin vs Seller Support)
   - Alibaba (Admin vs Trade Assurance Ops)

---

## Summary

| Role | Authority | Route |
|------|-----------|-------|
| **Admin** | Policy, Control, Rules, Final Decisions | `/admin/studio/*` |
| **Ops** | Execution, Day-to-Day, Recommendations | `/ops/*` |

**Admin = The Brain**
**Ops = The Hands**
