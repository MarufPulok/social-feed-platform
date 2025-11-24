import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import { verifyAuth } from "@/lib/middleware/auth.middleware";
import User from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/users/suggested
 * Get suggested users for the current user to follow
 * Returns users that the current user is not following
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
          error: "Please login to view suggested users",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const currentUserId = authResult.user.userId;

    // Get current user to access their following list
    const currentUser = await User.findById(currentUserId).select("following");

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

    // Find users that:
    // 1. Are not the current user
    // 2. Are not in the current user's following list
    // 3. Are active and not deleted
    const suggestedUsers = await User.find({
      _id: { 
        $ne: currentUserId,
        $nin: currentUser.following 
      },
      isActive: true,
      deletedAt: null,
    })
      .select("firstName lastName email avatar")
      .limit(5)
      .lean();

    return NextResponse.json<ApiResponse<typeof suggestedUsers>>(
      {
        success: true,
        message: "Suggested users fetched successfully",
        data: suggestedUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get suggested users error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to fetch suggested users",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
