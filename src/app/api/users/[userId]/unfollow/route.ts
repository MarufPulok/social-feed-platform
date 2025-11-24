import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import { verifyAuth } from "@/lib/middleware/auth.middleware";
import User from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/users/[userId]/unfollow
 * Unfollow a user
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Unauthorized",
          error: "Please login to unfollow users",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const currentUserId = authResult.user.userId;
    const { userId: targetUserId } = await params;

    // Validate that user is not trying to unfollow themselves
    if (currentUserId === targetUserId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Invalid action",
          error: "You cannot unfollow yourself",
        },
        { status: 400 }
      );
    }

    // Get current user
    const currentUser = await User.findById(currentUserId);
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

    // Check if not following
    if (!currentUser.following.includes(targetUserId as any)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Not following",
          error: "You are not following this user",
        },
        { status: 400 }
      );
    }

    // Get target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "User not found",
          error: "The user you are trying to unfollow does not exist",
        },
        { status: 404 }
      );
    }

    // Remove from following and followers lists
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    // Save both users
    await Promise.all([currentUser.save(), targetUser.save()]);

    return NextResponse.json<ApiResponse<{ userId: string }>>(
      {
        success: true,
        message: "User unfollowed successfully",
        data: { userId: targetUserId },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unfollow user error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to unfollow user",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
