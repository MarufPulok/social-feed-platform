# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/social-feed-platform

# JWT Secrets (use strong, random values in production)
JWT_SECRET=your-jwt-secret-key-here
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Cloudinary Configuration (REQUIRED for post images)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Node Environment
NODE_ENV=development

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Setup Instructions

### 1. Database (MongoDB)

- Install MongoDB locally or use MongoDB Atlas
- Update `DATABASE_URL` with your MongoDB connection string
- Example: `mongodb://localhost:27017/social-feed-platform`
- For Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database`

### 2. JWT Secrets

Generate secure random strings for JWT secrets:

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate JWT_REFRESH_SECRET
openssl rand -base64 32
```

### 3. Google OAuth (Optional)

If you want Google login:
- Follow instructions in `GOOGLE_OAUTH_SETUP.md`
- Get credentials from Google Cloud Console
- Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### 4. Cloudinary (Required for Images)

To enable image uploads in posts:
- Follow instructions in `CLOUDINARY_SETUP.md`
- Get credentials from Cloudinary Dashboard
- Update `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`

**Note:** Post creation with images will not work without Cloudinary configuration.

## After Setup

1. Save the `.env.local` file
2. Restart your development server:
   ```bash
   pnpm dev
   ```
3. The application will now use your environment variables

## Verification

### Check if variables are loaded:
```bash
# In your terminal
echo $DATABASE_URL
echo $CLOUDINARY_CLOUD_NAME
```

### Test in application:
- Try creating a post with an image
- Check if images upload successfully
- Verify posts appear in the feed

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to version control
- Use strong, unique secrets in production
- Rotate secrets regularly
- Use environment variables in hosting platforms (Vercel, Netlify, etc.)
- Keep Cloudinary credentials secure

## Troubleshooting

### "Missing environment variables" error
- Verify `.env.local` exists in project root
- Check variable names match exactly (case-sensitive)
- Restart development server after changes

### Cloudinary upload fails
- Verify all three Cloudinary variables are set
- Check for typos in credentials
- Ensure no extra spaces in values

### MongoDB connection fails
- Verify MongoDB is running
- Check connection string format
- Ensure network access (for Atlas)

## Production Deployment

For production (e.g., Vercel):

1. Add all environment variables in hosting platform settings
2. Use production MongoDB connection string
3. Generate new JWT secrets for production
4. Update `NODE_ENV=production`
5. Use production domain in `NEXT_PUBLIC_API_URL`

Example production values:
```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/prod-db
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

