import { LoginReqDto } from "@/dtos/request/auth.req.dto";
import { LoginResDto } from "@/dtos/response/auth.res.dto";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import User from "@/lib/models/User";
import { setAuthCookies } from "@/lib/utils/cookies";
import { generateTokenPair } from "@/lib/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function validateLoginRequest(body: unknown): {
  isValid: boolean;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Request body is required" };
  }

  const { email, password, rememberMe } = body as Partial<LoginReqDto>;

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    return { isValid: false, error: "Email is required" };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, error: "Please provide a valid email address" };
  }

  if (!password || typeof password !== "string") {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length === 0) {
    return { isValid: false, error: "Password cannot be empty" };
  }

  if (rememberMe !== undefined && typeof rememberMe !== "boolean") {
    return { isValid: false, error: "rememberMe must be a boolean value" };
  }

  return { isValid: true };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    // Validate request
    const validation = validateLoginRequest(body);
    if (!validation.isValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = body as LoginReqDto;
    const normalizedEmail = email.trim().toLowerCase();

    // Connect to database
    await connectDB();

    // Find user and include password field (needed for password comparison)
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!user) {
      // Return generic error to prevent email enumeration
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check if user is active and not deleted
    if (!user.isActive || user.deletedAt) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Account is inactive or has been deleted",
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
      // Return generic error to prevent user enumeration
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT tokens
    const tokens = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
    });

    // Create response with user data
    const response = NextResponse.json<ApiResponse<LoginResDto>>(
      {
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLogin: user.lastLogin,
          },
        },
        message: "Login successful",
      },
      { status: 200 }
    );

    // Set httpOnly cookies with tokens
    // If rememberMe is true, access token expires in 7 days, otherwise 15 minutes
    setAuthCookies(tokens, rememberMe || false, response);

    return response;
  } catch (error) {
    console.error("Login error:", error);

    // Handle specific error cases
    if (error && typeof error === "object" && "name" in error) {
      if (error.name === "ValidationError" && "errors" in error) {
        const validationError = error as {
          errors: Record<string, { message: string }>;
        };
        const firstError = Object.values(validationError.errors)[0];
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: firstError?.message || "Validation failed",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Login failed. Please try again later.",
      },
      { status: 500 }
    );
  }
}
