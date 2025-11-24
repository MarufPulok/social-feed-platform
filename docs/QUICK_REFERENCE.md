# Quick Reference Card

**Social Feed Platform - Essential Information at a Glance**

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

---

## 🔑 Essential Environment Variables

```env
# Required
MONGODB_URI=mongodb://localhost:27017/social-feed
JWT_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudinary (Required for images)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## 📁 Project Structure

```
social-feed-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Login, Register pages
│   │   ├── (protected)/       # Feed page
│   │   └── api/               # Backend API routes
│   ├── components/            # React components
│   │   ├── auth/             # Auth components
│   │   ├── feed/             # Feed components
│   │   └── ui/               # UI components (shadcn)
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuthQuery.ts   # Auth hooks
│   │   ├── usePostsQuery.ts  # Posts hooks
│   │   └── useCommentsQuery.ts
│   ├── lib/                  # Utilities
│   │   ├── models/          # Mongoose models
│   │   ├── services/        # API services
│   │   └── utils/           # Helper functions
│   ├── dtos/                # Data Transfer Objects
│   └── validators/          # Zod schemas
├── public/                   # Static assets
└── docs/                     # Documentation
```

---

## 🗄️ Database Collections

### Users
```typescript
{
  firstName, lastName, email, password,
  googleId?, authProvider,
  avatar?, followers[], following[],
  followersCount, followingCount,
  isActive, createdAt, updatedAt
}
```

### Posts
```typescript
{
  content, image?, privacy,
  author, reactions[], reactionsCount,
  commentsCount, isDeleted,
  createdAt, updatedAt
}
```

### Comments
```typescript
{
  content, postId, parentId?,
  author, reactions[], reactionsCount,
  repliesCount, isDeleted,
  createdAt, updatedAt
}
```

---

## 🔌 Key API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/google        - Google OAuth
POST   /api/auth/logout        - Logout user
GET    /api/auth/me            - Get current user
```

### Posts
```
GET    /api/posts              - Get feed (paginated)
POST   /api/posts              - Create post
GET    /api/posts/[id]         - Get post by ID
```

### Comments
```
GET    /api/comments           - Get comments for post
POST   /api/comments           - Create comment/reply
```

### Reactions
```
POST   /api/reactions          - Toggle reaction
GET    /api/reactions          - Get reactions
```

### Users
```
POST   /api/users/[id]/follow  - Follow user
DELETE /api/users/[id]/follow  - Unfollow user
GET    /api/users/following    - Get following list
```

### Upload
```
POST   /api/upload             - Upload image
```

---

## 🎨 Key React Query Hooks

```typescript
// Authentication
const { user, isLoading, isAuthenticated } = useAuth();
const loginMutation = useLogin();
const logoutMutation = useLogout();

// Posts
const { data: posts, isLoading } = usePosts(page, limit);
const createPostMutation = useCreatePost();

// Comments
const { data: comments } = useComments(postId);
const createCommentMutation = useCreateComment();

// Reactions
const toggleReactionMutation = useToggleReaction();

// Follow
const followMutation = useFollow();
const unfollowMutation = useUnfollow();
```

---

## 🔒 Security Features

- ✅ JWT authentication (httpOnly cookies)
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ Input validation (Zod, client + server)
- ✅ CSRF protection (SameSite cookies)
- ✅ XSS protection (React auto-escaping)
- ✅ Privacy controls (public/private posts)
- ✅ File upload validation (type, size)
- ✅ Protected routes (middleware)

---

## ⚡ Performance Features

- ✅ Database indexing (compound indexes)
- ✅ Cached counts (likes, comments, followers)
- ✅ React Query caching (5 min stale time)
- ✅ Image optimization (Cloudinary + Next.js)
- ✅ Code splitting (dynamic imports)
- ✅ Lazy loading (images, components)
- ✅ Pagination (efficient queries)
- ✅ Optimistic updates (instant UI)

---

## 📊 Database Indexes

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true });

// Posts
db.posts.createIndex({ author: 1, createdAt: -1 });
db.posts.createIndex({ privacy: 1, createdAt: -1 });
db.posts.createIndex({ isDeleted: 1, createdAt: -1 });

