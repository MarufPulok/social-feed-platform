import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/middleware/auth.middleware";
import { uploadImage } from "@/lib/utils/cloudinary";
import { ApiResponse } from "@/dtos/response/common.res.dto";

/**
 * POST /api/upload
 * Upload image to Cloudinary
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
          error: "Please login to upload images",
        },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as "post" | "profile" | "comment") || "post";

    if (!file) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "No file provided",
          error: "Please select an image to upload",
        },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Invalid file type",
          error: "Only JPEG, PNG, WebP and GIF images are supported",
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "File too large",
          error: "Image size must be less than 5MB",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadImage(buffer, type);

    return NextResponse.json<ApiResponse<typeof uploadResult>>(
      {
        success: true,
        message: "Image uploaded successfully",
        data: uploadResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Failed to upload image",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

