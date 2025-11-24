import { RegisterReqDto } from "@/dtos/request/auth.req.dto";
import { RegisterResDto } from "@/dtos/response/auth.res.dto";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import connectDB from "@/lib/db/connection";
import User from "@/lib/models/User";
import { setAuthCookies } from "@/lib/utils/cookies";
import { generateTokenPair } from "@/lib/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function validateRegisterRequest(body: unknown): { isValid: boolean; error?: string } {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Request body is required" };
  }

  const { firstName, lastName, email, password } = body as Partial<RegisterReqDto>;

  if (!firstName || typeof firstName !== "string" || firstName.trim().length < 2) {
    return { isValid: false, error: "First name must be at least 2 characters" };
  }

  if (!lastName || typeof lastName !== "string" || lastName.trim().length < 2) {
    return { isValid: false, error: "Last name must be at least 2 characters" };
  }

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    return { isValid: false, error: "Email is required" };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, error: "Please provide a valid email address" };
  }

  if (!password || typeof password !== "string") {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters long" };
  }

  if (password.length > 128) {
    return { isValid: false, error: "Password must be less than 128 characters" };
  }

  return { isValid: true };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    // Validate request
    const validation = validateRegisterRequest(body);
    if (!validation.isValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password } = body as RegisterReqDto;
    const normalizedEmail = email.trim().toLowerCase();

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    // Create new user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password,
      authProvider: "local",
    });

    // Generate JWT tokens
    const tokens = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
    });

    // Create response with user data
    const response = NextResponse.json<ApiResponse<RegisterResDto>>(
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
          },
        },
        message: "Registration successful",
      },
      { status: 201 }
    );

    // Set httpOnly cookies with tokens
    setAuthCookies(tokens, false, response);

    return response;
  } catch (error) {
    console.error("Registration error:", error);

    // Handle Mongoose validation errors
    if (error && typeof error === "object" && "name" in error) {
      if (error.name === "ValidationError" && "errors" in error) {
        const validationError = error as { errors: Record<string, { message: string }> };
        const firstError = Object.values(validationError.errors)[0];
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: firstError?.message || "Validation failed",
          },
          { status: 400 }
        );
      }

      if (error.name === "MongoServerError" && "code" in error && error.code === 11000) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: "An account with this email already exists",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Registration failed. Please try again later.",
      },
      { status: 500 }
    );
  }
}

