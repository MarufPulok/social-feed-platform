import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import { verifyAuth } from "@/lib/middleware/auth.middleware";
import Comment from "@/lib/models/Comment";
import Post from "@/lib/models/Post";
import { createCommentServerSchema } from "@/validators/comment.validator";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/comments
 * Get comments for a post (with pagination)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication (optional - public comments visible to all)
    const authResult = await verifyAuth(request);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    if (!postId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Post ID is required",
          error: "post ID parameter is missing",
        },
        { status: 400 }
      );
    }

    // Build query - only non-deleted comments at top level (no parent)
    const query: {
      postId: mongoose.Types.ObjectId;
      isDeleted?: boolean;
      parentId: null;
    } = {
      postId: new mongoose.Types.ObjectId(postId),
      parentId: null, // Only top-level comments
    };

    // Fetch comments with author and replies
    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "email avatar")
      .lean();

    // For each comment, fetch its replies
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentId: comment._id,
        })
          .sort({ createdAt: 1 }) // Replies oldest first
          .populate("author", "email avatar")
          .lean();

        // Add current user reaction if authenticated
        let currentUserReaction;
        // Type assertion needed because .lean() returns plain objects but TypeScript infers Mongoose document type
        let repliesWithReactions: Array<
          Record<string, unknown> & {
            currentUserReaction?: "like" | "haha" | "love" | "angry";
          }
        > = replies as unknown as Array<Record<string, unknown>>;

        if (authResult.authenticated) {
          const userId = new mongoose.Types.ObjectId(authResult.user.userId);
          const userReaction = comment.reactions?.find(
            (r: { userId: mongoose.Types.ObjectId; type: string }) =>
              r.userId?.toString() === userId.toString()
          );
          if (userReaction) {
            currentUserReaction = userReaction.type;
          }

          // Add current user reaction for each reply
          repliesWithReactions = replies.map((reply) => {
            const replyUserReaction = reply.reactions?.find(
              (r: { userId: mongoose.Types.ObjectId; type: string }) =>
                r.userId?.toString() === userId.toString()
            );
            return {
              ...reply,
              currentUserReaction: replyUserReaction?.type,
            };
          });
        }

        return {
          ...comment,
          currentUserReaction,
          replies: repliesWithReactions,
        };
      })
    );

    // Get total count for pagination
    const total = await Comment.countDocuments(query);

    return NextResponse.json<ApiResponse<typeof commentsWithReplies>>(
      {
        success: true,
        message: "Comments fetched successfully",
        data: commentsWithReplies,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + comments.length < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to fetch comments",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments
 * Create a new comment or reply
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
          error: "Please login to comment",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validation = createCommentServerSchema.safeParse(body);
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

    const { content, postId, parentId, image, imagePublicId } = validation.data;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Post not found",
          error: "The post you're trying to comment on does not exist",
        },
        { status: 404 }
      );
    }

    // If replying, verify parent comment exists
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            message: "Parent comment not found",
            error: "The comment you're trying to reply to does not exist",
          },
          { status: 404 }
        );
      }
    }

    // Create comment
    const comment = await Comment.create({
      content,
      postId: new mongoose.Types.ObjectId(postId),
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : undefined,
      image,
      imagePublicId,
      author: new mongoose.Types.ObjectId(authResult.user.userId),
      reactions: [],
      reactionsCount: 0,
      repliesCount: 0,
    });

    // Update post's comments count (only for top-level comments)
    if (!parentId) {
      await Post.findByIdAndUpdate(postId, {
        $inc: { commentsCount: 1 },
      });
    }

    // Update parent comment's replies count
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $inc: { repliesCount: 1 },
      });
    }

    // Populate author details
    await comment.populate("author", "email avatar");

    return NextResponse.json<ApiResponse<typeof comment>>(
      {
        success: true,
        message: parentId
          ? "Reply created successfully"
          : "Comment created successfully",
        data: comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to create comment",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
