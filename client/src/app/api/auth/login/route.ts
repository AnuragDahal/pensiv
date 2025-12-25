import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { message: "API URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Login failed" },
        { status: response.status }
      );
    }

    const { accessToken, refreshToken } = data.data;

    const cookieStore = await cookies();

    // Set Access Token Cookie
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
