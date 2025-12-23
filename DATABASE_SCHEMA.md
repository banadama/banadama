# Banadama Platform - Database Schema
## Supabase PostgreSQL Schema

### Overview
This schema supports the multi-role architecture with clear ownership and visibility controls.

---

## 📊 Core Tables

### 1. **users** (extends Supabase auth.users)
```sql
-- Extends Supabase auth.users with additional profile data
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  
  -- Role & Status
  role TEXT NOT NULL CHECK (role IN ('buyer', 'factory', 'wholesaler', 'creator', 'admin')),
  creator_type TEXT CHECK (creator_type IN ('model', 'mock_designer', 'graphic_designer', 'photographer', 'videographer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification')),
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  kyc_submitted_at TIMESTAMPTZ,
  kyc_approved_at TIMESTAMPTZ,
  
  -- Preferences
  preferred_language TEXT DEFAULT 'en',
  preferred_currency TEXT DEFAULT 'USD',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_email ON public.users(email);
```

---

### 2. **companies**
```sql
-- Business entities for factories, wholesalers, and verified buyers
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  owner_role TEXT NOT NULL CHECK (owner_role IN ('buyer', 'factory', 'wholesaler')),
  
  -- Company Info
  name TEXT NOT NULL,
  legal_name TEXT,
  registration_number TEXT,
  tax_id TEXT,
  
  -- Contact
  email TEXT,
  phone TEXT,
  website TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  country TEXT NOT NULL,
  postal_code TEXT,
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verification_documents JSONB, -- Array of document URLs
  verified_at TIMESTAMPTZ,
  
  -- Business Details
  business_type TEXT, -- 'manufacturer', 'distributor', 'retailer', etc.
  annual_revenue TEXT,
  employee_count TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_companies_owner ON public.companies(owner_id);
CREATE INDEX idx_companies_owner_role ON public.companies(owner_role);
CREATE INDEX idx_companies_country ON public.companies(country);
```

---

### 3. **products**
```sql
-- Universal products table for all types
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  owner_role TEXT NOT NULL CHECK (owner_role IN ('buyer', 'factory', 'wholesaler', 'creator', 'admin_b2c')),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  
  -- Product Type & Visibility
  product_type TEXT NOT NULL CHECK (product_type IN ('b2c', 'b2b', 'design')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'factories_only', 'wholesalers_only', 'buyers_only', 'private')),
  
  -- Basic Info
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  
  -- Categorization
  category TEXT, -- 'clothing', 'accessories', 'footwear', 'design_mockup', etc.
  subcategory TEXT,
  tags TEXT[], -- Array of tags for search
  
  -- Pricing
  base_price_usd DECIMAL(10,2),
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER,
  
  -- Physical Properties (for physical products)
  weight_kg DECIMAL(8,3),
  volume_cbm DECIMAL(8,4),
  dimensions_cm JSONB, -- {length, width, height}
  
  -- Design-specific fields
  design_type TEXT CHECK (design_type IN ('mockup', 'graphic', 'photo', 'video', '3d_model')),
  design_files JSONB, -- Array of file URLs and metadata
  license_type TEXT CHECK (license_type IN ('exclusive', 'non_exclusive', 'royalty_free')),
  
  -- Media
  images JSONB, -- Array of image URLs
  primary_image_url TEXT,
  videos JSONB, -- Array of video URLs
  
  -- Inventory (for B2C/B2B)
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  
  -- Manufacturing (for B2B)
  lead_time_days INTEGER,
  production_capacity_monthly INTEGER,
  minimum_moq INTEGER, -- Minimum MOQ for bulk orders
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'out_of_stock', 'discontinued')),
  is_featured BOOLEAN DEFAULT false,
  
  -- SEO
  slug TEXT UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_products_owner ON public.products(owner_id);
CREATE INDEX idx_products_owner_role ON public.products(owner_role);
CREATE INDEX idx_products_type ON public.products(product_type);
CREATE INDEX idx_products_visibility ON public.products(visibility);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_tags ON public.products USING GIN(tags);
```

---

