import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import { clearAuthCookies } from "@/lib/utils/cookies";

/**
 * Logout API endpoint
 * POST /api/auth/logout
 * 
 * Clears authentication cookies (accessToken and refreshToken)
 * Always returns success even if cookies don't exist (idempotent operation)
 */
export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 }
    );

    // Clear httpOnly cookies
    // This is idempotent - safe to call even if cookies don't exist
    clearAuthCookies(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    // Even on error, try to clear cookies and return success
    // Logout should be idempotent - always succeed if possible
    try {
      const errorResponse = NextResponse.json<ApiResponse>(
        {
          success: true,
          message: "Logout successful",
        },
        { status: 200 }
      );
      clearAuthCookies(errorResponse);
      return errorResponse;
    } catch (clearError) {
      console.error("Failed to clear cookies during error handling:", clearError);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Logout failed. Please try again.",
        },
        { status: 500 }
      );
    }
  }
}

