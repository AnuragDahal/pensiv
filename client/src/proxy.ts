import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/article", "/dashboard", "/profile"];

// Define public routes that should redirect if already authenticated
const publicRoutes = ["/login", "/signup"];

// Helper to check if a path matches a route exactly or as a subpath
function matchRoute(path: string, route: string) {
  return path === route || path.startsWith(route + "/");
}

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
  // Check for tokens in cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Consider authenticated if EITHER token exists.
  // If only refreshToken exists, the client/interceptor will handle refreshing the access token.
  if (accessToken && !isTokenExpired(accessToken)) {
    return true;
  }

  if (refreshToken) {
    return true;
  }

  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route (exact or subpath)
  const isProtectedRoute = protectedRoutes.some((route) =>
    matchRoute(pathname, route)
  );

  // Check if the current path is a public route (exact or subpath)
  const isPublicRoute = publicRoutes.some((route) =>
    matchRoute(pathname, route)
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
