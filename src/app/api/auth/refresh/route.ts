import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import { getRefreshToken } from "@/lib/utils/cookies";
import { verifyRefreshToken, generateTokenPair } from "@/lib/utils/jwt";
import { setAuthCookies } from "@/lib/utils/cookies";
import connectDB from "@/lib/db/connection";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = getRefreshToken(request);

    if (!refreshToken) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Refresh token not found",
        },
        { status: 401 }
      );
    }

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid or expired refresh token",
        },
        { status: 401 }
      );
    }

    // Verify user still exists and is active
    await connectDB();
    const user = await User.findById(payload.userId);

    if (!user || user.deletedAt || !user.isActive) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User not found or inactive",
        },
        { status: 401 }
      );
    }

    // Generate new token pair
    const tokens = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
    });

    // Create response
    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Token refreshed successfully",
      },
      { status: 200 }
    );

    // Set new httpOnly cookies
    setAuthCookies(tokens, false, response);

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Token refresh failed",
      },
      { status: 500 }
    );
  }
}

