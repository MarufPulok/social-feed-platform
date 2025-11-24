# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the social feed platform.

## Prerequisites

- A Google Cloud Platform account
- Access to Google Cloud Console

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Navigate to **APIs & Services** > **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth 2.0 credentials:
   - Navigate to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Select **Web application**
   - Configure the OAuth consent screen if prompted

5. Configure OAuth Client:
   - **Name**: Your app name (e.g., "Social Feed Platform")
   - **Authorized JavaScript origins**:
     - Development: `http://localhost:3000`
     - Production: `https://yourdomain.com`
   - **Authorized redirect URIs**:
     - Development: `http://localhost:3000/api/auth/google/callback`
     - Production: `https://yourdomain.com/api/auth/google/callback`

6. Click **Create** and save your credentials

## Step 2: Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-from-console
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-console
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-from-console
```

### Your Current Configuration

Based on your provided environment variables, they are already configured:

```env
GOOGLE_CLIENT_ID=1003956437270-ct2qvn912ildom19jj67ibqrfjmdr74c.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1003956437270-ct2qvn912ildom19jj67ibqrfjmdr74c.apps.googleusercontent.com
```

## Step 3: Update Google Console Redirect URIs

Make sure your Google OAuth client has the following redirect URIs configured:

### Development
- `http://localhost:3000/api/auth/google/callback`

### Production (when deployed)
- `https://yourdomain.com/api/auth/google/callback`

**Important**: Replace `https://yourdomain.com` with your actual production domain.

## Step 4: Test Google Sign-In

1. Start your development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. Navigate to the login or register page
3. Click the "Sign in with Google" button
4. You should be redirected to Google's OAuth consent screen
5. After authorizing, you'll be redirected back to your app

## How It Works

### User Flow

1. **User clicks "Sign in with Google"**
   - Redirects to `/api/auth/google`
   - This route generates Google OAuth URL and redirects to Google

2. **User authorizes on Google**
   - Google redirects back to `/api/auth/google/callback` with authorization code

3. **Callback processes authentication**
   - Exchanges code for tokens
   - Verifies ID token
   - Creates or updates user in database
   - Sets authentication cookies
   - Redirects to `/feed`

### Database Changes

The User model has been updated to support OAuth:

- `googleId` - Stores Google user ID
- `authProvider` - Either "local" or "google"
- `password` - Optional for Google users (required for local users)
- `isEmailVerified` - Automatically set to true for Google users

### Security Features

- **HttpOnly cookies** - Prevents JavaScript access to tokens
- **Secure flag** - Ensures cookies are only sent over HTTPS in production
- **Token verification** - Validates Google ID tokens
- **Duplicate prevention** - Prevents multiple accounts with same email
- **Account status checks** - Ensures user is active before login

## Troubleshooting

### Error: "Google OAuth not configured"
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env.local`
- Restart your development server after adding environment variables

### Error: "Redirect URI mismatch"
- Ensure the redirect URI in Google Console exactly matches your callback URL
- Check for trailing slashes
- Verify http vs https

### Error: "Invalid token"
- The authorization code may have expired
- Try the sign-in process again

### Error: "No email found in Google account"
- The Google account must have an email address
- Ensure email scope is requested in OAuth URL

## Production Deployment

Before deploying to production:

1. **Update environment variables**:
   ```env
   NODE_ENV=production
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_API_URL=https://yourdomain.com/api
   ```

2. **Update Google Console**:
   - Add production redirect URI
   - Add production JavaScript origin

3. **Ensure HTTPS**:
   - OAuth requires HTTPS in production
   - Secure flag will be enabled automatically

4. **Generate strong secrets**:
   ```bash
   openssl rand -base64 32
   ```
   - Use for JWT_SECRET and NEXTAUTH_SECRET

## API Routes Reference

### `/api/auth/google` (GET)
Initiates Google OAuth flow by redirecting to Google's authorization page.

**Response**: Redirect to Google OAuth consent screen

### `/api/auth/google/callback` (GET)
Handles Google OAuth callback after user authorization.

**Query Parameters**:
- `code` - Authorization code from Google
- `error` - Error message if OAuth failed

**Success**: Redirects to `/feed` with auth cookies set
**Error**: Redirects to `/login?error=<error_type>`

## Error Codes

| Error Code | Description |
|------------|-------------|
| `oauth_failed` | General OAuth failure |
| `oauth_cancelled` | User cancelled OAuth flow |
| `oauth_not_configured` | Missing environment variables |
| `invalid_token` | Invalid ID token from Google |
| `no_email` | Google account has no email |
| `account_inactive` | User account is deactivated |

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify environment variables are correctly set
3. Check Google Cloud Console configuration
4. Review server logs for detailed error messages

