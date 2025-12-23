# 🚀 PRISMA SETUP - EXECUTION COMMANDS

## Run these commands in order:

```bash
# Step 1: Install tsx for running TypeScript seed
npm install -D tsx

# Step 2: Generate Prisma Client from new schema
npx prisma generate

# Step 3: Push schema to database (creates all tables)
npx prisma db push

# Step 4: Run seed script
npx prisma db seed

# Step 5: Open Prisma Studio to verify
npx prisma studio
```

## ✅ Expected Output:

### After `prisma generate`:
```
✔ Generated Prisma Client (version x.x.x)
```

### After `prisma db push`:
```
✔ Your database is now in sync with your Prisma schema.
```

### After `prisma db seed`:
```
🌱 Starting seed...
📋 Creating service plans...
👥 Creating users...
📦 Creating products...
💰 Creating wallets...
📝 Creating RFQs...
🛒 Creating orders...
🔗 Creating affiliate links...
✅ Creating verification requests...
⚙️ Creating system config...
🚩 Creating feature flags...
✅ Seed completed successfully!

📊 Summary:
- Users: 9 (1 Admin, 1 Ops, 3 Buyers, 2 Suppliers, 2 Creators, 1 Affiliate)
- Products: 3 (2 Supplier, 1 Creator)
- RFQs: 2 (1 Quoted, 1 Pending)
- Orders: 2 (1 Processing, 1 Shipped)
- Wallets: 3
- Verifications: 3 (2 Approved, 1 Pending)
- Affiliate Links: 1
- System Configs: 4
- Feature Flags: 2
```

## 🎯 Verify Installation:

```bash
# Open Prisma Studio
npx prisma studio
# → Browse your data at http://localhost:5555

# Or query in code:
# import { PrismaClient } from '@prisma/client';
# const prisma = new PrismaClient();
# const users = await prisma.user.findMany();
```

## 💡 Test Logins:

Use these seeded accounts:

### Admin
- Email: `admin@banadama.com`
- Role: ADMIN

### Ops
- Email: `ops@banadama.com`
- Role: OPS

### Buyers
- Email: `john@example.com` (NG)
- Email: `amina@bdstore.bd` (BD)
- Email: `sarah@globalshop.com` (US)

### Suppliers
- Email: `factory@lagostextiles.ng` (Factory, NG)
- Email: `wholesale@dhakatex.bd` (Wholesaler, BD)

### Creators
- Email: `designer@creative.ng` (Digital)
- Email: `photo@snapbd.bd` (Local)

### Affiliate
- Email: `affiliate@marketer.com`

All passwords managed by Supabase Auth.
