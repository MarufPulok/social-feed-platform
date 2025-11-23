import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import User, { IUser } from "@/lib/models/User";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/utils/cookies";
import {
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface AuthenticationResult {
  user: AuthenticatedUser;
  fullUser?: IUser;
  response?: NextResponse;
}

/**
 * Authenticates a request by verifying JWT tokens
 * @param request - The Next.js request object
 * @returns Authentication result with user info, or null if authentication fails
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<AuthenticationResult | null> {
  try {
    await connectDB();

    const accessToken = getAccessToken(request);
    const refreshToken = getRefreshToken(request);

    if (!accessToken && !refreshToken) {
      return null;
    }

    let payload: { userId: string; email: string } | null = null;
    let shouldRefresh = false;

    // Try to verify access token first
    if (accessToken) {
      try {
        payload = verifyAccessToken(accessToken);
      } catch {
        // Access token expired, try refresh token
        shouldRefresh = true;
        if (refreshToken) {
          try {
            payload = verifyRefreshToken(refreshToken);
          } catch {
            return null;
          }
        } else {
          return null;
        }
      }
    } else if (refreshToken) {
      try {
        payload = verifyRefreshToken(refreshToken);
        shouldRefresh = true;
      } catch {
        return null;
      }
    }

    if (!payload) {
      return null;
    }

    // Verify user still exists and is active
    const user = await User.findById(payload.userId);

    if (!user || user.deletedAt || !user.isActive) {
      return null;
    }

    // If we used refresh token, generate new access token
    let response: NextResponse | undefined;
    if (shouldRefresh && refreshToken) {
      const tokens = generateTokenPair({
        userId: user._id.toString(),
        email: user.email,
      });
      // Create a response that continues the request
      response = new NextResponse();
      setAuthCookies(tokens, false, response);
    }

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
      },
      fullUser: user,
      response,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

/**
 * Creates an unauthorized JSON response
 */
export function createUnauthorizedResponse(
  message = "Unauthorized"
): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: 401 }
  );
}

/**
 * Creates a forbidden JSON response
 */
export function createForbiddenResponse(
  message = "Forbidden"
): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: 403 }
  );
}

/**
 * Higher-order function to protect API route handlers
 * Usage:
 * export const GET = withAuth(async (request, { user, fullUser }) => {
 *   // Your handler code here
 *   return NextResponse.json({ data: "protected data" });
 * });
 */
export function withAuth<T = unknown>(
  handler: (
    request: NextRequest,
    context: { user: AuthenticatedUser; fullUser: IUser }
  ) => Promise<NextResponse<T>> | NextResponse<T>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await authenticateRequest(request);

    if (!authResult) {
      return createUnauthorizedResponse();
    }

    if (!authResult.fullUser) {
      // Fetch full user if not already loaded
      await connectDB();
      const fullUser = await User.findById(authResult.user.id).select(
        "-password"
      );
      if (!fullUser) {
        return createUnauthorizedResponse();
      }
      authResult.fullUser = fullUser;
    }

    try {
      const response = await handler(request, {
        user: authResult.user,
        fullUser: authResult.fullUser,
      });

      // If token was refreshed, merge cookies into the response
      if (authResult.response) {
        authResult.response.cookies.getAll().forEach((cookie) => {
          response.cookies.set(cookie.name, cookie.value, cookie);
        });
      }

      return response;
    } catch (error) {
      console.error("Protected route handler error:", error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Internal server error",
        },
        { status: 500 }
      );
    }
  };
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

/**
 * Simplified authentication verification for API routes
 * Returns authentication status and user info
 */
export async function verifyAuth(
  request: NextRequest
): Promise<
  | { authenticated: true; user: AuthenticatedUser & { userId: string } }
  | { authenticated: false; user?: never }
> {
  const authResult = await authenticateRequest(request);

  if (!authResult) {
    return { authenticated: false };
  }

  return {
    authenticated: true,
    user: {
      ...authResult.user,
      userId: authResult.user.id,
    },
  };
}
