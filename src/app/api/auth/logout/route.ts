import { NextResponse } from "next/server";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import { clearAuthCookies } from "@/lib/utils/cookies";

export async function POST() {
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
    clearAuthCookies(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Logout failed",
      },
      { status: 500 }
    );
  }
}

