# Authentication System Documentation

This document describes the authentication system implementation using React Query, React Hook Form, Zod validation, and proper DTO structures.

## Architecture Overview

### Technology Stack

- **React Query**: State management for authentication and API calls
- **React Hook Form**: Form handling with optimal performance
- **Zod**: Runtime type validation and schema inference
- **JWT**: Token-based authentication with httpOnly cookies
- **Next.js Middleware**: Server-side route protection
- **MongoDB + Mongoose**: User data persistence

## Core Components

### 1. DTOs (Data Transfer Objects)

Located in `src/dtos/request/` and `src/dtos/response/`:

#### Request DTOs (`auth.req.dto.ts`)
- Uses Zod schemas for validation
- Type inference with `z.infer<typeof schema>`
- Schemas: `registerReqSchema`, `loginReqSchema`

```typescript
export const loginReqSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

export type LoginReqDto = z.infer<typeof loginReqSchema>;
```

#### Response DTOs (`auth.res.dto.ts`)
- TypeScript interfaces for API responses
- `UserDto`, `LoginResDto`, `RegisterResDto`

### 2. React Query Setup

#### Query Keys (`src/lib/query-keys.ts`)
Centralized query key management following React Query best practices:

```typescript
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    currentUser: () => [...queryKeys.auth.all, "current-user"] as const,
  },
  // ... other query keys
};
```

#### Auth Service (`src/lib/services/auth.service.ts`)
API layer handling all authentication requests:

- `register(data)`: User registration
- `login(data)`: User login
- `logout()`: User logout
- `getCurrentUser()`: Fetch authenticated user

### 3. React Query Hooks

Located in `src/hooks/useAuthQuery.ts`:

#### `useCurrentUser()`
Fetches and caches the current authenticated user.

```typescript
const { data: user, isLoading } = useCurrentUser();
```

#### `useLogin()`
Handles login with automatic cache updates.

```typescript
const loginMutation = useLogin();
await loginMutation.mutateAsync({ email, password });
```

#### `useRegister()`
Handles registration with automatic cache updates.

```typescript
const registerMutation = useRegister();
await registerMutation.mutateAsync({ email, password });
```

#### `useLogout()`
Handles logout and clears all cached data.

```typescript
const logoutMutation = useLogout();
await logoutMutation.mutateAsync();
```

#### `useAuth()` (Combined Hook)
Provides a unified interface for authentication:

```typescript
const {
  user,
  isLoading,
  isAuthenticated,
  login,
  logout,
  register,
  loginMutation,
  logoutMutation,
  registerMutation,
} = useAuth();
```

## Form Handling

### Login Form (`src/components/auth/LoginForm.tsx`)

```typescript
const loginMutation = useLogin();

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginReqSchema),
});

const onSubmit = async (data) => {
  await loginMutation.mutateAsync(data);
  router.push("/feed");
};
```

### Register Form (`src/components/auth/RegisterForm.tsx`)

Similar structure with extended validation for `confirmPassword` and `agreeToTerms`.

## Route Protection

### Server-Side Protection (Middleware)

`middleware.ts` handles:
- Protected route authentication
- Automatic token refresh
- Redirect unauthenticated users to login
- Redirect authenticated users away from auth pages

```typescript
export const config = {
  matcher: [
    "/api/:path*",
    "/feed/:path*",
    "/(protected)/:path*",
    "/login",
    "/register",
  ],
};
```

### Client-Side Protection

#### Auth Layout (`src/app/(auth)/layout.tsx`)
Redirects authenticated users from login/register pages to feed.

#### Protected Layout (`src/app/(protected)/layout.tsx`)
Redirects unauthenticated users to login with redirect parameter.

## Authentication Flow

### Registration Flow

1. User fills registration form
2. Client-side validation via Zod schema
3. `useRegister()` mutation sends data to `/api/auth/register`
4. Server validates, creates user, generates JWT tokens
5. Tokens set as httpOnly cookies
6. React Query cache updated with user data
7. User redirected to feed

### Login Flow

1. User fills login form
2. Client-side validation via Zod schema
3. `useLogin()` mutation sends data to `/api/auth/login`
4. Server validates credentials, generates JWT tokens
5. Tokens set as httpOnly cookies
6. React Query cache updated with user data
7. User redirected to feed (or redirect parameter)

