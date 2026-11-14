# Jain Sarafa Thella — Complete Step-by-Step Environment Setup Guide

**Document:** `steps_env.md`  
**Purpose:** Comprehensive, step-by-step manual for acquiring and configuring all credentials in `.env.example` for the Jain Sarafa Thella platform.  
**Security Notice:** Store real secret keys in `.env.local` (local development) or your hosting provider's environment variables (production). **Never commit real keys or `.env.local` to Git.**

---

## Quick Reference Checklist

- [ ] **1. NextAuth / JWT Secret** (Local command, zero-cost)
- [ ] **2. Database & Auth: Supabase (PostgreSQL)** (Free tier available)
- [ ] **3. Object Storage: Supabase Storage or Cloudflare R2** (Free tier available)
- [ ] **4. Payment Gateway: Razorpay India** (Free signup, test mode instantly available)
- [ ] **5. Logistics: Shiprocket** (Free starter account, sandbox/test mode available)
- [ ] **6. Messaging: Meta WhatsApp Business Platform (Cloud API)** (1,000 free conversations/month)
- [ ] **7. Statutory Business Details** (Physical Agra establishment info)

---

## 1. Application & NextAuth Security Setup

### 1.1 Generate `NEXTAUTH_SECRET`
You need a cryptographically secure 32-character random string to encrypt session cookies and sign authentication tokens.

1. Open PowerShell or Terminal.
2. Run the following command:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   *(Or on Linux/Mac: `openssl rand -base64 32`)*
3. Copy the output string and paste it into `.env.local`:
   ```env
   NEXTAUTH_SECRET="your_generated_random_string_here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

---

## 2. Database & Auth: Supabase (PostgreSQL)

Supabase provides a managed PostgreSQL database with ACID transactions, Row-Level Security (RLS), and 500 MB free database storage.

### 2.1 Create a Free Supabase Project
1. Navigate to **[https://supabase.com](https://supabase.com)** and click **"Start your project"**.
2. Sign in with GitHub or your email.
3. In the dashboard, click **"New project"**.
4. Configure your project:
   - **Name:** `jst-app-db`
   - **Database Password:** Enter a strong password (copy and save this securely).
   - **Region:** Choose **`ap-south-1` (Mumbai, India)** for lowest network latency to Agra and Indian users.
   - **Pricing Plan:** Free ($0/month).
5. Click **"Create new project"** and wait ~2 minutes for provisioning.

### 2.2 Obtain Database Connection Strings
1. In your Supabase project dashboard, click on the **Settings (gear icon)** at the bottom left.
2. Navigate to **Database** under Project Settings.
3. Scroll down to **Connection string** section:
   - **For `DATABASE_URL` (Connection Pooling):**
     - Select the **"Transaction"** mode tab (Port `6543`).
     - Copy the URI:
       ```
       postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
       ```
     - Replace `[YOUR-PASSWORD]` with the database password created in step 2.1.
   - **For `DIRECT_URL` (Direct Connection for Migrations):**
     - Select the **"Session"** or **"Direct"** tab (Port `5432`).
     - Copy the URI:
       ```
       postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
       ```

### 2.3 Obtain Supabase API Keys
1. In Project Settings, navigate to **API**.
2. Locate the **Project URL**:
   - Copy the URL (e.g., `https://xyzcompany.supabase.co`) and set as:
     ```env
     NEXT_PUBLIC_SUPABASE_URL="https://xyzcompany.supabase.co"
     ```
3. Locate **Project API keys**:
   - Copy the `anon` / `public` key and set as:
     ```env
     NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
     ```
   - Click **Reveal** on the `service_role` / `secret` key, copy it and set as:
     ```env
     SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
     ```
   > ⚠️ **Warning:** The `SUPABASE_SERVICE_ROLE_KEY` bypasses all Row-Level Security. Keep it strictly in server-side environment variables; never share it with the frontend.

