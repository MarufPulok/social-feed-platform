import { NextRequest, NextResponse } from "next/server";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  JWTPayload,
} from "@/lib/utils/jwt.edge";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/utils/cookies";

/**
 * Edge-compatible authentication result (no database calls)
 * Only verifies JWT token validity
 */
export interface EdgeAuthResult {
  payload: JWTPayload;
  response?: NextResponse;
}

/**
 * Edge-compatible authentication that only verifies JWT tokens
 * Does NOT check database - use this in middleware
 * For full authentication with DB checks, use authenticateRequest in API routes
 */
export async function authenticateRequestEdge(
  request: NextRequest
): Promise<EdgeAuthResult | null> {
  try {
    const accessToken = getAccessToken(request);
    const refreshToken = getRefreshToken(request);

    if (!accessToken && !refreshToken) {
      return null;
    }

    let payload: JWTPayload | null = null;
    let shouldRefresh = false;

    // Try to verify access token first
    if (accessToken) {
      try {
        payload = await verifyAccessToken(accessToken);
      } catch {
        // Access token expired, try refresh token
        shouldRefresh = true;
        if (refreshToken) {
          try {
            payload = await verifyRefreshToken(refreshToken);
          } catch {
            return null;
          }
        } else {
          return null;
        }
      }
    } else if (refreshToken) {
      try {
        payload = await verifyRefreshToken(refreshToken);
        shouldRefresh = true;
      } catch {
        return null;
      }
    }

    if (!payload) {
      return null;
    }

    // If we used refresh token, generate new access token
    let response: NextResponse | undefined;
    if (shouldRefresh && refreshToken) {
      const tokens = await generateTokenPair({
        userId: payload.userId,
        email: payload.email,
      });
      // Create a response that continues the request
      response = new NextResponse();
      setAuthCookies(tokens, false, response);
    }

    return {
      payload,
      response,
    };
  } catch (error) {
    console.error("Edge authentication error:", error);
    return null;
  }
}

/**
 * Creates an unauthorized JSON response
 */
export function createUnauthorizedResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized",
    },
    { status: 401 }
  );
}

/**
 * Middleware helper to check if a route requires authentication
 */
export function requiresAuth(pathname: string): boolean {
  // Protect API routes (except auth routes)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    return true;
  }

  // Protect page routes
  if (pathname.startsWith("/feed") || pathname.startsWith("/(protected)")) {
    return true;
  }

  return false;
}

/**
 * Check if route is an auth route (login, register, etc.)
 * These routes should redirect authenticated users to feed
 */
export function isAuthRoute(pathname: string): boolean {
  const authRoutes = ["/login", "/register"];
  return authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

