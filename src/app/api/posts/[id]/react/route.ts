import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import { verifyAuth } from "@/lib/middleware/auth.middleware";
import Post from "@/lib/models/Post";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/posts/[id]/react
 * Add or update reaction to a post
 */
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Unauthorized",
          error: "Please login to react to posts",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const params = await props.params;
    const postId = params.id;
    const body = await request.json();
    const { type } = body;

    // Validate reaction type
    const validTypes = ["like", "haha", "love", "angry"];
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Invalid reaction type",
          error: "Reaction type must be one of: like, haha, love, angry",
        },
        { status: 400 }
      );
    }

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Post not found",
          error: "The post you're trying to react to does not exist",
        },
        { status: 404 }
      );
    }

    const userId = new mongoose.Types.ObjectId(authResult.user.userId);

    // Initialize reactions array if it doesn't exist
    if (!post.reactions) {
      post.reactions = [];
    }

    // Check if user already reacted
    const existingReactionIndex = post.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingReactionIndex !== -1) {
      // User already reacted - update or remove reaction
      if (post.reactions[existingReactionIndex].type === type) {
        // Same reaction - remove it
        post.reactions.splice(existingReactionIndex, 1);
      } else {
        // Different reaction - update it
        post.reactions[existingReactionIndex].type = type as
          | "like"
          | "haha"
          | "love"
          | "angry";
      }
    } else {
      // New reaction - add it
      post.reactions.push({
        userId,
        type: type as "like" | "haha" | "love" | "angry",
      });
    }

    await post.save();

    // Populate author and get current user's reaction
    await post.populate("author", "email avatar");
    const currentUserReaction = post.reactions.find(
      (r) => r.userId.toString() === userId.toString()
    )?.type;

    return NextResponse.json<
      ApiResponse<
        ReturnType<typeof post.toJSON> & {
          currentUserReaction?: "like" | "haha" | "love" | "angry";
        }
      >
    >(
      {
        success: true,
        message: "Reaction updated successfully",
        data: {
          ...post.toJSON(),
          currentUserReaction,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("React to post error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to react to post",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
