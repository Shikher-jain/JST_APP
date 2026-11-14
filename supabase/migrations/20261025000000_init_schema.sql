-- ==============================================================================
-- Jain Sarafa Thella E-Commerce Platform — Master PostgreSQL Schema
-- Migration: 20261025000000_init_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TYPE user_role_enum AS ENUM (
  'retail_customer',
  'wholesale_buyer',
  'admin_sales',
  'admin_ops',
  'super_admin'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  full_name VARCHAR(150),
  role user_role_enum NOT NULL DEFAULT 'retail_customer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. WHOLESALE PROFILES (B2B Accounts)
CREATE TABLE wholesale_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255),
  gstin VARCHAR(15),
  pan VARCHAR(10),
  business_address JSONB NOT NULL,
  verification_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, verified, rejected
  verification_notes TEXT,
  approved_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CATEGORIES TAXONOMY
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name_hi VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  image_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PRODUCTS MASTER
CREATE TYPE product_type_enum AS ENUM ('ready_stock', 'made_to_order', 'custom_only');

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id),
  base_sku VARCHAR(50) UNIQUE NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  description_hi TEXT,
  description_en TEXT,
  product_type product_type_enum NOT NULL DEFAULT 'ready_stock',
  material_hi VARCHAR(100),
  material_en VARCHAR(100),
  fabric_gsm INT,
  handle_type_hi VARCHAR(100),
  handle_type_en VARCHAR(100),
  country_of_origin VARCHAR(50) DEFAULT 'India',
  hsn_code VARCHAR(10) NOT NULL, -- e.g., 4202 or 6305
  gst_rate_percent DECIMAL(5, 2) NOT NULL DEFAULT 12.00,
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active', -- active, draft, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRODUCT VARIANTS & PRICING TIERS
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_sku VARCHAR(75) UNIQUE NOT NULL,
  color_hi VARCHAR(50),
  color_en VARCHAR(50),
  size_hi VARCHAR(50),
  size_en VARCHAR(50),
  height_cm DECIMAL(6, 2),
  width_cm DECIMAL(6, 2),
  gusset_cm DECIMAL(6, 2) DEFAULT 0,
  retail_price DECIMAL(10, 2) NOT NULL,
  wholesale_tiers JSONB NOT NULL DEFAULT '[]', -- [{minQty: 50, price: 22}, {minQty: 200, price: 19}]
  moq_retail INT NOT NULL DEFAULT 1,
  moq_wholesale INT NOT NULL DEFAULT 50,
  physical_stock INT NOT NULL DEFAULT 0,
  reserved_stock INT NOT NULL DEFAULT 0,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. STOCK RESERVATIONS (10-15 Min Soft-Lock)
CREATE TABLE stock_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  cart_token VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, converted, released
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reservations_token ON stock_reservations(cart_token);
CREATE INDEX idx_reservations_status_expires ON stock_reservations(status, expires_at);

-- 7. ORDERS (user_id strictly nullable for DEC-01 guest checkout compatibility)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable to decouple from DEC-01
  order_type VARCHAR(20) NOT NULL DEFAULT 'retail', -- retail, wholesale, custom
  order_status VARCHAR(30) NOT NULL DEFAULT 'draft',
  payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
  fulfilment_status VARCHAR(30) NOT NULL DEFAULT 'unfulfilled',
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_total DECIMAL(12, 2) NOT NULL,
  shipping_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  discount_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  grand_total DECIMAL(12, 2) NOT NULL,
  is_cod BOOLEAN NOT NULL DEFAULT false,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  customer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  hsn_code VARCHAR(10) NOT NULL
);

