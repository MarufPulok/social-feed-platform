/**
 * Example: Protected API Route
 * 
 * This file demonstrates how to use the authentication middleware
 * to protect API routes. Copy and adapt this pattern for your routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth.middleware";
import { createSuccessResponse, createErrorResponse } from "@/lib/utils/api-helpers";
import { ApiResponse } from "@/dtos/response/common.res.dto";

// Example 1: Using withAuth (Recommended)
export const GET = withAuth(async (request, { user, fullUser }) => {
  // user: { id: string; email: string }
  // fullUser: IUser (full user document from database)
  
  try {
    // Your protected route logic here
    // Example: Fetch user-specific data
    const userData = {
      id: user.id,
      email: user.email,
      isEmailVerified: fullUser.isEmailVerified,
      // ... other user data
    };
    
    return createSuccessResponse({ user: userData });
  } catch (error) {
    console.error("Error in protected route:", error);
    return createErrorResponse("Failed to fetch data", 500);
  }
});

// Example 2: Manual authentication check
export async function POST(request: NextRequest) {
  const { authenticateRequest, createUnauthorizedResponse } = await import(
    "@/lib/middleware/auth.middleware"
  );
  
  const authResult = await authenticateRequest(request);
  
  if (!authResult) {
    return createUnauthorizedResponse();
  }
  
  try {
    // Your protected route logic here
    const body = await request.json();
    
    // Use authResult.user or authResult.fullUser
    const result = await processData(authResult.user.id, body);
    
    return createSuccessResponse(result);
  } catch (error) {
    console.error("Error in protected route:", error);
    return createErrorResponse("Failed to process request", 500);
  }
}

// Helper function example
async function processData(userId: string, data: unknown) {
  // Your business logic here
  return { processed: true, userId };
}

