import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import Comment from "@/lib/models/Comment";
import Post from "@/lib/models/Post";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/reactions/[targetId]
 * Get users who reacted to a post or comment
 * Query params: targetType (post|comment), reactionType (optional - filter by type)
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ targetId: string }> }
) {
  try {
    await connectDB();

    const params = await props.params;
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get("targetType");
    const reactionType = searchParams.get("reactionType");
    const targetId = params.targetId;

    if (!targetType || (targetType !== "post" && targetType !== "comment")) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Invalid target type",
          error: "targetType must be 'post' or 'comment'",
        },
        { status: 400 }
      );
    }

    // Find the target
    const target =
      targetType === "post"
        ? await Post.findById(targetId).populate({
            path: "reactions.userId",
            select: "email avatar",
            strictPopulate: false,
          })
        : await Comment.findById(targetId).populate({
            path: "reactions.userId",
            select: "email avatar",
            strictPopulate: false,
          });

    if (!target) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: `${targetType === "post" ? "Post" : "Comment"} not found`,
          error: `The ${targetType} does not exist. Received ID: ${targetId}`,
        },
        { status: 404 }
      );
    }

    // Filter reactions if reactionType is provided
    let reactions = target.reactions || [];
    if (reactionType) {
      reactions = target.reactions.filter(
        (r: { type: string }) => r.type === reactionType
      );
    }

    // Group reactions by type
    const groupedReactions: Record<
      string,
      Array<{ _id: string; email: string; avatar?: string }>
    > = {
      like: [],
      haha: [],
      love: [],
      angry: [],
    };

    reactions.forEach((reaction) => {
      // Type guard: check if userId is populated (object) vs ObjectId
      if (
        reaction.userId &&
        typeof reaction.userId === "object" &&
        "email" in reaction.userId
      ) {
        const populatedUserId = reaction.userId as unknown as {
          _id: string;
          email: string;
          avatar?: string;
        };
        if (groupedReactions[reaction.type]) {
          groupedReactions[reaction.type].push(populatedUserId);
        }
      }
    });

    // Calculate summary
    const summary = {
      total: reactions.length,
      byType: {
        like: groupedReactions.like.length,
        haha: groupedReactions.haha.length,
        love: groupedReactions.love.length,
        angry: groupedReactions.angry.length,
      },
    };

    return NextResponse.json<
      ApiResponse<{
        reactions: typeof groupedReactions;
        summary: typeof summary;
      }>
    >(
      {
        success: true,
        message: "Reactions fetched successfully",
        data: {
          reactions: groupedReactions,
          summary,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get reaction users error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to fetch reaction users",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
