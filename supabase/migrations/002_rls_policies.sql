-- Banadama Platform - Row Level Security Policies
-- Run this AFTER 001_initial_schema.sql

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all users
CREATE POLICY "Admins can update all users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- COMPANIES TABLE POLICIES
-- ============================================================================

-- Users can view their own companies
CREATE POLICY "Users can view own companies"
  ON public.companies FOR SELECT
  USING (owner_id = auth.uid());

-- Users can create companies
CREATE POLICY "Users can create companies"
  ON public.companies FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Users can update their own companies
CREATE POLICY "Users can update own companies"
  ON public.companies FOR UPDATE
  USING (owner_id = auth.uid());

-- Verified companies are viewable by authenticated users
CREATE POLICY "Verified companies viewable by authenticated"
  ON public.companies FOR SELECT
  USING (is_verified = true AND auth.uid() IS NOT NULL);

-- Admins can manage all companies
CREATE POLICY "Admins can manage all companies"
  ON public.companies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- PRODUCTS TABLE POLICIES
-- ============================================================================

-- Public products viewable by everyone
CREATE POLICY "Public products viewable by all"
  ON public.products FOR SELECT
  USING (
    visibility = 'public' 
    AND status = 'active'
  );

-- Factory-only products viewable by factories
CREATE POLICY "Factory products viewable by factories"
  ON public.products FOR SELECT
  USING (
    visibility = 'factories_only'
    AND status = 'active'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'factory'
    )
  );

-- Wholesaler-only products viewable by wholesalers
CREATE POLICY "Wholesaler products viewable by wholesalers"
  ON public.products FOR SELECT
  USING (
    visibility = 'wholesalers_only'
    AND status = 'active'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'wholesaler'
    )
  );

-- Buyer-only products viewable by buyers
CREATE POLICY "Buyer products viewable by buyers"
  ON public.products FOR SELECT
  USING (
    visibility = 'buyers_only'
    AND status = 'active'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'buyer'
    )
  );

-- Users can view their own products (all statuses)
CREATE POLICY "Users can view own products"
  ON public.products FOR SELECT
  USING (owner_id = auth.uid());

-- Users can create products
CREATE POLICY "Users can create products"
  ON public.products FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Users can update their own products
CREATE POLICY "Users can update own products"
  ON public.products FOR UPDATE
  USING (owner_id = auth.uid());

-- Users can delete their own products
CREATE POLICY "Users can delete own products"
  ON public.products FOR DELETE
  USING (owner_id = auth.uid());

-- Admins can manage all products
CREATE POLICY "Admins can manage all products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- WALLETS TABLE POLICIES
-- ============================================================================

-- Users can view their own wallet
CREATE POLICY "Users can view own wallet"
  ON public.wallets FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own wallet (for balance changes)
CREATE POLICY "Users can update own wallet"
  ON public.wallets FOR UPDATE
  USING (user_id = auth.uid());

-- Admins can view all wallets
CREATE POLICY "Admins can view all wallets"
  ON public.wallets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- ORDERS TABLE POLICIES
-- ============================================================================

-- Buyers can view their own orders
CREATE POLICY "Buyers can view own orders"
  ON public.orders FOR SELECT
  USING (buyer_id = auth.uid());

-- Sellers can view orders they're selling
CREATE POLICY "Sellers can view their orders"
  ON public.orders FOR SELECT
  USING (seller_id = auth.uid());

-- Buyers can create orders
CREATE POLICY "Buyers can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

-- Buyers can update their own orders (before confirmation)
CREATE POLICY "Buyers can update own orders"
  ON public.orders FOR UPDATE
  USING (
    buyer_id = auth.uid() 
    AND status IN ('pending', 'confirmed')
  );

-- Sellers can update orders they're selling
CREATE POLICY "Sellers can update their orders"
  ON public.orders FOR UPDATE
  USING (seller_id = auth.uid());

-- Admins can manage all orders
CREATE POLICY "Admins can manage all orders"
  ON public.orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- SHIPMENTS TABLE POLICIES
-- ============================================================================

-- Senders can view their shipments
CREATE POLICY "Senders can view own shipments"
  ON public.shipments FOR SELECT
  USING (sender_id = auth.uid());

-- Receivers can view their shipments
CREATE POLICY "Receivers can view their shipments"
  ON public.shipments FOR SELECT
  USING (receiver_id = auth.uid());

-- Users can view shipments for their orders
CREATE POLICY "Users can view shipments for their orders"
  ON public.shipments FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.orders
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

-- Senders can create shipments
CREATE POLICY "Senders can create shipments"
  ON public.shipments FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Senders can update their shipments
CREATE POLICY "Senders can update own shipments"
  ON public.shipments FOR UPDATE
  USING (sender_id = auth.uid());

-- Admins can manage all shipments
CREATE POLICY "Admins can manage all shipments"
  ON public.shipments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- FUNCTIONS FOR AUTOMATIC WALLET CREATION
-- ============================================================================

-- Function to create wallet when user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create wallet on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON public.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- FUNCTIONS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Row Level Security policies created successfully!';
  RAISE NOTICE '🔒 RLS enabled on all tables';
  RAISE NOTICE '👥 User policies: view/update own data';
  RAISE NOTICE '🏢 Company policies: owner access + verified viewable';
  RAISE NOTICE '📦 Product policies: visibility-based access';
  RAISE NOTICE '💰 Wallet policies: owner access only';
  RAISE NOTICE '📋 Order policies: buyer/seller access';
  RAISE NOTICE '🚚 Shipment policies: sender/receiver access';
  RAISE NOTICE '👑 Admin policies: full access to all data';
  RAISE NOTICE '⚡ Triggers: auto wallet creation, updated_at timestamps';
END $$;
