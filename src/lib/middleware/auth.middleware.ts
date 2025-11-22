import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getRefreshToken } from "@/lib/utils/cookies";
import { verifyAccessToken, verifyRefreshToken, generateTokenPair } from "@/lib/utils/jwt";
import { setAuthCookies } from "@/lib/utils/cookies";
import connectDB from "@/lib/db/connection";
import User from "@/lib/models/User";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
  };
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: { id: string; email: string }; response?: NextResponse } | null> {
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
      response,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export function createUnauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 401 }
  );
}

