# Banadama Platform - Implementation Guide

## ✅ What's Been Implemented

### 1. Core Pricing Engine
- ✅ `lib/pricing.ts` - Full pricing calculation logic
- ✅ `config/pricing.ts` - Static pricing tables and constants
- ✅ `types/pricing.ts` - TypeScript interfaces
- ✅ `tests/unit/pricing.test.ts` - Unit tests (all passing)

### 2. Database Schema
- ✅ `prisma/schema.prisma` - Complete schema with all models
- ✅ `prisma/seed.ts` - Seed file for demo data

### 3. Buyer Request Flow
- ✅ `app/(buyer)/requests/new/page.tsx` - Live pricing calculator
- ✅ `app/api/requests/route.ts` - Create & list requests
- ✅ `app/api/requests/[id]/quote/route.ts` - Ops quote endpoint
- ✅ `app/api/requests/[id]/confirm/route.ts` - Buyer confirm endpoint

### 4. Ops Dashboard
- ✅ `app/(ops)/buyer-requests/page.tsx` - Request management dashboard

## 🚀 Next Steps to Get Everything Working

### Step 1: Set Up Database

1. **Create `.env` file** in the project root:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/banadama?schema=public"
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

2. **Install ts-node** (if not already):
```bash
npm install
```

3. **Push schema to database**:
```bash
npm run db:push
```

4. **Seed demo data**:
```bash
npm run db:seed
```

This will create:
- 3 Service Plans (Basic, Premium, Business)
- 5 Demo Users (buyer, factory, wholesaler, creator, ops)
- 5 Demo Products

### Step 2: Test the Pricing Engine

Run the tests to verify everything works:
```bash
npm test
```

All 7 tests should pass ✅

### Step 3: Test the Buyer Flow

1. Start the dev server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/(buyer)/requests/new`

3. Test the live pricing calculator:
   - Adjust quantity (watch the unit fee change based on tiers)
   - Change category (see duty % change)
   - Change region (see delivery cost change)
   - Switch service plans

4. The pricing breakdown should show:
   - Product Subtotal
   - Special Packaging (₦1000 → ₦880 based on qty)
   - Fulfillment Fee (5.2%)
   - Customs Duty (7-15% based on category)
   - Local Delivery (varies by region)
   - **Total Price**

### Step 4: Implement Remaining Features

#### A. Complete the Buyer Request Submission

Update `app/(buyer)/requests/new/page.tsx`:
- Add form validation
- Wire up the "Submit Request" button to POST to `/api/requests`
- Redirect to requests list after submission

#### B. Create Buyer Requests List Page

Create `app/(buyer)/requests/page.tsx`:
- Fetch and display buyer's requests
- Show status badges
- Link to individual request details

#### C. Create Ops Request Detail Page

Create `app/(ops)/buyer-requests/[id]/page.tsx`:
- Show full request details
- Allow ops to edit pricing
- Button to create quote (POST to `/api/requests/[id]/quote`)

#### D. Implement Supplier Catalog

Create `app/(factory)/catalog/page.tsx` and `app/(wholesaler)/catalog/page.tsx`:
- List supplier's products
- Add/edit product functionality
- Link to `/api/products` endpoints

#### E. Implement Purchase Orders

Create:
- `app/api/purchase-orders/route.ts` - Create POs from Banadama to suppliers
- `app/(factory)/purchase-orders/page.tsx` - View POs
- `app/(wholesaler)/purchase-orders/page.tsx` - View POs

#### F. Add Authentication & Role Protection

Update `app/middleware.ts`:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get user session/JWT
  // Check role matches route group
  // Redirect if unauthorized
  
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/(buyer)')) {
    // Check if user.role === 'BUYER'
  }
  if (path.startsWith('/(ops)')) {
    // Check if user.role === 'OPS'
  }
  // ... etc
  
  return NextResponse.next();
}
```

#### G. Implement Wallet & Payments

1. Start with fake payments in `lib/payment.ts`
2. Create wallet endpoints:
   - `app/api/wallet/buyer/route.ts`
   - `app/api/wallet/supplier/route.ts`
3. Later integrate:
   - Stripe for international payments
   - Local gateways for NGN
   - Wise for supplier payouts

## 📊 Testing Checklist

- [ ] Pricing engine tests pass
- [ ] Database seeded successfully
- [ ] Buyer can see live pricing estimates
- [ ] Buyer can submit requests
- [ ] Ops can view all requests
- [ ] Ops can create quotes
- [ ] Buyer can confirm requests → creates orders
- [ ] Suppliers can view their products
- [ ] Suppliers can receive POs
- [ ] Role-based access control works
- [ ] Payments flow (fake first, then real)

## 🎯 Current Status

**Working:**
- ✅ Pricing engine (fully tested)
- ✅ Database schema
- ✅ Buyer pricing calculator UI
- ✅ API endpoints for requests
- ✅ Ops dashboard

**Needs Implementation:**
- ⏳ Form submission in buyer request page
- ⏳ Buyer requests list page
- ⏳ Ops request detail page
- ⏳ Supplier catalog management
- ⏳ Purchase order system
- ⏳ Authentication middleware
- ⏳ Wallet & payment integration

## 🔧 Useful Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm test                   # Run tests

# Database
npm run db:push            # Push schema to DB
npm run db:seed            # Seed demo data
npm run db:studio          # Open Prisma Studio GUI

# Code Quality
npm run lint               # Run linter
```

## 📝 Notes

- The pricing engine is the **single source of truth** for all pricing calculations
- All prices are stored in **kobo** (smallest unit) in the database
- Pricing snapshots are stored as JSON in orders to preserve historical accuracy
- Buyers never see supplier information directly
- All transactions go through Banadama
