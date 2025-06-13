import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/article", "/dashboard", "/profile"];

// Define public routes that should redirect if already authenticated
const publicRoutes = ["/login", "/signup"];

// Function to check if token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

// Function to check if user is authenticated
function isAuthenticated(request: NextRequest): boolean {
  // Check for tokens in cookies first
  const accessTokenFromCookie = request.cookies.get("accessToken")?.value;
  const refreshTokenFromCookie = request.cookies.get("refreshToken")?.value;

  if (accessTokenFromCookie && !isTokenExpired(accessTokenFromCookie)) {
    return true;
  }

  // Fallback: Check localStorage-like headers (if any custom headers are set)
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return !isTokenExpired(token);
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const userIsAuthenticated = isAuthenticated(request);

  // If trying to access a protected route without authentication
  if (isProtectedRoute && !userIsAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Optionally add a redirect parameter to return after login
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // If trying to access public routes (login/signup) while authenticated
  if (isPublicRoute && userIsAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/article"; // or wherever you want to redirect authenticated users
    return NextResponse.redirect(url);
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
