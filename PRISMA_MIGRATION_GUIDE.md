# 🗄️ PRISMA SCHEMA & MIGRATION GUIDE

## Generated: December 14, 2025

---

## 📋 SCHEMA OVERVIEW

### Complete Implementation
✅ **15 Enums** defined  
✅ **35+ Models** created  
✅ **All relationships** configured  
✅ **Indexes** optimized  
✅ **Cascade deletes** set up

---

## 🎯 KEY MODELS IMPLEMENTED

### **Core User Models**
- `User` - Base user model with role
- `BuyerProfile`
- `SupplierProfile` (with `SupplierType`: FACTORY/WHOLESALER)
- `CreatorProfile` (with `CreatorType`: digital/local)
- `AffiliateProfile`

### **Business Logic**
- `Product` (supplier or creator owned)
- `Request` (RFQ system)
- `Order` (with escrow flow)
- `Wallet` + `Transaction` (escrow + payments)

### **Creator System**
- `CreatorJob` (local service jobs)
- Product ownership for digital creators

### **Messaging**
- `Conversation`
- `ConversationParticipant`
- `Message` (Ops-mediated)
- `ConversationType`: BUYER_OPS, SUPPLIER_OPS, CREATOR_OPS

### **Affiliate System**
- `AffiliateLink`
- `AffiliateClick` (tracking)
- `AffiliateConversion` (SALE, VERIFIED_SUPPLIER)
- `AffiliatePayout` (withdrawal requests)

### **Verification**
- `VerificationRequest`
- `VerificationType`: USER_KYC, SUPPLIER, CREATOR
- `VerificationStatus`: PENDING, UNDER_REVIEW, APPROVED, REJECTED

### **Admin**
- `AdminAuditLog` (all admin actions)
- `SystemConfig` (platform settings)
- `PricingOverride` (custom buyer pricing)
- `FeatureFlag` (gradual rollout)
- `UserSession` (session tracking)

---

## 🚀 MIGRATION STEPS

### **Step 1: Install Dependencies**

```bash
npm install prisma @prisma/client
npm install -D tsx  # For running TypeScript seed script
```

### **Step 2: Set Environment Variables**

Create or update `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/banadama?schema=public"

# Example with Supabase:
# DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].superbase.co:5432/postgres"
```

### **Step 3: Push Schema to Database**

```bash
# This will create all tables without migration files
npx prisma db push

# If you want migration history:
npx prisma migrate dev --name init
```

### **Step 4: Generate Prisma Client**

```bash
npx prisma generate
```

### **Step 5: Run Seed Script**

```bash
# Add to package.json first:
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}

# Then run:
npx prisma db seed

# Or run directly:
npx tsx prisma/seed.ts
```

### **Step 6: Verify in Prisma Studio**

```bash
npx prisma studio
# Opens at http://localhost:5555
```

---

## 📊 SEED DATA CREATED

### **Users (9 total)**
- 1 Admin: `admin@banadama.com`
- 1 Ops: `ops@banadama.com`
- 3 Buyers: 
  - `john@example.com` (NG - Local)
  - `amina@bdstore.bd` (BD - Local)
  - `sarah@globalshop.com` (US - Global)
- 2 Suppliers:
  - Lagos Textiles Factory (NG)
  - Dhaka Textiles Wholesale (BD)
- 2 Creators:
  - Creative Designs NG (Digital - Graphic Designer)
  - Snap Photography BD (Local - Photographer)
- 1 Affiliate: `affiliate@marketer.com`

### **Products (3)**
- Custom T-Shirts (Supplier 1)
- Cotton Fabric Rolls (Supplier 2)
- Professional Logo Design (Creator 1)

### **RFQs (2)**
- 1 with QUOTED status (ready to accept)
- 1 with PENDING status (waiting for Ops)

### **Orders (2)**
- 1 PROCESSING
- 1 SHIPPED (with tracking number)

### **Wallets (3)**
- Buyer 1: ₦5,000 available, ₦1,500 locked
- Supplier 1: ₦25,000
- Creator 1: ₦10,000

### **Verifications (3)**
- 2 APPROVED (Supplier 1 + Creator 1)
- 1 PENDING (New supplier)

