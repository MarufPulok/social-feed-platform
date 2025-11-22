import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import { getCurrentUser } from "@/lib/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          user,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Verification failed",
      },
      { status: 500 }
    );
  }
}

