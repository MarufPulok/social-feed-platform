import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import { verifyAuth } from "@/lib/middleware/auth.middleware";
import Post from "@/lib/models/Post";
import User from "@/lib/models/User";
import { createPostServerSchema } from "@/validators/post.validator";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/posts
 * Get all posts (public posts + user's own private posts)
 * Sorted by newest first
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication (optional for public posts)
    const authResult = await verifyAuth(request);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build query based on authentication
    let query: {
      isDeleted: boolean;
      privacy?: string;
      $or?: Array<
        | { privacy: string }
        | { author: mongoose.Types.ObjectId; privacy: string }
      >;
    } = { isDeleted: false };

    if (authResult.authenticated) {
      // Convert userId string to ObjectId for query
      const authorId = new mongoose.Types.ObjectId(authResult.user.userId);

      // Authenticated users can see public posts + their own private posts
      query = {
        isDeleted: false,
        $or: [{ privacy: "public" }, { author: authorId, privacy: "private" }],
      };
    } else {
      // Unauthenticated users can only see public posts
      query = {
        isDeleted: false,
        privacy: "public",
      };
    }

    // Fetch posts with author details, sorted by newest first
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "email avatar")
      .populate({
        path: "reactions.userId",
        select: "email avatar",
        strictPopulate: false,
      })
      .lean();

    // Add current user's reaction if authenticated
    if (authResult.authenticated) {
      const userId = authResult.user.userId;
      posts.forEach((post) => {
        // Ensure reactions is an array (handle legacy data)
        if (!post.reactions) {
          post.reactions = [];
        }

        const userReaction = post.reactions.find((r: {
          userId: { _id: string } | mongoose.Types.ObjectId;
          type: string;
        }) => {
          // Handle populated userId (object with _id) vs unpopulated (ObjectId)
          const reactionUserId =
            typeof r.userId === "object" && "_id" in r.userId
              ? r.userId._id.toString()
              : r.userId.toString();
          return reactionUserId === userId;
        });

        if (userReaction) {
          (post as { currentUserReaction?: string }).currentUserReaction =
            userReaction.type;
        }
      });
    } else {
      // Ensure reactions is an array for unauthenticated users too
      posts.forEach((post) => {
        if (!post.reactions) {
          post.reactions = [];
        }
      });
    }

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    return NextResponse.json<ApiResponse<typeof posts>>(
      {
        success: true,
        message: "Posts fetched successfully",
        data: posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + posts.length < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to fetch posts",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Create a new post
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
          error: "Please login to create a post",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validation = createPostServerSchema.safeParse(body);
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

    const { content, privacy, image, imagePublicId } = validation.data;

    // Create post
    const post = await Post.create({
      content,
      privacy,
      image,
      imagePublicId,
      author: authResult.user.userId,
      reactions: [],
      reactionsCount: 0,
      commentsCount: 0,
      sharesCount: 0,
    });

    // Update user's posts count
    await User.findByIdAndUpdate(authResult.user.userId, {
      $inc: { postsCount: 1 },
    });

    // Populate author details
    await post.populate("author", "email avatar");

    return NextResponse.json<ApiResponse<typeof post>>(
      {
        success: true,
        message: "Post created successfully",
        data: post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to create post",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