// Comments
db.comments.createIndex({ postId: 1, createdAt: -1 });
db.comments.createIndex({ parentId: 1, createdAt: -1 });
db.comments.createIndex({ author: 1, createdAt: -1 });
```

---

## 🎯 Common Tasks

### Create a New Component
```typescript
// src/components/example/MyComponent.tsx
'use client';

import { useState } from 'react';

export function MyComponent() {
  const [state, setState] = useState('');
  
  return <div>{state}</div>;
}
```

### Create a New API Route
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';

export const GET = withAuth(async (request, { user }) => {
  // Your logic here
  return NextResponse.json({ data: 'success' });
});
```

### Create a React Query Hook
```typescript
// src/hooks/useExample.ts
import { useQuery, useMutation } from '@tanstack/react-query';

export function useExample() {
  return useQuery({
    queryKey: ['example'],
    queryFn: async () => {
      const res = await fetch('/api/example');
      return res.json();
    },
  });
}
```

### Add Validation Schema
```typescript
// src/validators/example.validator.ts
import { z } from 'zod';

export const exampleSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

export type ExampleDto = z.infer<typeof exampleSchema>;
```

---

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- Check `MONGODB_URI` in `.env.local`
- Verify MongoDB is running (local) or accessible (Atlas)
- Check IP whitelist in MongoDB Atlas

### Issue: Images Not Uploading
**Solution:**
- Verify Cloudinary credentials in `.env.local`
- Check file size (max 5MB)
- Check file type (JPEG, PNG, WebP, GIF)

### Issue: Google OAuth Not Working
**Solution:**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check redirect URI in Google Console
- Ensure it matches your app URL

### Issue: Build Fails
**Solution:**
- Run `npm run build` to see errors
- Check TypeScript errors
- Verify all environment variables are set

### Issue: Authentication Not Working
**Solution:**
- Check JWT secrets are set
- Clear browser cookies
- Check middleware is running
- Verify API routes are protected

---

## 📚 Documentation Quick Links

- **[Main Documentation](./PROJECT_DOCUMENTATION.md)** - Complete guide
- **[Authentication](./AUTHENTICATION.md)** - Auth system details
- **[Posts](./POST_FEATURE.md)** - Post features
- **[Deployment](./DEPLOYMENT_GUIDE.md)** - Deploy to production
- **[Video Guide](./VIDEO_WALKTHROUGH_GUIDE.md)** - Record walkthrough
- **[Summary](./PROJECT_SUMMARY.md)** - Project summary

---

## 🚢 Deployment Quick Guide

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Railway
1. Create Railway account
2. Deploy from GitHub
3. Add MongoDB database
4. Add environment variables

### MongoDB Atlas
1. Create free cluster
2. Create database user
3. Whitelist IP (0.0.0.0/0 for cloud)
4. Copy connection string

---

## 🧪 Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Google OAuth login
- [ ] Create text post
- [ ] Create post with image
- [ ] React to post (like, love, haha, angry)
- [ ] Add comment
- [ ] Add reply to comment
- [ ] React to comment
- [ ] Follow user
- [ ] Unfollow user
- [ ] View reactions modal
- [ ] Logout
- [ ] Access protected route (should redirect)

---

## 📞 Support

**Documentation:** Check `docs/` folder  
**Issues:** Review troubleshooting sections  
**Code:** See comments in source files

---

## 📈 Tech Stack Summary

**Frontend:**
- Next.js 16.0.3
- React 19.2.0
- TypeScript 5.x
- Tailwind CSS 4.x
- React Query 5.90.10

**Backend:**
- Next.js API Routes
- MongoDB + Mongoose 9.0.0
- JWT (jsonwebtoken)
- bcryptjs

**Services:**
- Cloudinary (images)
- Google OAuth 2.0

---

## ✅ Features Checklist

- ✅ Email/password authentication
- ✅ Google OAuth integration
- ✅ Protected routes
- ✅ Create posts (text + images)
- ✅ Privacy controls (public/private)
- ✅ Reactions (like, love, haha, angry)
- ✅ Comments and nested replies
- ✅ Follow/unfollow users
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications

---

**Version:** 1.0.0  
**Last Updated:** November 24, 2025

---

**Keep this card handy for quick reference! 📌**
