import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import { verifyAuth } from "@/lib/middleware/auth.middleware";
import User from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/users/[userId]/follow
 * Follow a user
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
          error: "Please login to follow users",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const currentUserId = authResult.user.userId;
    const { userId: targetUserId } = await params;

    // Validate that user is not trying to follow themselves
    if (currentUserId === targetUserId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Invalid action",
          error: "You cannot follow yourself",
        },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "User not found",
          error: "The user you are trying to follow does not exist",
        },
        { status: 404 }
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

    // Check if already following
    if (currentUser.following.includes(targetUserId as any)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Already following",
          error: "You are already following this user",
        },
        { status: 400 }
      );
    }

    // Add to following and followers lists
    currentUser.following.push(targetUserId as any);
    targetUser.followers.push(currentUserId as any);

    // Save both users
    await Promise.all([currentUser.save(), targetUser.save()]);

    return NextResponse.json<ApiResponse<{ userId: string }>>(
      {
        success: true,
        message: "User followed successfully",
        data: { userId: targetUserId },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Follow user error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to follow user",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
