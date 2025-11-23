# Post Creation Feature Documentation

## Overview

The social feed platform now supports creating posts with text and images, with privacy controls (public/private). Posts are displayed in reverse chronological order (newest first).

## Features

### ✅ Implemented Features

1. **Post Creation**
   - Create posts with text content (required)
   - Upload images with posts (optional)
   - Set privacy: Public or Private
   - Real-time form validation with Zod
   - Image preview before posting
   - Progress indication during upload

2. **Privacy Controls**
   - **Public Posts:** Visible to everyone (authenticated or not)
   - **Private Posts:** Visible only to the post author

3. **Image Handling**
   - Upload to Cloudinary
   - Automatic image optimization
   - Support for: JPEG, PNG, WebP, GIF
   - Maximum file size: 5MB
   - Image preview with remove option

4. **Post Display**
   - Newest posts first (sorted by creation date)
   - Author information (email, avatar)
   - Post date
   - Privacy indicator
   - Image display (if present)
   - Loading and error states

5. **React Query Integration**
   - Automatic cache management
   - Optimistic updates
   - Query invalidation after post creation
   - Efficient data fetching

## Technical Implementation

### File Structure

```
src/
├── lib/
│   ├── models/
│   │   └── Post.ts                    # Mongoose Post model
│   └── utils/
│       └── cloudinary.ts              # Cloudinary upload/delete utilities
├── validators/
│   └── post.validator.ts              # Zod validation schemas
├── app/
│   └── api/
│       ├── upload/
│       │   └── route.ts               # Image upload endpoint
│       └── posts/
│           └── route.ts               # Posts CRUD endpoints
├── hooks/
│   └── usePostsQuery.ts               # React Query hooks for posts
└── components/
    └── feed/
        ├── posts/
        │   ├── PostComposer.tsx       # Post creation form
        │   ├── Post.tsx               # Post display component
        │   └── PostHeader.tsx         # Post header with author info
        └── FeedPage.tsx               # Main feed page
```

### Database Schema

**Post Model:**
```typescript
{
  content: string;              // Required, max 5000 chars
  image?: string;               // Cloudinary URL
  imagePublicId?: string;       // For deletion
  privacy: "public" | "private"; // Default: "public"
  author: ObjectId;             // Reference to User
  likes: ObjectId[];            // Array of User IDs
  likesCount: number;           // Cached count
  commentsCount: number;        // Cached count
  isDeleted: boolean;           // Soft delete
  deletedAt?: Date;             // Deletion timestamp
  createdAt: Date;              // Auto-generated
  updatedAt: Date;              // Auto-generated
}
```

### API Endpoints

#### 1. Upload Image
```
POST /api/upload
Authorization: Required (Cookie-based)
Content-Type: multipart/form-data

Body:
- file: File (required)
- type: "post" | "profile" | "comment" (optional)

Response:
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "social-feed/posts/xyz",
    "width": 1200,
    "height": 800,
    "format": "jpg"
  }
}
```

#### 2. Get Posts
```
GET /api/posts?page=1&limit=10
Authorization: Optional (Cookie-based)

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)

Response:
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": [
    {
      "_id": "...",
      "content": "Post content",
      "image": "https://...",
      "privacy": "public",
      "author": {
        "_id": "...",
        "email": "user@example.com",
        "avatar": "https://..."
      },
      "likesCount": 0,
      "commentsCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasMore": true
  }
}
```

