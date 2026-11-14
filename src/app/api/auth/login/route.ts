import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, signSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await authenticateAdmin(email, password);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials or unauthorized administrative role" },
        { status: 401 }
      );
    }

    const token = await signSessionToken(user);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during authentication" },
      { status: 500 }
    );
  }
}