### 2.4 Run the Master Database Migration
1. In your Supabase dashboard, click on the **SQL Editor** tab (terminal icon on left menu).
2. Click **"New query"**.
3. Open the migration file in this repository: [`supabase/migrations/20261025000000_init_schema.sql`](file:///d:/shikher%20sih/JST_APP/supabase/migrations/20261025000000_init_schema.sql).
4. Copy the entire file content, paste it into the Supabase SQL editor, and click **"Run"**.
5. Verify in the **Table Editor** that all 15 core tables (`users`, `products`, `orders`, `audit_logs`, etc.) are created successfully.

---

## 3. Private Object Storage (Artwork & Documents)

You can use either **Supabase Storage** (already included in Supabase) or **Cloudflare R2** (zero egress fees).

### Option A: Using Supabase Storage (Recommended for simplicity)
1. In your Supabase dashboard, navigate to **Storage** (folder icon on left menu).
2. Click **"New bucket"**:
   - Bucket Name: `jst-private-assets`
   - Public bucket: **Disabled (Toggle OFF)**
   - Click **Save**.
3. Click **"New bucket"** again:
   - Bucket Name: `jst-public-catalog`
   - Public bucket: **Enabled (Toggle ON)**
   - Click **Save**.
4. In `.env.local`, set:
   ```env
   STORAGE_PROVIDER="supabase"
   STORAGE_BUCKET_PRIVATE="jst-private-assets"
   STORAGE_BUCKET_PUBLIC="jst-public-catalog"
   ```

---

## 4. Payment Gateway: Razorpay India

Razorpay is the market leader for UPI, cards, and net banking in India. Test mode is available immediately without completing business KYC.

### 4.1 Create Razorpay Account & Enable Test Mode
1. Go to **[https://razorpay.com](https://razorpay.com)** and click **"Sign Up"**.
2. Sign in with your business email.
3. Once logged into the Razorpay Dashboard, look at the top navigation bar.
4. Toggle the mode switch from **Live Mode** to **Test Mode**. (You will see a blue banner: *"You are in Test Mode"*).

### 4.2 Generate API Keys (Test Mode)
1. On the left sidebar, navigate to **Account & Settings**.
2. Under the **API Keys** section, click **API Keys**.
3. Click **"Generate Test Key"** (or **"Regenerate Test Key"**).
4. A popup will display:
   - **Key Id:** Starts with `rzp_test_...`
   - **Key Secret:** A secret random string.
5. Copy both values immediately and paste into `.env.local`:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_YourKeyIdHere"
   RAZORPAY_KEY_SECRET="your_razorpay_key_secret_here"
   ```

### 4.3 Configure Payment Webhook
1. In **Account & Settings**, under the **Website and app settings** section, click **Webhooks**.
2. Click **"Add New Webhook"**.
3. Configure the webhook:
   - **Webhook URL:**
     - For production: `https://yourdomain.com/api/webhooks/payment/razorpay`
     - For local testing: Use an ngrok / Cloudflare tunnel URL (e.g., `https://xyz.ngrok-free.app/api/webhooks/payment/razorpay`).
   - **Secret:** Enter a strong custom string (e.g., `jst_rzp_webhook_secret_2026`).
   - **Active Events:** Check the following events:
     - `payment.authorized`
     - `payment.captured`
     - `payment.failed`
     - `order.paid`
     - `refund.processed`
4. Click **Save**.
5. Copy your custom secret into `.env.local`:
   ```env
   RAZORPAY_WEBHOOK_SECRET="jst_rzp_webhook_secret_2026"
   ```

---

## 5. Logistics & Courier Aggregator: Shiprocket

Shiprocket automates courier rate calculations, AWB assignments, 4x6" shipping label generation, and live tracking across India.

### 5.1 Create Shiprocket Account
1. Go to **[https://www.shiprocket.in](https://www.shiprocket.in)** and click **"Sign Up"**.
2. Fill in your business details (Jain Sarafa Thella, Agra) and verify mobile number.
3. Choose the **Starter Plan** (₹0 monthly fee, pay per shipment).

### 5.2 Set Pickup Address (Agra Warehouse)
1. In the Shiprocket Dashboard, navigate to **Settings** → **Pickup Address**.
2. Click **"Add Pickup Address"**:
   - Location Title: `Agra Main Shop`
   - Contact Person: `Shop Manager`
   - Contact Number: Your mobile number
   - Address: `Chowk, Sarafa Bazar`
   - City: `Agra`
   - State: `Uttar Pradesh`
   - Pincode: `282001`
3. Click **Save Address**.

### 5.3 Obtain API Credentials
1. In the Shiprocket Dashboard, go to **Settings** → **API** (or **API Credentials**).
2. Click **"Configure"** or **"Generate API User"**:
   - Create a dedicated API user email (e.g., `api@jainsarafathella.com`) and password.
3. Set in `.env.local`:
   ```env
   SHIPROCKET_EMAIL="your_api_user_email"
   SHIPROCKET_PASSWORD="your_api_user_password"
   SHIPROCKET_BASE_URL="https://apiv2.shiprocket.in/v1/external"
   SHIPROCKET_PICKUP_PINCODE="282001"
   SHIPROCKET_WEBHOOK_TOKEN="create_a_random_token_here"
   ```

---

## 6. Official WhatsApp Business Platform (Meta Cloud API)

Meta's official Cloud API delivers transactional order receipts and tracking links directly to customer WhatsApp numbers.

### 6.1 Create a Meta for Developers App
1. Go to **[https://developers.facebook.com](https://developers.facebook.com)** and log in with your Facebook account.
2. Click **"My Apps"** (top right) → **"Create App"**.
3. Select **"Other"** → Click **Next**.
4. Select App Type: **"Business"** → Click **Next**.
5. Enter **App Name**: `Jain Sarafa Thella Notifications`.
6. Select your Meta Business Account (or create one) and click **"Create App"**.

### 6.2 Set Up WhatsApp Cloud API
1. On the App Dashboard, scroll to **"Add products to your app"** and click **"Set Up"** on **WhatsApp**.
2. In the left navigation, click **WhatsApp** → **API Setup**:
   - You will see a temporary test phone number and test tokens.
   - Note down your **Phone number ID**:
     ```env
     WHATSAPP_PHONE_NUMBER_ID="10xxxxxxxxxxxxx"
     ```
   - Note down your **WhatsApp Business Account ID**:
     ```env
     WHATSAPP_BUSINESS_ACCOUNT_ID="10xxxxxxxxxxxxx"
     ```

### 6.3 Generate a Permanent System User Token
> ⚠️ **Note:** The temporary token in the API Setup tab expires in 24 hours. For development and production, generate a permanent System User Token.

1. Go to **[https://business.facebook.com/settings](https://business.facebook.com/settings)** (Meta Business Settings).
2. On the left menu, go to **Users** → **System Users**.
3. Click **"Add"**:
   - System user name: `JST Backend Service`
   - Role: `Admin`
4. Click on the newly created user and click **"Add Assets"**:
   - Select **Apps** → Choose `Jain Sarafa Thella Notifications` → Enable **Full Control** → Save.
5. Click **"Generate Token"**:
   - Select your App.
   - Token expiration: **Never**.
   - Check the following permissions:
     - `whatsapp_business_messaging`
     - `whatsapp_business_management`
6. Click **Generate Token**, copy the token string, and paste into `.env.local`:
   ```env
   WHATSAPP_ACCESS_TOKEN="EAAxxxxxxx..."
   ```

### 6.4 Configure Webhook Handshake
1. In Meta App Dashboard, navigate to **WhatsApp** → **Configuration**.
2. Under **Webhook**, click **"Edit"**:
   - **Callback URL:** `https://yourdomain.com/api/webhooks/whatsapp`
   - **Verify Token:** Create a secure custom string (e.g., `jst_meta_verify_token_2026`).
3. Set in `.env.local`:
   ```env
   WHATSAPP_WEBHOOK_VERIFY_TOKEN="jst_meta_verify_token_2026"
   WHATSAPP_APP_SECRET="found_under_app_settings_basic"
   ```
4. Click **Verify and Save** in the Meta Dashboard.
5. Click **Manage** on Webhook fields and subscribe to `messages`.

---

## 7. Business & Statutory Details (Agra, Uttar Pradesh)

Fill in the registered commercial details of the physical store:

```env
BUSINESS_LEGAL_NAME="Jain Sarafa Thella"
BUSINESS_TRADE_NAME="Jain Sarafa Thella"
BUSINESS_STATE_CODE="09"
BUSINESS_GSTIN="09XXXXXXXXXXZX"
BUSINESS_PAN="XXXXXXXXXX"
BUSINESS_ADDRESS_LINE1="Sarafa Bazar, Chowk"
BUSINESS_CITY="Agra"
BUSINESS_STATE="Uttar Pradesh"
BUSINESS_PINCODE="282001"
BUSINESS_SUPPORT_PHONE="+919876543210"
BUSINESS_SUPPORT_EMAIL="support@jainsarafathella.com"

# Consumer Protection (E-Commerce) Rules, 2020 Compliance
GRIEVANCE_OFFICER_NAME="Shri R. K. Jain"
GRIEVANCE_OFFICER_DESIGNATION="Nodal Compliance & Grievance Officer"
GRIEVANCE_OFFICER_EMAIL="grievance@jainsarafathella.com"
GRIEVANCE_OFFICER_PHONE="+919876543210"
```

---

## 8. Summary: How to Test Locally with `.env.local`

1. Duplicate `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. For initial testing, you only need:
   - `NEXTAUTH_SECRET` (generate using the command in Step 1.1)
   - `DATABASE_URL` (from Supabase Step 2.2)
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` (from Razorpay Test Mode Step 4.2)
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.
