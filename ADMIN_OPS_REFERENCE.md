# ADMIN & OPS QUICK REFERENCE

**Banadama Platform - Suppliers Mode**
**Last Updated:** 2025-12-18

---

## ADMIN DASHBOARD (`/admin/studio/*`)

### Categories Management
**Path:** `/admin/studio/categories`

**Actions:**
1. Create new category (name, slug, enabled checkbox)
2. Edit existing category
3. Disable/enable category (soft delete)

**Fields:**
- Name: Display name (e.g., "Textile")
- Slug: URL-friendly identifier (e.g., "textile")
- Enabled: Active checkbox

---

### Locations Management  
**Path:** `/admin/studio/locations`

**Actions:**
1. Create new location (country, state, city)
2. Edit existing location
3. Disable/enable location

**Fields:**
- Country: NG (Nigeria) or BD (Bangladesh)
- State: State/division name
- City: City name (optional)
- Enabled: Active checkbox

---

### Verifications & Ticks
**Path:** `/admin/studio/verifications`

**Admin Can:**
1. View pending verification requests
2. Set verification tick for any account:
   - NONE (no tick)
   - BLUE_TICK (verified supplier)
   - GREEN_TICK (premium verified supplier)

**Tick Visibility:**
- Appears on marketplace product cards
- Appears on supplier profile headers
- Increases buyer trust

---

### Feature Flags
**Path:** `/admin/studio/features`

**Toggles:**
- `NEAR_ME_ENABLED` → Buy Near Me local trading
- `GLOBAL_MARKET_ENABLED` → Global Marketplace
- `CREATORS_ENABLED` → Creators marketplace
- `AFFILIATE_ENABLED` → Affiliate program
- `CART_ENABLED` → Shopping cart
- `RFQ_ENABLED` → Request for Quote

**Impact:** Immediately affects platform navigation and available features

---

### Market Control
**Path:** `/admin/studio/market-control`

**Settings (JSON):**
```json
{
  "defaultCurrency": "USD",
  "maxUploadSizeMb": 25,
  "minOrderValue": 0,
  "search": { "maxResults": 60 }
}
```

---

### Trade Control
**Path:** `/admin/studio/trade-control`

**Phase 1 Settings (Current):**
```json
{
  "globalBuyOnlyEnabled": true,
  "countriesAllowedToBuy": ["NG", "BD"],
  "countriesAllowedToSell": ["NG", "BD"],
  "internationalSellingEnabled": false
}
```

**Phase 2 (Future):** Set `internationalSellingEnabled: true`

---

### Users & Accounts Management
**Paths:** `/admin/studio/users`, `/admin/studio/accounts`

**User Roles:**
- BUYER
- OPS
- FACTORY
- WHOLESALER
- RETAIL
- CREATOR
- AFFILIATE
- ADMIN
- FINANCE_ADMIN

**User Status:**
- ACTIVE
- SUSPENDED
- BANNED

**Account Types:**
- BUYER
- FACTORY
- WHOLESALER
- RETAIL
- CREATOR

---

## OPS DASHBOARD (`/ops/*`)

### Buyer Requests (RFQ Management)
**Path:** `/ops/buyer-requests/[id]`

**Ops Actions:**
1. **Assign Supplier**
   - Select verified supplier from dropdown
   - Click "Assign" button
   - Toast confirmation

2. **Generate Quote**
   - Enter items total (₦)
   - Enter shipping (₦)
   - Enter fees (₦)
   - Add notes for buyer
   - Click "Send Quote"
   - Toast confirmation

**Flow:**
```
Buyer submits RFQ 
  ↓
Ops assigns supplier
  ↓
Ops generates quote
  ↓
Buyer approves
  ↓
Order created
```

---

### Orders Management
**Path:** `/ops/orders/[id]`

**Ops Can:**
- View order details
- Update order status
- Message supplier
- Monitor delivery progress

