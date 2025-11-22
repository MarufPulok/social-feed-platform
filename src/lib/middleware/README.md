# Authentication Middleware

This directory contains authentication middleware for protecting routes in the application.

## Overview

The authentication middleware provides:
- Automatic route protection via Next.js middleware
- Reusable authentication functions for API routes
- Token refresh handling
- User validation and status checks

## Components

### 1. `auth.middleware.ts`

Core authentication utilities:

- **`authenticateRequest(request)`** - Authenticates a request and returns user info
- **`withAuth(handler)`** - Higher-order function to protect API route handlers
- **`requiresAuth(pathname)`** - Checks if a route requires authentication
- **`createUnauthorizedResponse()`** - Creates 401 error response
- **`createForbiddenResponse()`** - Creates 403 error response

### 2. Root `middleware.ts`

Next.js middleware that automatically protects routes matching:
- `/api/*` (except `/api/auth/*`)
- `/feed/*`
- `/(protected)/*`

## Usage Examples

### Option 1: Using `withAuth` (Recommended for API Routes)

```typescript
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth.middleware";
import { createSuccessResponse } from "@/lib/utils/api-helpers";

export const GET = withAuth(async (request, { user, fullUser }) => {
  // user: { id: string; email: string }
  // fullUser: IUser (full user document from database)
  
  // Your protected route logic here
  const posts = await getPostsForUser(user.id);
  
  return createSuccessResponse({ posts });
});
```

### Option 2: Manual Authentication Check

```typescript
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, createUnauthorizedResponse } from "@/lib/middleware/auth.middleware";
import { createSuccessResponse } from "@/lib/utils/api-helpers";

export async function GET(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  
  if (!authResult) {
    return createUnauthorizedResponse();
  }
  
  // Use authResult.user or authResult.fullUser
  const posts = await getPostsForUser(authResult.user.id);
  
  return createSuccessResponse({ posts });
}
```

### Option 3: Using API Helpers

```typescript
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, createErrorResponse, createSuccessResponse } from "@/lib/utils/api-helpers";

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  
  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }
  
  const posts = await getPostsForUser(user._id.toString());
  
  return createSuccessResponse({ posts });
}
```

## Protected Routes

Routes are automatically protected by the root `middleware.ts`:

### API Routes
- All `/api/*` routes except `/api/auth/*` require authentication
- Returns 401 JSON response if not authenticated

### Page Routes
- `/feed/*` and `/(protected)/*` require authentication
- Redirects to `/login?redirect=<original-path>` if not authenticated

## Token Refresh

The middleware automatically handles token refresh:
- If access token expires, refresh token is used
- New access token is generated and set in cookies
- User doesn't need to re-authenticate

## User Status Checks

The middleware validates:
- User exists in database
- User is active (`isActive: true`)
- User is not deleted (`deletedAt: null`)

## Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "error": "Forbidden"
}
```

## TypeScript Types

```typescript
interface AuthenticatedUser {
  id: string;
  email: string;
}

interface AuthenticationResult {
  user: AuthenticatedUser;
  fullUser?: IUser;
  response?: NextResponse;
}
```

