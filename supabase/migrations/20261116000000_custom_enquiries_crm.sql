-- ==============================================================================
-- Jain Sarafa Thella Platform — Custom Enquiries & Quotations CRM Migration
-- Migration: 20261116000000_custom_enquiries_crm.sql
-- ==============================================================================

-- 1. CUSTOM ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS custom_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id VARCHAR(50) UNIQUE NOT NULL,
  shop_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(150) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  city VARCHAR(100) DEFAULT 'Agra',
  bag_type VARCHAR(150) NOT NULL,
  dimensions JSONB NOT NULL DEFAULT '{"width": 6, "height": 8, "unit": "inch"}',
  material VARCHAR(150) NOT NULL,
  branding_technique VARCHAR(150) NOT NULL,
  target_quantity INT NOT NULL DEFAULT 100,
  estimated_unit_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tooling_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
  estimated_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  special_instructions TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'submitted', -- submitted, under_review, spec_confirmed, quotation_sent, in_production, completed, cancelled
  is_converted_to_variant BOOLEAN NOT NULL DEFAULT false,
  converted_variant_sku VARCHAR(75),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_enquiries_status ON custom_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_custom_enquiries_phone ON custom_enquiries(phone);
CREATE INDEX IF NOT EXISTS idx_custom_enquiries_ref ON custom_enquiries(reference_id);

-- 2. FORMAL B2B QUOTATIONS TABLE
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES custom_enquiries(id) ON DELETE CASCADE,
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  revision_number INT NOT NULL DEFAULT 1,
  unit_rate DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  tooling_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
  gst_rate_percent DECIMAL(5, 2) NOT NULL DEFAULT 12.00,
  gst_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  estimated_lead_days INT NOT NULL DEFAULT 7,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'draft', -- draft, sent, accepted, rejected, expired
  pdf_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotations_enquiry ON quotations(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_quotations_number ON quotations(quote_number);

-- 3. INITIAL SEED SAMPLE ENQUIRY FOR AGRA SARAFA B2B WORKFLOW
INSERT INTO custom_enquiries (
  id, reference_id, shop_name, contact_person, phone, city,
  bag_type, dimensions, material, branding_technique, target_quantity,
  estimated_unit_rate, tooling_charge, estimated_total, status,
  is_converted_to_variant, converted_variant_sku
) VALUES (
  'e0000000-0000-0000-0000-000000000001',
  'JST-RFQ-2026-0891',
  'श्री राधा कृष्ण ज्वैलर्स, आगरा',
  'अमित कुमार अग्रवाल',
  '+91 98370 11223',
  'Agra',
  'शाही लाल मखमली आभूषण पोटली',
  '{"width": 7, "height": 9, "gusset": 0, "unit": "inch"}',
  'प्रीमियम मखमल (280 GSM)',
  'गोल्डन हॉट फॉइल स्टैम्पिंग',
  500,
  38.00,
  800.00,
  19800.00,
  'quotation_sent',
  true,
  'JST-VLV-7X9-SRK'
) ON CONFLICT (reference_id) DO NOTHING;