### **Affiliate Data**
- 1 Active link
- 2 Conversions (1 sale, 1 supplier referral)

### **System Config (4)**
- Default currency (NGN)
- Fulfillment rate (5.2%)
- Affiliate commission rates

### **Feature Flags (2)**
- Group Buy: Enabled
- Affiliate System: Enabled

---

## 🔍 VERIFY WITH QUERIES

```typescript
// In your code or Prisma Studio console

// Get all users with profiles
const users = await prisma.user.findMany({
  include: {
    buyerProfile: true,
    supplierProfile: true,
    creatorProfile: true,
    affiliateProfile: true,
  },
});

// Get all RFQs with buyer and supplier
const rfqs = await prisma.request.findMany({
  include: {
    buyer: { include: { user: true } },
    supplier: { include: { user: true } },
    product: true,
  },
});

// Get all orders with pricing
const orders = await prisma.order.findMany({
  include: {
    buyer: { include: { user: true } },
    supplier: { include: { user: true } },
  },
});

// Get wallet balances
const wallets = await prisma.wallet.findMany({
  include: {
    user: { select: { email: true } },
  },
});

// Get pending verifications
const pendingVerifications = await prisma.verificationRequest.findMany({
  where: { status: 'PENDING' },
  include: { user: true },
});
```

---

## 🎨 SCHEMA HIGHLIGHTS

### **Enums Implemented**

```prisma
enum Role {
  BUYER, SUPPLIER, FACTORY, WHOLESALER,
  CREATOR, OPS, AFFILIATE, ADMIN
}

enum CreatorType {
  GRAPHIC_DESIGNER, MOCK_DESIGNER,    // Digital (Global)
  MODEL, PHOTOGRAPHER, VIDEOGRAPHER   // Local (NG/BD)
}

enum VerificationType {
  USER_KYC, SUPPLIER, CREATOR
}

enum RequestStatus {
  PENDING, QUOTED, APPROVED, REJECTED
}

enum OrderStatus {
  PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED
}

enum TransactionType {
  DEPOSIT, WITHDRAWAL, 
  PAYMENT_ESCROW, PAYMENT_RELEASE, 
  REFUND, COMMISSION, SUBSCRIPTION_FEE
}

enum ConversationType {
  BUYER_OPS, SUPPLIER_OPS, CREATOR_OPS
}
```

### **Key Relations**

```prisma
User 1:1 Wallet
User 1:1 BuyerProfile/SupplierProfile/CreatorProfile/AffiliateProfile
BuyerProfile 1:N Request
BuyerProfile 1:N Order
SupplierProfile 1:N Product
SupplierProfile 1:N Request (assigned)
SupplierProfile 1:N Order
CreatorProfile 1:N Product (digital)
CreatorProfile 1:N CreatorJob (local services)
Request 1:N Order
Wallet 1:N Transaction
Conversation 1:N Message
Conversation 1:N ConversationParticipant
```

### **Indexes Added**

```prisma
// For performance on common queries
@@index([userId])
@@index([status])
@@index([type])
@@index([createdAt])
@@index([supplierId])
@@index([buyerId])
```

---

## 🔄 MIGRATION COMMANDS

```bash
# Push to database (no migration files)
npx prisma db push

# Create migration (with history)
npx prisma migrate dev --name add_chat_system

# Deploy to production
npx prisma migrate deploy

# Reset database (DANGER: deletes all data)
npx prisma migrate reset

# Generate client after schema changes
npx prisma generate

# Format schema file
npx prisma format
```

---

## 🎯 NEXT STEPS

1. **Run Migration**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

2. **Seed Database**
   ```bash
   npx prisma db seed
   ```

3. **Open Prisma Studio**
   ```bash
   npx prisma studio
   ```

4. **Test in Code**
   ```typescript
   import { PrismaClient } from '@prisma/client';
   const prisma = new PrismaClient();
   
   // Use in your API routes
   const users = await prisma.user.findMany();
   ```

---

**Generated by Prisma Engineer**  
**Schema Version:** 2.0  
**Last Updated:** December 14, 2025
