/**
 * Jain Sarafa Thella (JST) - Central Admin Authentication & RBAC Engine
 * Provides signed cryptographic session tokens, multi-role definitions,
 * and role-based access permissions.
 */

export type AdminRole = "super_admin" | "admin_sales" | "admin_ops";

export interface AdminUser {
  email: string;
  name: string;
  role: AdminRole;
  title: string;
}

export interface SessionPayload {
  email: string;
  name: string;
  role: AdminRole;
  exp: number; // Unix timestamp in seconds
}

export const ADMIN_COOKIE_NAME = "jst_admin_session";
const SESSION_SECRET = process.env.ADMIN_JWT_SECRET || "jst-sarafa-chowk-secure-session-key-2026-v1";
const DEFAULT_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Configured Administrator Accounts
export const DEFAULT_ADMIN_ACCOUNTS: Array<AdminUser & { password: string }> = [
  {
    email: "superadmin@jainsarafathella.com",
    name: "Shikher Jain",
    role: "super_admin",
    title: "Principal & Chief Administrator",
    password: process.env.ADMIN_SUPER_PASSWORD || "JstSuperAdmin@1990",
  },
  {
    email: "sales@jainsarafathella.com",
    name: "Rajesh Sharma",
    role: "admin_sales",
    title: "Wholesale & Quotations Lead",
    password: process.env.ADMIN_SALES_PASSWORD || "JstSales@1990",
  },
  {
    email: "ops@jainsarafathella.com",
    name: "Virender Kumar",
    role: "admin_ops",
    title: "Manufacturing & Sync Operations Lead",
    password: process.env.ADMIN_OPS_PASSWORD || "JstOps@1990",
  },
];

// Base64Url Utilities
function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (base64url.length % 4)) % 4);
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Signs a session payload with HMAC-SHA256 using standard Web Crypto API
 */
export async function signSessionToken(
  user: { email: string; name: string; role: AdminRole },
  expiresInSec: number = DEFAULT_EXPIRATION_SECONDS
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const payload: SessionPayload = {
    email: user.email,
    name: user.name,
    role: user.role,
    exp,
  };

  const enc = new TextEncoder();
  const payloadJson = JSON.stringify(payload);
  const encodedPayload = bytesToBase64Url(enc.encode(payloadJson));

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(encodedPayload));
  const encodedSignature = bytesToBase64Url(new Uint8Array(signature));

  return `${encodedPayload}.${encodedSignature}`;
}

/**
 * Verifies and decodes a signed session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || !token.includes(".")) return null;

  try {
    const [encodedPayload, encodedSignature] = token.split(".");
    if (!encodedPayload || !encodedSignature) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = base64UrlToBytes(encodedSignature);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      enc.encode(encodedPayload)
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlToBytes(encodedPayload);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Check expiration
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSec) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Validates user credentials against configured admin roster
 */
export async function authenticateAdmin(email: string, pass: string): Promise<AdminUser | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const account = DEFAULT_ADMIN_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === normalizedEmail && acc.password === pass
  );

  if (!account) return null;

  return {
    email: account.email,
    name: account.name,
    role: account.role,
    title: account.title,
  };
}

/**
 * Role-Based Access Control evaluator
 */
export function hasRoleAccess(userRole: AdminRole, allowedRoles: AdminRole | AdminRole[]): boolean {
  if (userRole === "super_admin") return true; // Super admin has universal clearance

  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return allowed.includes(userRole);
}

/**
 * Role display helpers
 */
export function getRoleBadgeInfo(role: AdminRole): { label: string; bg: string; text: string; border: string } {
  switch (role) {
    case "super_admin":
      return {
        label: "SUPER ADMIN",
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/30",
      };
    case "admin_sales":
      return {
        label: "SALES & QUOTATIONS",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/30",
      };
    case "admin_ops":
      return {
        label: "MANUFACTURING & SYNC OPS",
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/30",
      };
  }
}
