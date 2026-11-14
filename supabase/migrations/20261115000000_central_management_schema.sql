-- ==============================================================================
-- Jain Sarafa Thella Platform — Central Management & Media Registry Migration
-- Migration: 20261115000000_central_management_schema.sql
-- ==============================================================================

-- 1. BUSINESSES MASTER
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  legal_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255) NOT NULL,
  founded_year INT DEFAULT 1988,
  tagline_hi VARCHAR(255),
  tagline_en VARCHAR(255),
  short_intro_hi TEXT,
  short_intro_en TEXT,
  full_narrative_hi TEXT,
  full_narrative_en TEXT,
  mission_hi TEXT,
  mission_en TEXT,
  heritage_hi TEXT,
  heritage_en TEXT,
  gstin VARCHAR(15),
  pan VARCHAR(10),
  state_code VARCHAR(5) DEFAULT '09',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BUSINESS LOCATIONS
CREATE TABLE IF NOT EXISTS business_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name_hi VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL DEFAULT 'Agra',
  state VARCHAR(100) NOT NULL DEFAULT 'Uttar Pradesh',
  state_code VARCHAR(5) NOT NULL DEFAULT '09',
  pincode VARCHAR(10) NOT NULL DEFAULT '282001',
  country VARCHAR(50) NOT NULL DEFAULT 'India',
  phone VARCHAR(25) NOT NULL,
  email VARCHAR(255) NOT NULL,
  is_headquarters BOOLEAN NOT NULL DEFAULT true,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  google_maps_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BUSINESS OPERATING HOURS
CREATE TABLE IF NOT EXISTS business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week VARCHAR(15) NOT NULL, -- monday, tuesday, wednesday, thursday, friday, saturday, sunday
  open_time VARCHAR(10) NOT NULL DEFAULT '10:30',
  close_time VARCHAR(10) NOT NULL DEFAULT '20:30',
  is_closed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(business_id, day_of_week)
);

-- 4. GOOGLE DRIVE FILES REGISTRY
CREATE TABLE IF NOT EXISTS drive_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drive_file_id VARCHAR(150) UNIQUE NOT NULL,
  parent_folder_id VARCHAR(150),
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT,
  md5_checksum VARCHAR(64),
  version VARCHAR(50),
  web_view_link VARCHAR(500),
  thumbnail_link VARCHAR(500),
  direct_cdn_url VARCHAR(500),
  is_trashed BOOLEAN NOT NULL DEFAULT false,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drive_files_file_id ON drive_files(drive_file_id);
CREATE INDEX IF NOT EXISTS idx_drive_files_parent ON drive_files(parent_folder_id);

-- 5. MEDIA ASSETS MASTER
CREATE TYPE media_type_enum AS ENUM ('image', 'video', 'document');
CREATE TYPE media_role_enum AS ENUM (
  'main', 
  'gallery', 
  'variant_front', 
  'variant_back', 
  'variant_side', 
  'dimensions', 
  'brand_logo', 
  'factory'
);
CREATE TYPE media_status_enum AS ENUM (
  'discovered', 
  'validating', 
  'validated', 
  'processing', 
  'ready', 
  'pending_approval', 
  'published', 
  'archived', 
  'rejected'
);

CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drive_file_ref_id UUID REFERENCES drive_files(id) ON DELETE SET NULL,
  drive_file_id VARCHAR(150),
  drive_folder_id VARCHAR(150),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  media_type media_type_enum NOT NULL DEFAULT 'image',
  media_role media_role_enum NOT NULL DEFAULT 'gallery',
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL DEFAULT 'image/webp',
  file_hash VARCHAR(64),
  file_size INT,
  public_url VARCHAR(500) NOT NULL,
  cdn_optimized_url VARCHAR(500),
  status media_status_enum NOT NULL DEFAULT 'discovered',
  sort_order INT DEFAULT 0,
  approval_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_product ON media_assets(product_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_variant ON media_assets(variant_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_status ON media_assets(status);

-- 6. PUBLISHING TARGETS
CREATE TABLE IF NOT EXISTS publishing_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_code VARCHAR(50) UNIQUE NOT NULL, -- website, google_business_profile, google_maps
  target_name VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  settings JSONB DEFAULT '{}',
  last_successful_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SYNCHRONIZATION JOBS & ATTEMPTS
CREATE TYPE sync_operation_enum AS ENUM ('create', 'update', 'delete', 'reconcile');
CREATE TYPE sync_status_enum AS ENUM ('pending', 'running', 'completed', 'failed', 'dlq');

CREATE TABLE IF NOT EXISTS sync_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_asset_id UUID REFERENCES media_assets(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES publishing_targets(id) ON DELETE CASCADE,
  operation sync_operation_enum NOT NULL DEFAULT 'update',
  source_version VARCHAR(50),
  status sync_status_enum NOT NULL DEFAULT 'pending',
  attempt_count INT NOT NULL DEFAULT 0,
  max_retries INT NOT NULL DEFAULT 5,
  last_error TEXT,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  idempotency_hash VARCHAR(100) UNIQUE NOT NULL,
  payload JSONB DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_jobs_status ON sync_jobs(status);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_retry ON sync_jobs(status, next_retry_at);

CREATE TABLE IF NOT EXISTS sync_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_job_id UUID NOT NULL REFERENCES sync_jobs(id) ON DELETE CASCADE,
  attempt_number INT NOT NULL,
  status VARCHAR(30) NOT NULL,
  response_payload JSONB,
  error_details TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Business Record
INSERT INTO businesses (
  id, legal_name, trade_name, founded_year, 
  tagline_hi, tagline_en, 
  short_intro_hi, short_intro_en,
  gstin, pan, state_code
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Jain Sarafa Thella',
  'Jain Sarafa Thella (JST)',
  1988,
  'आगरा सराफा की विश्वसनीय आभूषण पोटली एवं बैग निर्माण परंपरा',
  'Agra Sarafa''s Trusted Jewellery Pouch & Custom Bag Manufacturing Heritage',
  'जैन सराफा थैला आगरा के ऐतिहासिक सराफा बाजार में स्थित आभूषण पैकेजिंग, भारी नकद/बुलियन थैलों एवं कस्टमाइज्ड प्रिंटेड कैरी बैग्स का अग्रणी निर्माता है।',
  'Jain Sarafa Thella is a premier manufacturer in Agra''s historic Sarafa Bazar, specializing in jewellery pouches, heavy cash/bullion transport bags, and bespoke printed showroom carry bags.',
  '09XXXXXXXXXXZX',
  'XXXXXXXXXX',
  '09'
) ON CONFLICT (id) DO NOTHING;

-- Seed Business Location
INSERT INTO business_locations (
  business_id, name_hi, name_en, address_line1, address_line2, 
  city, state, state_code, pincode, country, phone, email, 
  is_headquarters, latitude, longitude
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'मुख्य कार्यालय एवं निर्माण इकाई, आगरा',
  'Headquarters & Manufacturing Facility, Agra',
  'Sarafa Bazar, Chowk',
  'Near Johri Market',
  'Agra',
  'Uttar Pradesh',
  '09',
  '282001',
  'India',
  '+91-9876543210',
  'support@jainsarafathella.com',
  true,
  27.1856,
  78.0142
) ON CONFLICT DO NOTHING;

-- Seed Publishing Targets
INSERT INTO publishing_targets (target_code, target_name, is_enabled) VALUES
  ('website', 'Official JST Storefront & Public Catalog', true),
  ('google_business_profile', 'Google Business Profile (Agra Location)', true),
  ('google_maps', 'Google Maps Business Listing', true)
ON CONFLICT (target_code) DO NOTHING;