**Order Statuses:**
- PENDING
- CONFIRMED
- IN_PRODUCTION
- READY_TO_SHIP
- SHIPPED
- DELIVERED
- CANCELLED

---

### Messages (Ops ↔ Supplier)
**Path:** `/ops/messages`

**Rules:**
- Ops mediates all buyer-supplier communication
- No direct buyer-supplier chat
- Thread-based messaging
- Press Enter or click "Send"

---

### Verifications
**Path:** `/ops/verifications`

**Ops View:**
- Read-only access to pending verification requests
- Cannot approve/reject (Admin only)
- Can contact supplier for clarifications via messages

**Routing Note:** "Admin sets ticks in Admin Studio"

---

## SUPPLIER DASHBOARDS

### Factory Dashboard
**Path:** `/factory/*`

**Key Pages:**
- `/factory/products` - Manage products
- `/factory/purchase-orders` - View/update POs
- `/factory/messages` - Communicate with Ops

---

### Wholesaler Dashboard
**Path:** `/wholesaler/*`

**Key Pages:**
- `/wholesaler/products` - Manage products
- `/wholesaler/purchase-orders` - View/update POs
- `/wholesaler/messages` - Communicate with Ops

---

### Retail Dashboard
**Path:** `/retail/*`

**Key Pages:**
- `/retail/products` - Manage products
- `/retail/purchase-orders` - View/update POs
- `/retail/messages` - Communicate with Ops

---

## PRODUCT MODES

Suppliers can enable:

### Buy Now Only
- Shows Buy Now button
- Direct purchase flow
- Instant checkout

### RFQ Only
- Shows Request Quote button
- Ops-mediated negotiation
- Custom pricing

### Both (Buy Now + RFQ)
- Shows both buttons
- Buyer chooses flow
- Maximum flexibility

**Global Mode:** RFQ is hidden (buy-only enforcement)

---

## FINANCE ADMIN

**Access:** FINANCE_ADMIN role only

### Escrow Release
**Path:** `/admin/finance/escrow`

**Action:** Release escrowed funds to supplier after delivery confirmation

**Endpoint:** `POST /api/admin/finance/escrow/[id]/release`

---

### Refunds
**Path:** `/admin/finance/refunds`

**Action:** Process buyer refunds for cancelled/failed orders

**Endpoint:** `POST /api/admin/finance/orders/[id]/refund`

---

## RBAC SUMMARY

| Role | Access |
|------|--------|
| **ADMIN** | Full studio controls (categories, locations, users, accounts, flags, ticks) |
| **FINANCE_ADMIN** | Escrow release, refunds |
| **OPS** | RFQ assignment, quote generation, order monitoring, messaging |
| **FACTORY** | Product management, order fulfillment |
| **WHOLESALER** | Product management, order fulfillment |
| **RETAIL** | Product management, order fulfillment |
| **BUYER** | Browse, buy, request quotes |

---

## TOAST NOTIFICATIONS

All actions provide instant feedback via toast:

- ✅ **Success** (Green) - Action completed
- ❌ **Error** (Red) - Action failed
- ℹ️ **Info** (Blue) - Processing/redirecting
- ⚠️ **Warning** (Yellow) - Validation issue

**No alert() popups** - All feedback is non-blocking and user-friendly

---

## COUNTRY RULES

### Bangladesh (BD)
- **Supplier Focus:** Factory, Wholesaler
- **Categories:** Textile, Packaging, Footwear, Home Textile
- **Local Mode:** Buy Near Me enabled

### Nigeria (NG)
- **Supplier Focus:** Wholesaler, Retail
- **Categories:** Packaging (NG), Fashion
- **Local Mode:** Buy Near Me enabled

---

## SUPPORT CONTACTS

**Admin Issues:** Contact platform admin
**Ops Support:** Contact ops team lead
**Finance Queries:** Contact finance admin
**Technical Support:** Contact development team

---

**END OF QUICK REFERENCE**
