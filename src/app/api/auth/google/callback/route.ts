import connectDB from "@/lib/db/connection";
import User from "@/lib/models/User";
import { setAuthCookies } from "@/lib/utils/cookies";
import { generateTokenPair } from "@/lib/utils/jwt";
import { OAuth2Client } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/google/callback
 * Handles Google OAuth callback, creates/logs in user, and sets auth cookies
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // Handle OAuth errors from Google
    if (error) {
      console.error("Google OAuth error:", error);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?error=oauth_cancelled`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?error=oauth_failed`
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      console.error("Google OAuth credentials not configured");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?error=oauth_not_configured`
      );
    }

    // Initialize OAuth2 client
    const client = new OAuth2Client(clientId, clientSecret, redirectUri);

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Verify ID token and get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      console.error("Invalid token payload");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?error=invalid_token`
      );
    }

    const { sub: googleId, email, name, picture, given_name, family_name } = payload;

    if (!email) {
      console.error("No email in Google account");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?error=no_email`
      );
    }

    // Connect to database
    await connectDB();

    // Find or create user
    let user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { googleId }],
    });

    // Determine first and last name
    let firstName = given_name || "";
    let lastName = family_name || "";

    if (!firstName && name) {
      const nameParts = name.split(" ");
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ") || "";
    }
    
    // Fallback if still empty (though Google usually provides name)
    if (!firstName) firstName = "User";
    if (!lastName) lastName = "";

    if (user) {
      // Update existing user with Google ID if they don't have it
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        user.isEmailVerified = true; // Google emails are verified
        if (picture) user.avatar = picture;
      }

      // Ensure names are present (backfill for existing users)
      if (!user.firstName) user.firstName = firstName;
      if (!user.lastName) user.lastName = lastName;
      
      // Save changes if modified
      if (user.isModified()) {
        await user.save();
      }
      
      // Check if account is active
      if (!user.isActive || user.deletedAt) {
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?error=account_inactive`
        );
      }
    } else {
      // Create new user
      user = new User({
        email: email.toLowerCase(),
        firstName,
        lastName,
        googleId,
        authProvider: "google",
        isEmailVerified: true, // Google emails are verified
        avatar: picture || null,
        isActive: true,
      });
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT tokens
    const authTokens = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
    });

    // Create response with redirect
    const response = NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/feed`
    );

    // Set auth cookies
    setAuthCookies(authTokens, false, response);

    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?error=oauth_failed`
    );
  }
}