#### 3. Create Post
```
POST /api/posts
Authorization: Required (Cookie-based)
Content-Type: application/json

Body:
{
  "content": "Post content",
  "privacy": "public" | "private",
  "image": "https://...", // Optional
  "imagePublicId": "social-feed/posts/xyz" // Optional
}

Response:
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "...",
    "content": "Post content",
    "image": "https://...",
    "privacy": "public",
    "author": { ... },
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Validation Rules

### Content
- **Required:** Yes
- **Min Length:** 1 character
- **Max Length:** 5000 characters
- **Format:** Plain text (whitespace preserved)

### Privacy
- **Required:** Yes
- **Allowed Values:** "public", "private"
- **Default:** "public"

### Image
- **Required:** No
- **Max Size:** 5MB
- **Allowed Types:** JPEG, JPG, PNG, WebP, GIF
- **Auto Optimizations:**
  - Resized to max 1200x1200px
  - Quality: Auto
  - Format: Auto (WebP when supported)

## React Query Hooks

### usePosts
Fetch posts with pagination:
```typescript
const { data, isLoading, isError, error } = usePosts(page, limit);
```

### useCreatePost
Create a new post:
```typescript
const mutation = useCreatePost();
await mutation.mutateAsync({
  content: "Hello world",
  privacy: "public",
  image: "https://...",
  imagePublicId: "social-feed/posts/xyz"
});
```

### useUploadImage
Upload an image to Cloudinary:
```typescript
const mutation = useUploadImage();
const result = await mutation.mutateAsync({
  file: imageFile,
  type: "post"
});
```

## Privacy Logic

### Authenticated Users
- Can see all public posts
- Can see their own private posts
- Cannot see other users' private posts

### Unauthenticated Users
- Can see only public posts
- Cannot create posts

## Query Invalidation

After creating a post:
```typescript
queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
```

This ensures:
- Feed automatically refreshes
- New post appears at the top
- No manual page refresh needed

## User Experience

### Post Creation Flow
1. User types content in textarea
2. (Optional) User clicks Photo button to select image
3. Image preview appears with remove button
4. User selects privacy (Public/Private)
5. User clicks Post button
6. Loading state shows "Posting..."
7. On success:
   - Toast notification appears
   - Form resets
   - Feed refreshes with new post at top
8. On error:
   - Toast notification with error message
   - Form data preserved for retry

### Feed Display
1. Loading state shows "Loading posts..."
2. Posts appear newest first
3. Empty state: "No posts yet. Be the first to post!"
4. Error state: Error message displayed

## Environment Variables Required

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

See `CLOUDINARY_SETUP.md` for detailed setup instructions.

## Future Enhancements

### Potential Features
- [ ] Edit posts
- [ ] Delete posts
- [ ] Post reactions/likes
- [ ] Share posts
- [ ] Tag users in posts
- [ ] Hashtags support
- [ ] Multiple image uploads
- [ ] Video support
- [ ] Draft posts
- [ ] Scheduled posts
- [ ] Post analytics
- [ ] Infinite scroll pagination

## Testing

### Manual Testing Checklist

**Post Creation:**
- [ ] Create post with text only
- [ ] Create post with text and image
- [ ] Create public post
- [ ] Create private post
- [ ] Validate empty content (should fail)
- [ ] Validate image size > 5MB (should fail)
- [ ] Validate invalid image format (should fail)
- [ ] Remove image before posting
- [ ] Create post while unauthenticated (should fail)

**Post Display:**
- [ ] View public posts (unauthenticated)
- [ ] View public posts (authenticated)
- [ ] View own private posts (authenticated)
- [ ] Verify posts sorted newest first
- [ ] View post with image
- [ ] View post without image
- [ ] Empty feed state
- [ ] Loading state
- [ ] Error state

**Privacy:**
- [ ] Public post visible to everyone
- [ ] Private post visible only to author
- [ ] Private post hidden from other users

## Troubleshooting

### Posts not appearing
1. Check browser console for errors
2. Verify authentication (cookies present)
3. Check database connection
4. Verify MongoDB has posts with `isDeleted: false`

### Image upload failing
1. Check Cloudinary credentials in `.env.local`
2. Verify file size < 5MB
3. Verify file type is supported
4. Check browser console for upload errors
5. Check Cloudinary dashboard for errors

### Form validation errors
1. Check content is not empty
2. Verify privacy value is "public" or "private"
3. Check image file size and type

## Performance Considerations

### Optimizations Implemented
- Image lazy loading with Next.js Image component
- Automatic image optimization via Cloudinary
- Query caching with React Query (5-minute stale time)
- Efficient pagination
- Indexed database queries (author, privacy, createdAt)

### Recommendations
- Implement infinite scroll for better UX
- Add image compression before upload
- Use CDN for faster image delivery (Cloudinary provides this)
- Implement virtual scrolling for large lists

## Security Considerations

### Implemented Security
- Authentication required for post creation
- Server-side validation with Zod
- File type validation
- File size limits
- Privacy enforcement at API level
- XSS protection (React automatically escapes content)

### Best Practices
- Never trust client-side validation alone
- Always verify authentication on server
- Sanitize user input
- Use HTTPS in production
- Implement rate limiting for uploads
- Monitor for abuse

## Support

For issues or questions about the post feature:
1. Check this documentation
2. Review `CLOUDINARY_SETUP.md` for image upload issues
3. Check browser console for client-side errors
4. Check server logs for API errors
5. Verify environment variables are set correctly

