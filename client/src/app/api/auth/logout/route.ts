import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { message: "API URL not configured" },
        { status: 500 }
      );
    }
    const response = await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookieStore.get("accessToken")?.value}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Logout failed" },
        { status: response.status }
      );
    }

    // Clear Access Token
    cookieStore.delete("accessToken");

    // Clear Refresh Token
    cookieStore.delete("refreshToken");

    return NextResponse.json(
      { message: data.message || "Logged out successfully" },
      { status: response.status }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
