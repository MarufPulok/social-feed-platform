import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/lib/models/User";
import { LoginReqDto } from "@/dtos/request/auth.req.dto";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import { generateTokenPair } from "@/lib/utils/jwt";
import { setAuthCookies } from "@/lib/utils/cookies";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: LoginReqDto = await request.json();
    const { email, password, rememberMe } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive || user.deletedAt) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Account is inactive or deleted",
        },
        { status: 403 }
      );
    }

    // Check if user is banned
    if (user.isBanned) {
      if (user.bannedUntil && user.bannedUntil > new Date()) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: `Account is banned until ${user.bannedUntil.toISOString()}`,
          },
          { status: 403 }
        );
      } else if (!user.bannedUntil) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: "Account is permanently banned",
          },
          { status: 403 }
        );
      }
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
    });

    // Create response
    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            avatar: user.avatar,
            lastLogin: user.lastLogin,
          },
        },
        message: "Login successful",
      },
      { status: 200 }
    );

    // Set httpOnly cookies
    setAuthCookies(tokens, rememberMe || false, response);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Login failed. Please try again.",
      },
      { status: 500 }
    );
  }
}