### 4. **orders**
```sql
-- Universal orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- e.g., 'ORD-2025-001234'
  
  -- Parties
  buyer_id UUID NOT NULL REFERENCES public.users(id),
  seller_id UUID REFERENCES public.users(id),
  buyer_company_id UUID REFERENCES public.companies(id),
  seller_company_id UUID REFERENCES public.companies(id),
  
  -- Order Type
  order_type TEXT NOT NULL CHECK (order_type IN ('b2c', 'b2b', 'design_license', 'custom_design')),
  
  -- Items (stored as JSONB for flexibility)
  items JSONB NOT NULL, -- Array of {product_id, quantity, price_usd, etc.}
  
  -- Pricing
  subtotal_usd DECIMAL(10,2) NOT NULL,
  shipping_usd DECIMAL(10,2) DEFAULT 0,
  tax_usd DECIMAL(10,2) DEFAULT 0,
  fees_usd DECIMAL(10,2) DEFAULT 0,
  total_usd DECIMAL(10,2) NOT NULL,
  total_ngn DECIMAL(12,2), -- Converted amount
  exchange_rate DECIMAL(8,4), -- Rate used for conversion
  
  -- Shipping
  shipping_address JSONB,
  shipping_method TEXT,
  tracking_number TEXT,
  
  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded', 'failed')),
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  
  -- Notes
  buyer_notes TEXT,
  seller_notes TEXT,
  admin_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_orders_seller ON public.orders(seller_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
```

---

### 5. **shipments**
```sql
-- Shipment tracking
CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number TEXT UNIQUE NOT NULL, -- e.g., 'SHIP-2025-001234'
  
  -- Related Order
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  
  -- Parties
  sender_id UUID REFERENCES public.users(id),
  receiver_id UUID REFERENCES public.users(id),
  
  -- Route
  origin_country TEXT NOT NULL,
  origin_city TEXT,
  destination_country TEXT NOT NULL,
  destination_city TEXT,
  lane TEXT, -- e.g., 'bd-to-ng', 'bd-to-gh'
  
  -- Shipment Details
  carrier TEXT,
  tracking_number TEXT,
  method TEXT, -- 'air', 'sea', 'land'
  
  -- Package Info
  weight_kg DECIMAL(8,3),
  volume_cbm DECIMAL(8,4),
  package_count INTEGER DEFAULT 1,
  
  -- Costs
  shipping_cost_usd DECIMAL(10,2),
  insurance_cost_usd DECIMAL(10,2),
  customs_duty_usd DECIMAL(10,2),
  total_cost_usd DECIMAL(10,2),
  
  -- Status & Tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'confirmed', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'failed', 'returned')),
  
  -- Dates
  estimated_departure TIMESTAMPTZ,
  actual_departure TIMESTAMPTZ,
  estimated_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  
  -- Tracking Events
  tracking_events JSONB, -- Array of {timestamp, location, status, note}
  
  -- Documents
  documents JSONB, -- Array of {type, url, uploaded_at}
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_shipments_order ON public.shipments(order_id);
CREATE INDEX idx_shipments_sender ON public.shipments(sender_id);
CREATE INDEX idx_shipments_receiver ON public.shipments(receiver_id);
CREATE INDEX idx_shipments_status ON public.shipments(status);
CREATE INDEX idx_shipments_lane ON public.shipments(lane);
```

---

### 6. **rfq** (Request for Quote)
```sql
-- RFQ system for B2B
CREATE TABLE public.rfq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_number TEXT UNIQUE NOT NULL, -- e.g., 'RFQ-2025-001234'
  
  -- Requester (Buyer)
  buyer_id UUID NOT NULL REFERENCES public.users(id),
  buyer_company_id UUID REFERENCES public.companies(id),
  
  -- Request Details
  title TEXT NOT NULL,
  description TEXT,
  product_category TEXT,
  
  -- Requirements
  quantity INTEGER NOT NULL,
  target_price_usd DECIMAL(10,2),
  required_by_date DATE,
  
  -- Specifications
  specifications JSONB, -- Detailed product specs
  attachments JSONB, -- Reference images, documents
  
  -- Targeting
  target_suppliers TEXT[], -- Array of user IDs or 'all'
  visibility TEXT DEFAULT 'all_factories' CHECK (visibility IN ('all_factories', 'all_wholesalers', 'selected_only', 'public')),
  
  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'closed', 'awarded', 'cancelled')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_rfq_buyer ON public.rfq(buyer_id);
CREATE INDEX idx_rfq_status ON public.rfq(status);
CREATE INDEX idx_rfq_category ON public.rfq(product_category);
```

---

### 7. **rfq_offers**
```sql
-- Offers/quotes from suppliers
CREATE TABLE public.rfq_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Related RFQ
  rfq_id UUID NOT NULL REFERENCES public.rfq(id) ON DELETE CASCADE,
  
  -- Supplier
  supplier_id UUID NOT NULL REFERENCES public.users(id),
  supplier_company_id UUID REFERENCES public.companies(id),
  
  -- Offer Details
  unit_price_usd DECIMAL(10,2) NOT NULL,
  total_price_usd DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  
  -- Terms
  lead_time_days INTEGER,
  payment_terms TEXT,
  shipping_terms TEXT,
  validity_days INTEGER DEFAULT 30,
  
  -- Additional Info
  notes TEXT,
  attachments JSONB,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_rfq_offers_rfq ON public.rfq_offers(rfq_id);
CREATE INDEX idx_rfq_offers_supplier ON public.rfq_offers(supplier_id);
CREATE INDEX idx_rfq_offers_status ON public.rfq_offers(status);
```

