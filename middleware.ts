import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define public paths that should NOT be protected
const PUBLIC_PATHS = ["/auth/login", "/auth/register", "/api/auth"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isPublic = isPublicPath(pathname);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token
    ? {
        user: {
          id: token.id,
          email: token.email,
          firstName: token.firstName,
          lastName: token.lastName,
        },
      }
    : null;

  // Handle public paths first
  if (isPublic) {
    // If user is authenticated and trying to access auth pages, redirect to feed
    if (session) {
      return NextResponse.redirect(new URL("/feed", req.url));
    }
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!session) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (NextAuth routes)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

