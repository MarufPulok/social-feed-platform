import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAccessToken, getRefreshToken } from "@/lib/utils/cookies";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/utils/jwt";
import connectDB from "@/lib/db/connection";
import User from "@/lib/models/User";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect API routes (except auth routes)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    try {
      await connectDB();

      const accessToken = getAccessToken(request);
      const refreshToken = getRefreshToken(request);

      if (!accessToken && !refreshToken) {
        return NextResponse.json(
          {
            success: false,
            error: "Unauthorized",
          },
          { status: 401 }
        );
      }

      let payload: { userId: string; email: string } | null = null;

      // Try to verify access token first
      if (accessToken) {
        try {
          payload = verifyAccessToken(accessToken);
        } catch {
          // Access token expired, try refresh token
          if (refreshToken) {
            try {
              payload = verifyRefreshToken(refreshToken);
            } catch {
              return NextResponse.json(
                {
                  success: false,
                  error: "Unauthorized",
                },
                { status: 401 }
              );
            }
          } else {
            return NextResponse.json(
              {
                success: false,
                error: "Unauthorized",
              },
              { status: 401 }
            );
          }
        }
      } else if (refreshToken) {
        try {
          payload = verifyRefreshToken(refreshToken);
        } catch {
          return NextResponse.json(
            {
              success: false,
              error: "Unauthorized",
            },
            { status: 401 }
          );
        }
      }

      if (!payload) {
        return NextResponse.json(
          {
            success: false,
            error: "Unauthorized",
          },
          { status: 401 }
        );
      }

      // Verify user still exists and is active
      const user = await User.findById(payload.userId);

      if (!user || user.deletedAt || !user.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: "Unauthorized",
          },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("Middleware authentication error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }
  }

  // Protect protected page routes
  if (pathname.startsWith("/feed") || pathname.startsWith("/(protected)")) {
    try {
      await connectDB();

      const accessToken = getAccessToken(request);
      const refreshToken = getRefreshToken(request);

      if (!accessToken && !refreshToken) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      let payload: { userId: string; email: string } | null = null;

      if (accessToken) {
        try {
          payload = verifyAccessToken(accessToken);
        } catch {
          if (refreshToken) {
            try {
              payload = verifyRefreshToken(refreshToken);
            } catch {
              const loginUrl = new URL("/login", request.url);
              loginUrl.searchParams.set("redirect", pathname);
              return NextResponse.redirect(loginUrl);
            }
          } else {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
          }
        }
      } else if (refreshToken) {
        try {
          payload = verifyRefreshToken(refreshToken);
        } catch {
          const loginUrl = new URL("/login", request.url);
          loginUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(loginUrl);
        }
      }

      if (!payload) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      const user = await User.findById(payload.userId);

      if (!user || user.deletedAt || !user.isActive) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error("Middleware authentication error:", error);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/feed/:path*",
    "/(protected)/:path*",
  ],
};

