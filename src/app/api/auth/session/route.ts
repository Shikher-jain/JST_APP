import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }

  const user = await verifySessionToken(token);

  if (!user) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user,
  });
}
