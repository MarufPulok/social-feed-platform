import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import { verifyAuth } from "@/lib/middleware/auth.middleware";
import Comment from "@/lib/models/Comment";
import Post from "@/lib/models/Post";
import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/comments/[id]
 * Smart soft delete comment
 * - If comment has replies, mark as deleted but keep in DB (show "This comment is deleted")
 * - If no replies, mark as deleted (soft delete)
 * - Only author can delete their own comment
 */
export async function DELETE(
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
          error: "Please login to delete comments",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const params = await props.params;
    const commentId = params.id;

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Comment not found",
          error: "The comment you're trying to delete does not exist",
        },
        { status: 404 }
      );
    }

    // Verify that the user is the author
    if (comment.author.toString() !== authResult.user.userId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Forbidden",
          error: "You can only delete your own comments",
        },
        { status: 403 }
      );
    }

    // Check if already deleted
    if (comment.isDeleted) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Comment already deleted",
          error: "This comment has already been deleted",
        },
        { status: 400 }
      );
    }

    // Check if comment has replies
    const hasReplies = comment.repliesCount > 0;

    // Soft delete the comment
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    await comment.save();

    // Update post's comment count (only for top-level comments)
    if (!comment.parentId) {
      await Post.findByIdAndUpdate(comment.postId, {
        $inc: { commentsCount: -1 },
      });
    }

    // Update parent comment's replies count
    if (comment.parentId) {
      await Comment.findByIdAndUpdate(comment.parentId, {
        $inc: { repliesCount: -1 },
      });
    }

    return NextResponse.json<ApiResponse<{
      commentId: string;
      hasReplies: boolean;
      message: string;
    }>>(
      {
        success: true,
        message: "Comment deleted successfully",
        data: {
          commentId: comment._id.toString(),
          hasReplies,
          message: hasReplies
            ? "Comment marked as deleted. Replies preserved."
            : "Comment deleted.",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to delete comment",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
