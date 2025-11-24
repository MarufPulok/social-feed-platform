import connectDB from "@/lib/db/connection";
import User, { IUser } from "@/lib/models/User";
import { NextRequest } from "next/server";
import { getAccessToken, getAuthCookies, getRefreshToken } from "./cookies";
import { generateTokenPair, JWTPayload, verifyAccessToken, verifyRefreshToken } from "./jwt";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCurrentUser(request?: NextRequest): Promise<AuthUser | null> {
  try {
    await connectDB();
    
    const { accessToken, refreshToken } = getAuthCookies(request);
    
    if (!accessToken && !refreshToken) {
      return null;
    }

    let payload: JWTPayload | null = null;

    // Try to verify access token first
    if (accessToken) {
      try {
        payload = verifyAccessToken(accessToken);
      } catch {
        // Access token expired, try refresh token
        if (refreshToken) {
          try {
            payload = verifyRefreshToken(refreshToken);
          } catch {
            return null;
          }
        } else {
          return null;
        }
      }
    } else if (refreshToken) {
      try {
        payload = verifyRefreshToken(refreshToken);
      } catch {
        return null;
      }
    }

    if (!payload) {
      return null;
    }

    // Fetch user from database
    const user = await User.findById(payload.userId).select("-password");
    
    if (!user || user.deletedAt || !user.isActive) {
      return null;
    }

    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  return user;
}

export async function getCurrentUserFromRequest(request?: NextRequest): Promise<IUser | null> {
  try {
    await connectDB();
    
    const accessToken = getAccessToken(request);
    const refreshToken = getRefreshToken(request);
    
    if (!accessToken && !refreshToken) {
      return null;
    }

    let payload: JWTPayload | null = null;

    if (accessToken) {
      try {
        payload = verifyAccessToken(accessToken);
      } catch {
        if (refreshToken) {
          try {
            payload = verifyRefreshToken(refreshToken);
          } catch {
            return null;
          }
        } else {
          return null;
        }
      }
    } else if (refreshToken) {
      try {
        payload = verifyRefreshToken(refreshToken);
      } catch {
        return null;
      }
    }

    if (!payload) {
      return null;
    }

    const user = await User.findById(payload.userId).select("-password");
    
    if (!user || user.deletedAt || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting current user from request:", error);
    return null;
  }
}

