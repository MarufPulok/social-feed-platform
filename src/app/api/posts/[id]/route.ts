import connectDB from "@/lib/db/connection";
import Post from "@/lib/models/Post";
import User from "@/lib/models/User";
import { getCurrentUserFromRequest } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const post = await Post.findById(id)
      .populate("author", "firstName lastName email avatar")
      .populate("reactions.userId", "firstName lastName email avatar");

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: post }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, privacy } = body;

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    if (post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    post.content = content || post.content;
    post.privacy = privacy || post.privacy;
    await post.save();

    return NextResponse.json({ data: post }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    if (post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    await Post.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
