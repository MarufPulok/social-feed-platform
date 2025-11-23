import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import { verifyAuth } from "@/lib/middleware/auth.middleware";
import Comment from "@/lib/models/Comment";
import Post from "@/lib/models/Post";
import { toggleReactionSchema } from "@/validators/reaction.validator";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/reactions
 * Toggle reaction on a post or comment
 * Adds reaction if not present, removes if already reacted with same type
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Unauthorized",
          error: "Please login to react",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validation = toggleReactionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Validation failed",
          error: validation.error.errors[0]?.message || "Invalid data",
        },
        { status: 400 }
      );
    }

    const { targetId, targetType, type } = validation.data;
    const userId = new mongoose.Types.ObjectId(authResult.user.userId);

    // Find the target (post or comment)
    let target: InstanceType<typeof Post> | InstanceType<typeof Comment> | null;
    if (targetType === "post") {
      target = await Post.findById(targetId);
    } else {
      target = await Comment.findById(targetId);
    }

    if (!target) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: `${targetType === "post" ? "Post" : "Comment"} not found`,
          error: `The ${targetType} you're trying to react to does not exist`,
        },
        { status: 404 }
      );
    }

    // Check if user already reacted
    const existingReactionIndex = target.reactions.findIndex(
      (r: { userId: mongoose.Types.ObjectId; type: string }) =>
        r.userId.toString() === userId.toString()
    );

    let action: "added" | "removed" | "changed";

    if (existingReactionIndex !== -1) {
      const existingReaction = target.reactions[existingReactionIndex];

      if (existingReaction.type === type) {
        // Same reaction - remove it (toggle off)
        target.reactions.splice(existingReactionIndex, 1);
        action = "removed";
      } else {
        // Different reaction - change it
        target.reactions[existingReactionIndex].type = type;
        action = "changed";
      }
    } else {
      // No existing reaction - add new one
      target.reactions.push({ userId, type });
      action = "added";
    }

    // Save the target
    await target.save();

    // Populate author if it's a comment
    if (targetType === "comment") {
      await (target as InstanceType<typeof Comment>).populate(
        "author",
        "email avatar"
      );
    }

    // Add current user reaction info
    const userReaction = target.reactions.find(
      (r: { userId: mongoose.Types.ObjectId; type: string }) =>
        r.userId.toString() === userId.toString()
    );

    const responseData = {
      ...target.toJSON(),
      currentUserReaction: userReaction?.type,
    };

    return NextResponse.json<ApiResponse<typeof responseData>>(
      {
        success: true,
        message: `Reaction ${action} successfully`,
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Toggle reaction error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to toggle reaction",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
