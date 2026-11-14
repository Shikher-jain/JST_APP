import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow login route and public auth APIs to pass unconditionally
  if (pathname === "/admin/login" || pathname.startsWith("/api/auth/")) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (token && pathname === "/admin/login") {
      const session = await verifySessionToken(token);
      if (session) {
        // User already has an active valid session, redirect directly into dashboard
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  // 2. Intercept protected admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized administrative access" },
          { status: 401 }
        );
      }
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const session = await verifySessionToken(token);

    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Session expired or invalid signature" },
          { status: 401 }
        );
      }
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }

    // Attach role headers for downstream handlers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-admin-email", session.email);
    requestHeaders.set("x-admin-role", session.role);
    requestHeaders.set("x-admin-name", session.name);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
