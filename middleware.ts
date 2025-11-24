import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  authenticateRequestEdge,
  createUnauthorizedResponse,
  requiresAuth,
  isAuthRoute,
} from "@/lib/middleware/auth.middleware.edge";

/**
 * Next.js middleware for protecting routes and redirecting authenticated users
 * Runs on every request matching the config matcher
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Authenticate the request (Edge-compatible, only verifies JWT tokens)
  const authResult = await authenticateRequestEdge(request);
  const isAuthenticated = !!authResult;

  // Handle auth routes (login, register) - redirect authenticated users to feed
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }
    return NextResponse.next();
  }

  // Check if this route requires authentication
  if (!requiresAuth(pathname)) {
    return NextResponse.next();
  }

  // Handle API routes
  if (pathname.startsWith("/api/")) {
    if (!authResult) {
      return createUnauthorizedResponse();
    }

    // If token was refreshed, return response with new cookies
    if (authResult.response) {
      return authResult.response;
    }

    return NextResponse.next();
  }

  // Handle protected page routes (redirect to login if not authenticated)
  if (pathname.startsWith("/feed") || pathname.startsWith("/(protected)")) {
    if (!authResult) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If token was refreshed, continue with refreshed cookies
    if (authResult.response) {
      const response = NextResponse.next();
      // Copy refreshed cookies to the response
      authResult.response.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, cookie);
      });
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/feed/:path*",
    "/(protected)/:path*",
    "/login",
    "/register",
  ],
};

