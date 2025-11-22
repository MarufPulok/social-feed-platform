import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "./auth";
import { authenticateRequest, createUnauthorizedResponse } from "@/lib/middleware/auth.middleware";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import User, { IUser } from "@/lib/models/User";

/**
 * Requires authentication in API route
 * Throws error if user is not authenticated
 * @deprecated Use withAuth from auth.middleware instead
 */
export async function requireAuthInAPI(
  request: NextRequest
): Promise<{ user: IUser; response: NextResponse }> {
  const authResult = await authenticateRequest(request);

  if (!authResult || !authResult.fullUser) {
    throw new Error("Unauthorized");
  }

  return {
    user: authResult.fullUser,
    response: NextResponse.next(),
  };
}

/**
 * Gets authenticated user from request
 * Returns null if not authenticated
 */
export async function getAuthUser(request: NextRequest): Promise<IUser | null> {
  const authResult = await authenticateRequest(request);
  return authResult?.fullUser || null;
}

/**
 * Creates an error response
 */
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

/**
 * Creates a success response
 */
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

