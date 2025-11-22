import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { TokenPair } from "./jwt";

const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthCookies(
  tokens: TokenPair,
  rememberMe = false,
  response?: NextResponse
): NextResponse | void {
  const cookieStore = cookies();
  
  const accessTokenMaxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 15; // 7 days or 15 minutes
  const refreshTokenMaxAge = 60 * 60 * 24 * 7; // 7 days

  if (response) {
    // For API routes, set cookies on the response object
    response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: accessTokenMaxAge,
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: refreshTokenMaxAge,
    });
    return response;
  } else {
    // For server components
    cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: accessTokenMaxAge,
    });

    cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: refreshTokenMaxAge,
    });
  }
}

export function getAuthCookies(request?: NextRequest): { accessToken: string | null; refreshToken: string | null } {
  if (request) {
    // For API routes, get cookies from request
    return {
      accessToken: request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value || null,
      refreshToken: request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value || null,
    };
  }
  
  // For server components
  const cookieStore = cookies();
  return {
    accessToken: cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value || null,
    refreshToken: cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value || null,
  };
}

export function clearAuthCookies(response?: NextResponse): NextResponse | void {
  if (response) {
    // For API routes, clear cookies on the response object
    response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);
    response.cookies.delete(REFRESH_TOKEN_COOKIE_NAME);
    return response;
  }
  
  // For server components
  const cookieStore = cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
}

export function getAccessToken(request?: NextRequest): string | null {
  if (request) {
    return request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value || null;
  }
  
  const cookieStore = cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value || null;
}

export function getRefreshToken(request?: NextRequest): string | null {
  if (request) {
    return request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value || null;
  }
  
  const cookieStore = cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value || null;
}

