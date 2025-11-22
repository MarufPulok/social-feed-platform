import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "./auth";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import User, { IUser } from "@/lib/models/User";

export async function requireAuthInAPI(
  request: NextRequest
): Promise<{ user: IUser; response: NextResponse }> {
  const user = await getCurrentUserFromRequest(request);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return {
    user,
    response: NextResponse.next(),
  };
}

export function createErrorResponse(
  error: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status }
  );
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

