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
  response: NextResponse
): void {
  const accessTokenMaxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 15; // 7 days or 15 minutes
  const refreshTokenMaxAge = 60 * 60 * 24 * 7; // 7 days

  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: accessTokenMaxAge,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: refreshTokenMaxAge,
  });
}

export function getAuthCookies(request?: NextRequest): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  if (!request) {
    return {
      accessToken: null,
      refreshToken: null,
    };
  }

  return {
    accessToken: request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value || null,
    refreshToken: request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value || null,
  };
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);
  response.cookies.delete(REFRESH_TOKEN_COOKIE_NAME);
}

export function getAccessToken(request?: NextRequest): string | null {
  if (!request) {
    return null;
  }
  return request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value || null;
}

export function getRefreshToken(request?: NextRequest): string | null {
  if (!request) {
    return null;
  }
  return request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value || null;
}

