-- Banadama Platform - Initial Schema Migration
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. USERS TABLE (extends auth.users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
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

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================================================
-- 2. COMPANIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  owner_role TEXT NOT NULL CHECK (owner_role IN ('buyer', 'factory', 'wholesaler')),
  
  name TEXT NOT NULL,
  legal_name TEXT,
  registration_number TEXT,
  tax_id TEXT,
  
  email TEXT,
  phone TEXT,
  website TEXT,
  
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  country TEXT NOT NULL,
  postal_code TEXT,
  
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verification_documents JSONB,
  verified_at TIMESTAMPTZ,
  
  business_type TEXT,
  annual_revenue TEXT,
  employee_count TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_owner ON public.companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_owner_role ON public.companies(owner_role);
CREATE INDEX IF NOT EXISTS idx_companies_country ON public.companies(country);

-- ============================================================================
-- 3. PRODUCTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  owner_role TEXT NOT NULL CHECK (owner_role IN ('buyer', 'factory', 'wholesaler', 'creator', 'admin_b2c')),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  
  product_type TEXT NOT NULL CHECK (product_type IN ('b2c', 'b2b', 'design')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'factories_only', 'wholesalers_only', 'buyers_only', 'private')),
  
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  
  category TEXT,
  subcategory TEXT,
  tags TEXT[],
  
  base_price_usd DECIMAL(10,2),
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER,
  
  weight_kg DECIMAL(8,3),
  volume_cbm DECIMAL(8,4),
  dimensions_cm JSONB,
  
  design_type TEXT CHECK (design_type IN ('mockup', 'graphic', 'photo', 'video', '3d_model')),
  design_files JSONB,
  license_type TEXT CHECK (license_type IN ('exclusive', 'non_exclusive', 'royalty_free')),
  
  images JSONB,
  primary_image_url TEXT,
  videos JSONB,
  
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  
  lead_time_days INTEGER,
  production_capacity_monthly INTEGER,
  minimum_moq INTEGER,
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'out_of_stock', 'discontinued')),
  is_featured BOOLEAN DEFAULT false,
  
  slug TEXT UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_products_owner ON public.products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_owner_role ON public.products(owner_role);
CREATE INDEX IF NOT EXISTS idx_products_type ON public.products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_visibility ON public.products(visibility);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING GIN(tags);

-- ============================================================================
-- 4. WALLETS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  balance_usd DECIMAL(12,2) DEFAULT 0 CHECK (balance_usd >= 0),
  balance_ngn DECIMAL(14,2) DEFAULT 0 CHECK (balance_ngn >= 0),
  
  pending_usd DECIMAL(12,2) DEFAULT 0,
  pending_ngn DECIMAL(14,2) DEFAULT 0,
  
  total_earned_usd DECIMAL(14,2) DEFAULT 0,
  total_spent_usd DECIMAL(14,2) DEFAULT 0,
  total_withdrawn_usd DECIMAL(14,2) DEFAULT 0,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'suspended')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallets_user ON public.wallets(user_id);

-- ============================================================================
-- 5. ORDERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  
  buyer_id UUID NOT NULL REFERENCES public.users(id),
  seller_id UUID REFERENCES public.users(id),
  buyer_company_id UUID REFERENCES public.companies(id),
  seller_company_id UUID REFERENCES public.companies(id),
  
  order_type TEXT NOT NULL CHECK (order_type IN ('b2c', 'b2b', 'design_license', 'custom_design')),
  
  items JSONB NOT NULL,
  
  subtotal_usd DECIMAL(10,2) NOT NULL,
  shipping_usd DECIMAL(10,2) DEFAULT 0,
  tax_usd DECIMAL(10,2) DEFAULT 0,
  fees_usd DECIMAL(10,2) DEFAULT 0,
  total_usd DECIMAL(10,2) NOT NULL,
  total_ngn DECIMAL(12,2),
  exchange_rate DECIMAL(8,4),
  
  shipping_address JSONB,
  shipping_method TEXT,
  tracking_number TEXT,
  
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded', 'failed')),
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  
  buyer_notes TEXT,
  seller_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ============================================================================
-- 6. SHIPMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number TEXT UNIQUE NOT NULL,
  
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  
  sender_id UUID REFERENCES public.users(id),
  receiver_id UUID REFERENCES public.users(id),
  
  origin_country TEXT NOT NULL,
  origin_city TEXT,
  destination_country TEXT NOT NULL,
  destination_city TEXT,
  lane TEXT,
  
  carrier TEXT,
  tracking_number TEXT,
  method TEXT,
  
  weight_kg DECIMAL(8,3),
  volume_cbm DECIMAL(8,4),
  package_count INTEGER DEFAULT 1,
  
  shipping_cost_usd DECIMAL(10,2),
  insurance_cost_usd DECIMAL(10,2),
  customs_duty_usd DECIMAL(10,2),
  total_cost_usd DECIMAL(10,2),
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'confirmed', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'failed', 'returned')),
  
  estimated_departure TIMESTAMPTZ,
  actual_departure TIMESTAMPTZ,
  estimated_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  
  tracking_events JSONB,
  documents JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipments_order ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_sender ON public.shipments(sender_id);
CREATE INDEX IF NOT EXISTS idx_shipments_receiver ON public.shipments(receiver_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_lane ON public.shipments(lane);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Banadama Platform schema created successfully!';
  RAISE NOTICE '📊 Tables created: users, companies, products, wallets, orders, shipments';
  RAISE NOTICE '🔍 Indexes created for optimal query performance';
  RAISE NOTICE '⚠️  Next steps:';
  RAISE NOTICE '   1. Run RLS policies migration';
  RAISE NOTICE '   2. Create sample data (optional)';
  RAISE NOTICE '   3. Test with your application';
END $$;