### Logout Flow

1. User clicks logout
2. `useLogout()` mutation calls `/api/auth/logout`
3. Server clears httpOnly cookies
4. React Query clears all cached data
5. User redirected to login page

### Token Refresh

Handled automatically by middleware:
1. Middleware checks access token
2. If expired, validates refresh token
3. Generates new access token
4. Updates cookies in response
5. Request continues with valid authentication

## Security Features

1. **httpOnly Cookies**: Tokens stored in httpOnly cookies (not accessible via JavaScript)
2. **Secure Cookies**: HTTPS-only in production
3. **SameSite Protection**: CSRF protection with SameSite=Lax
4. **Password Hashing**: bcrypt with salt rounds
5. **Account Status Checks**: Ban, deletion, and active status validation
6. **Email Enumeration Prevention**: Generic error messages

## API Routes

### `/api/auth/register` (POST)
Creates new user account.

**Request**: `RegisterReqDto`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**: `ApiResponse<RegisterResDto>`

### `/api/auth/login` (POST)
Authenticates user.

**Request**: `LoginReqDto`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": false
}
```

**Response**: `ApiResponse<LoginResDto>`

### `/api/auth/logout` (POST)
Logs out user and clears cookies.

**Response**: `ApiResponse`

### `/api/auth/verify` (GET)
Verifies authentication and returns current user.

**Response**: `ApiResponse<{ user: UserDto }>`

## Usage Examples

### Using Auth in Components

```typescript
import { useAuth } from "@/hooks/useAuthQuery";

function MyComponent() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Login />;

  return <div>Hello {user.email}</div>;
}
```

### Protected API Route

```typescript
import { withAuth } from "@/lib/middleware/auth.middleware";

export const GET = withAuth(async (request, { user, fullUser }) => {
  // user: { id, email }
  // fullUser: Complete IUser document
  return NextResponse.json({ data: "protected data" });
});
```

### Manual Query Invalidation

```typescript
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

const queryClient = useQueryClient();

// Invalidate current user query
queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() });

// Refetch current user
queryClient.refetchQueries({ queryKey: queryKeys.auth.currentUser() });
```

## Best Practices

1. **Always use DTOs**: Type-safe API contracts
2. **Centralize query keys**: Prevent key inconsistencies
3. **Use React Query hooks**: Automatic caching and refetching
4. **Validate on both sides**: Client (Zod) and server
5. **Handle loading states**: Better UX with proper loading indicators
6. **Error handling**: Catch and display user-friendly errors
7. **Secure by default**: Server-side validation and authentication

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx (redirects authenticated users)
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/
│   │   ├── layout.tsx (protects routes)
│   │   └── feed/
│   └── api/
│       └── auth/
│           ├── login/route.ts
│           ├── register/route.ts
│           ├── logout/route.ts
│           └── verify/route.ts
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── AuthRedirect.tsx
│   │   └── ProtectedRoute.tsx
│   └── providers/
│       └── react-query-provider.tsx
├── dtos/
│   ├── request/
│   │   └── auth.req.dto.ts
│   └── response/
│       ├── auth.res.dto.ts
│       └── common.res.dto.ts
├── hooks/
│   └── useAuthQuery.ts
├── lib/
│   ├── query-keys.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── models/
│   │   └── User.ts
│   └── utils/
│       ├── auth.ts
│       ├── cookies.ts
│       └── jwt.ts
└── validators/
    └── auth.validator.ts
```

## Environment Variables

Required environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/your-database

# JWT Secrets (use strong, random values in production)
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Node Environment
NODE_ENV=development
```

## Testing Authentication

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Access protected route while authenticated
- [ ] Access protected route while unauthenticated
- [ ] Logout functionality
- [ ] Token refresh on expired access token
- [ ] Redirect to login with return URL
- [ ] Prevent access to auth pages when authenticated

## Troubleshooting

### Common Issues

1. **"Unauthorized" errors**: Check JWT_SECRET environment variables
2. **Infinite redirects**: Verify middleware matcher configuration
3. **User not persisting**: Check cookie settings (secure, sameSite)
4. **Token refresh fails**: Verify refresh token validation logic

### Debug Tools

- React Query DevTools (enabled in development)
- Network tab: Inspect cookies and API responses
- Server logs: Check authentication errors

