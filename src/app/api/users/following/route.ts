import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import { verifyAuth } from "@/lib/middleware/auth.middleware";
import User from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/users/following
 * Get list of users that the current user is following
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Unauthorized",
          error: "Please login to view following users",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const currentUserId = authResult.user.userId;

    // Get current user with populated following list
    const currentUser = await User.findById(currentUserId)
      .select("following")
      .populate({
        path: "following",
        select: "firstName lastName email avatar",
      })
      .lean();

    if (!currentUser) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "User not found",
          error: "Current user does not exist",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof currentUser.following>>(
      {
        success: true,
        message: "Following users fetched successfully",
        data: currentUser.following,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get following users error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to fetch following users",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