---

### 8. **wallets**
```sql
-- User wallet/balance tracking
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Owner
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Balances
  balance_usd DECIMAL(12,2) DEFAULT 0 CHECK (balance_usd >= 0),
  balance_ngn DECIMAL(14,2) DEFAULT 0 CHECK (balance_ngn >= 0),
  
  -- Pending
  pending_usd DECIMAL(12,2) DEFAULT 0,
  pending_ngn DECIMAL(14,2) DEFAULT 0,
  
  -- Lifetime Stats
  total_earned_usd DECIMAL(14,2) DEFAULT 0,
  total_spent_usd DECIMAL(14,2) DEFAULT 0,
  total_withdrawn_usd DECIMAL(14,2) DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'suspended')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_wallets_user ON public.wallets(user_id);
```

---

### 9. **transactions**
```sql
-- Financial transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number TEXT UNIQUE NOT NULL,
  
  -- Parties
  user_id UUID NOT NULL REFERENCES public.users(id),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id),
  
  -- Transaction Details
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'payment', 'refund', 'fee', 'earning', 'transfer')),
  amount_usd DECIMAL(12,2) NOT NULL,
  amount_ngn DECIMAL(14,2),
  currency TEXT DEFAULT 'USD',
  
  -- Related Entities
  order_id UUID REFERENCES public.orders(id),
  related_user_id UUID REFERENCES public.users(id), -- For transfers
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  
  -- Payment Details
  payment_method TEXT,
  payment_reference TEXT,
  
  -- Metadata
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_transactions_user ON public.transactions(user_id);
CREATE INDEX idx_transactions_wallet ON public.transactions(wallet_id);
CREATE INDEX idx_transactions_order ON public.transactions(order_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
```

---

### 10. **messages**
```sql
-- Direct messaging between users
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Parties
  sender_id UUID NOT NULL REFERENCES public.users(id),
  receiver_id UUID NOT NULL REFERENCES public.users(id),
  
  -- Thread
  thread_id UUID, -- Group messages in conversations
  
  -- Content
  subject TEXT,
  body TEXT NOT NULL,
  attachments JSONB,
  
  -- Related Entities
  order_id UUID REFERENCES public.orders(id),
  rfq_id UUID REFERENCES public.rfq(id),
  product_id UUID REFERENCES public.products(id),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_thread ON public.messages(thread_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
```

---

## 🔒 Row Level Security (RLS) Policies

### Example: Products Table
```sql
-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view public products
CREATE POLICY "Public products are viewable by everyone"
  ON public.products FOR SELECT
  USING (visibility = 'public' AND status = 'active');

-- Policy: Factories can view factory-only products
CREATE POLICY "Factories can view factory-only products"
  ON public.products FOR SELECT
  USING (
    visibility = 'factories_only' 
    AND auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'factory'
    )
  );

-- Policy: Users can manage their own products
CREATE POLICY "Users can manage their own products"
  ON public.products FOR ALL
  USING (owner_id = auth.uid());

-- Policy: Admins can manage all products
CREATE POLICY "Admins can manage all products"
  ON public.products FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );
```

---

## 📝 Usage Examples

### Create a B2C Product (Admin)
```sql
INSERT INTO public.products (
  owner_id,
  owner_role,
  product_type,
  visibility,
  name,
  description,
  base_price_usd,
  weight_kg,
  volume_cbm,
  category,
  status
) VALUES (
  'admin-user-id',
  'admin_b2c',
  'b2c',
  'public',
  'Ni Afrik Premium Hoodie',
  'Heavyweight cotton hoodie, printed in Bangladesh',
  25.00,
  0.8,
  0.015,
  'clothing',
  'active'
);
```

### Create a Design Product (Creator)
```sql
INSERT INTO public.products (
  owner_id,
  owner_role,
  product_type,
  visibility,
  name,
  description,
  design_type,
  license_type,
  base_price_usd,
  category,
  status
) VALUES (
  'creator-user-id',
  'creator',
  'design',
  'public',
  'Modern Logo Design',
  'Professional logo design for fashion brands',
  'graphic',
  'non_exclusive',
  50.00,
  'design_mockup',
  'active'
);
```

---

This schema supports the entire multi-role platform with proper ownership, visibility controls, and role-based access! 🚀
