# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads in the social feed platform.

## Prerequisites

- A Cloudinary account (free tier available)

## Step 1: Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get API Credentials

1. Log in to your Cloudinary dashboard
2. Navigate to the **Dashboard** (default landing page)
3. You'll see your **Account Details** section with:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 3: Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Example Configuration

```env
CLOUDINARY_CLOUD_NAME=dxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

## Step 4: Folder Structure

The application automatically organizes uploads into folders:

- `social-feed/posts/` - Post images
- `social-feed/profiles/` - Profile avatars
- `social-feed/comments/` - Comment images

These folders will be created automatically when you upload images.

## Step 5: Image Transformations

The application applies automatic optimizations:

### Post Images
- Maximum dimensions: 1200x1200px
- Auto quality optimization
- Auto format selection (WebP support)

### Profile Images
- Dimensions: 400x400px (cropped, face detection)
- Auto quality optimization
- Auto format selection

### Comment Images
- Maximum dimensions: 800x800px
- Auto quality optimization
- Auto format selection

## Features

### Supported Image Formats
- JPEG/JPG
- PNG
- WebP
- GIF

### File Size Limit
- Maximum: 5MB per image

### Security
- All uploads require authentication
- Images are served over HTTPS
- Public IDs are stored for deletion capability

## API Endpoints

### Upload Image
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File (required)
- type: "post" | "profile" | "comment" (optional, defaults to "post")
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "social-feed/posts/abc123",
    "width": 1200,
    "height": 800,
    "format": "jpg"
  }
}
```

## Usage in Code

### Upload Image Hook
```typescript
import { useUploadImage } from "@/hooks/usePostsQuery";

function MyComponent() {
  const uploadMutation = useUploadImage();

  const handleUpload = async (file: File) => {
    try {
      const result = await uploadMutation.mutateAsync({
        file,
        type: "post"
      });
      console.log("Uploaded:", result.url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <input 
      type="file" 
      onChange={(e) => handleUpload(e.target.files[0])}
    />
  );
}
```

### Delete Image
```typescript
import { deleteImage } from "@/lib/utils/cloudinary";

// Server-side only
await deleteImage(publicId);
```

## Cloudinary Dashboard Features

### Media Library
- View all uploaded images
- Organize into folders
- Delete images
- Get embed codes

### Transformations
- Resize images
- Apply filters
- Optimize quality
- Convert formats

### Usage Monitoring
- Track bandwidth
- Monitor storage
- View transformations count

## Free Tier Limits

- **Storage:** 25GB
- **Bandwidth:** 25GB/month
- **Transformations:** 25,000/month
- **API requests:** Unlimited

## Troubleshooting

### Error: "Invalid API credentials"
- Double-check your Cloud Name, API Key, and API Secret
- Ensure there are no extra spaces in `.env.local`
- Restart your development server after updating environment variables

### Error: "File too large"
- Maximum file size is 5MB
- Consider compressing images before upload

### Error: "Invalid file type"
- Only JPEG, PNG, WebP, and GIF formats are supported
- Check the file extension

### Images not displaying
- Verify the Cloudinary URL is correct
- Check if the image was successfully uploaded in Cloudinary dashboard
- Ensure HTTPS is used for image URLs

## Production Deployment

Before deploying to production:

1. **Secure your credentials:**
   - Never commit `.env.local` to version control
   - Use environment variables in your hosting platform

2. **Configure upload presets:**
   - Create upload presets in Cloudinary dashboard
   - Add security restrictions (allowed formats, file size limits)

3. **Set up webhooks (optional):**
   - Get notifications when uploads complete
   - Track usage and errors

4. **Enable auto backup:**
   - Configure Cloudinary backups
   - Set up redundancy for critical images

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Integration Guide](https://cloudinary.com/documentation/next_integration)
- [Image Optimization Best Practices](https://cloudinary.com/documentation/image_optimization)

## Support

For issues or questions:
1. Check this troubleshooting section
2. Verify environment variables are correctly set
3. Review Cloudinary dashboard for errors
4. Check server logs for detailed error messages

