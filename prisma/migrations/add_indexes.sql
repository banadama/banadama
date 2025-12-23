CREATE INDEX IF NOT EXISTS idx_supplier_profiles_state ON supplier_profiles ((address->>'state'));
CREATE INDEX IF NOT EXISTS idx_supplier_profiles_city  ON supplier_profiles ((address->>'city'));
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