-- 9. PAYMENT ATTEMPTS (1:N Retry Architecture)
CREATE TABLE payment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  attempt_number INT NOT NULL DEFAULT 1,
  gateway_name VARCHAR(50) NOT NULL, -- razorpay, cashfree, manual_cod
  gateway_order_id VARCHAR(100),
  gateway_payment_id VARCHAR(100),
  payment_method VARCHAR(50),
  amount DECIMAL(12, 2) NOT NULL,
  attempt_status VARCHAR(30) NOT NULL DEFAULT 'initiated',
  error_code VARCHAR(100),
  error_description TEXT,
  idempotency_hash VARCHAR(100) UNIQUE,
  raw_webhook_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. REFUNDS LEDGER
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  payment_attempt_id UUID REFERENCES payment_attempts(id),
  credit_note_id UUID,
  gateway_refund_id VARCHAR(100) UNIQUE,
  refund_amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  refund_reason VARCHAR(100) NOT NULL,
  refund_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  initiated_by UUID REFERENCES users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  gateway_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. SHIPMENTS & COURIER TRACKING
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  courier_partner VARCHAR(100),
  shipment_id VARCHAR(100),
  awb_number VARCHAR(100) UNIQUE,
  tracking_url VARCHAR(500),
  label_url VARCHAR(500),
  shipping_status VARCHAR(50) DEFAULT 'unfulfilled',
  ndr_status VARCHAR(50),
  ndr_reason TEXT,
  manifested_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. INVOICES & CREDIT NOTES (Rule 46 & Rule 53 Compliance)
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  invoice_number VARCHAR(50) UNIQUE NOT NULL, -- JST/2026-27/XXXX
  invoice_type VARCHAR(20) NOT NULL, -- B2C_RETAIL, B2B_WHOLESALE
  customer_gstin VARCHAR(15),
  state_code VARCHAR(5) NOT NULL, -- 09 for UP
  is_interstate BOOLEAN NOT NULL DEFAULT false,
  taxable_value DECIMAL(12, 2) NOT NULL,
  cgst_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  sgst_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  igst_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  irn VARCHAR(100), -- For e-invoicing if AATO > 5 Cr
  signed_qr_code TEXT,
  pdf_url VARCHAR(500),
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE credit_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  order_item_id UUID REFERENCES order_items(id),
  credit_note_number VARCHAR(50) UNIQUE NOT NULL, -- JST/CN/2026-27/XXXX
  refund_amount DECIMAL(12, 2) NOT NULL,
  tax_adjusted DECIMAL(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  pdf_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. CUSTOM MANUFACTURING CRM
CREATE TABLE custom_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  enquiry_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  bag_specs JSONB NOT NULL,
  branding_specs JSONB NOT NULL,
  target_quantity INT NOT NULL,
  target_date DATE,
  artwork_urls JSONB DEFAULT '[]',
  status VARCHAR(30) DEFAULT 'new', -- new, under_review, quoted, converted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES custom_enquiries(id),
  parent_quote_id UUID REFERENCES quotations(id), -- Revision lineage
  quote_number VARCHAR(50) UNIQUE NOT NULL, -- JST-QT-XXXX-R0
  revision_number INT DEFAULT 0,
  unit_rate DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  tooling_charge DECIMAL(10, 2) DEFAULT 0.00,
  tax_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  lead_days INT NOT NULL,
  valid_until DATE NOT NULL,
  status VARCHAR(30) DEFAULT 'draft', -- draft, sent, accepted, rejected, expired
  pdf_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. INVENTORY MOVEMENT AUDIT TRAIL
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  delta_qty INT NOT NULL,
  resulting_stock INT NOT NULL,
  reason_code VARCHAR(50) NOT NULL, -- online_order, counter_sale, production_inward, damage, rto_verified_restock
  reference_id VARCHAR(100),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. IMMUTABLE SECURITY AUDIT LOGS (Append-Only)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES users(id),
  action_type VARCHAR(50) NOT NULL, -- PRICE_OVERRIDE, STOCK_ADJUSTMENT, REFUND_ISSUED, ROLE_MODIFIED
  target_entity VARCHAR(50) NOT NULL,
  target_id VARCHAR(100) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prevent unauthorized UPDATE or DELETE on audit_logs at the database level
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Security Alert: Audit log entries are strictly immutable. UPDATE and DELETE are forbidden.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_audit_log_modification
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_log_modification();
