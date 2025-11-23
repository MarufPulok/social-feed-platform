import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { ApiResponse } from "@/dtos/response/common.res.dto";

/**
 * Validates request body against a Zod schema
 * Returns validated data or error response
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T } | { error: NextResponse<ApiResponse> }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0];
      return {
        error: NextResponse.json<ApiResponse>(
          {
            success: false,
            error: firstError?.message || "Validation failed",
          },
          { status: 400 }
        ),
      };
    }

    return { data: result.data };
  } catch (error) {
    return {
      error: NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        { status: 400 }
      ),
    };
  }
}

/**
 * Creates a success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status = 200
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

/**
 * Creates an error response
 */
export function createErrorResponse(
  error: string,
  status = 500
): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status }
  );
}

