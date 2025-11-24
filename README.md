# Social Feed Platform

A modern, full-stack social media platform built with Next.js, React, TypeScript, and MongoDB. Features include authentication, posts with images, reactions, comments, and a follow system.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-9.0.0-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8)

## 🚀 Features

### ✅ Implemented
- **Authentication & Authorization**
  - Email/password registration and login
  - Google OAuth 2.0 integration
  - JWT-based session management with automatic refresh
  - Protected routes (middleware + client-side)
  
- **Posts**
  - Create posts with text and images
  - Privacy controls (public/private)
  - Image upload to Cloudinary
  - Display posts in reverse chronological order
  
- **Reactions System**
  - Multiple reaction types (like, love, haha, angry)
  - Reactions on posts, comments, and replies
  - View who reacted (modal)
  - Custom SVG icons
  
- **Comments & Replies**
  - Add comments to posts
  - Nested replies (one level)
  - Reactions on comments/replies
  - Real-time updates
  
- **Follow System**
  - Follow/unfollow users
  - View followers and following lists
  - Suggested users to follow
  - Follower/following counts
  
- **User Interface**
  - Responsive design (mobile, tablet, desktop)
  - Toast notifications
  - Loading states and skeletons
  - Accessible components (ARIA)
  - Matches provided design specifications

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: TanStack React Query 5.90.10
- **Form Handling**: React Hook Form 7.54.2
- **Validation**: Zod 3.24.1
- **UI Components**: Radix UI, Lucide React
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: MongoDB with Mongoose 9.0.0
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 3.0.3
- **Image Storage**: Cloudinary 2.5.1
- **OAuth**: Google OAuth 2.0

## 📋 Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB 6.0+ (local or MongoDB Atlas)
- pnpm (or npm/yarn)
- Cloudinary account (free tier)
- Google Cloud Console project (for OAuth, optional)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd social-feed-platform
```

### 2. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/social-feed

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**See detailed setup guides:**
- [Environment Setup](./docs/ENV_SETUP.md)
- [Cloudinary Setup](./docs/CLOUDINARY_SETUP.md)
- [Google OAuth Setup](./docs/GOOGLE_OAUTH_SETUP.md)

### 4. Run Development Server
```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 5. Build for Production
```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[📖 Project Documentation](./docs/PROJECT_DOCUMENTATION.md)** - Complete guide covering:
  - Architecture & design decisions
  - Database design & schema
  - Features implementation details
  - Security considerations
  - Performance & scalability
  - Complete API reference
  - Deployment guide
  - Future enhancements

- **[🔐 Authentication](./docs/AUTHENTICATION.md)** - Authentication system details
- **[📝 Post Feature](./docs/POST_FEATURE.md)** - Post creation and display
- **[☁️ Cloudinary Setup](./docs/CLOUDINARY_SETUP.md)** - Image upload configuration
- **[🔑 Google OAuth Setup](./docs/GOOGLE_OAUTH_SETUP.md)** - OAuth integration guide
- **[⚙️ Environment Setup](./docs/ENV_SETUP.md)** - Environment variables guide
- **[📊 Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md)** - Development summary

## 🏗️ Project Structure

```
social-feed-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (protected)/       # Protected routes (feed)
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── auth/             # Authentication components
│   │   ├── feed/             # Feed components
│   │   └── ui/               # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and configurations
│   │   ├── models/          # Mongoose models
│   │   ├── services/        # API services
│   │   └── utils/           # Helper functions
│   ├── dtos/                # Data Transfer Objects
│   └── validators/          # Zod validation schemas
├── public/                   # Static assets
├── docs/                     # Documentation
└── task_assets/             # Original design files

```

## 🔒 Security Features

- ✅ JWT-based authentication with httpOnly cookies
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Input validation (client + server-side with Zod)
- ✅ CSRF protection (SameSite cookies)
- ✅ XSS protection (React auto-escaping)
- ✅ Privacy controls (public/private posts)
- ✅ Secure file uploads (type and size validation)
- ✅ Protected API routes with middleware

## ⚡ Performance Optimizations

- ✅ Database indexing for common queries
- ✅ Cached counts (likes, comments, followers)
- ✅ React Query client-side caching
- ✅ Image optimization (Cloudinary + Next.js Image)
- ✅ Code splitting and lazy loading
- ✅ Pagination for large datasets
- ✅ Optimistic updates for better UX

## 📊 Database Schema

### Collections
1. **Users** - User accounts and profiles
2. **Posts** - User posts with privacy controls
3. **Comments** - Comments and nested replies

### Key Design Decisions
- **Embedded reactions** for faster reads
- **Cached counts** to avoid expensive aggregations
- **Soft deletes** for data recovery
- **Compound indexes** for optimized queries
- **Denormalization** for performance

See [Project Documentation](./docs/PROJECT_DOCUMENTATION.md#database-design) for detailed schema.

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get posts (feed)
- `POST /api/posts` - Create post
- `GET /api/posts/[id]` - Get post by ID

### Comments
- `GET /api/comments` - Get comments for post
- `POST /api/comments` - Create comment/reply

### Reactions
- `POST /api/reactions` - Toggle reaction
- `GET /api/reactions` - Get reactions for target

### Users
- `POST /api/users/[id]/follow` - Follow user
- `DELETE /api/users/[id]/follow` - Unfollow user
- `GET /api/users/following` - Get following list

### Upload
- `POST /api/upload` - Upload image to Cloudinary

See [API Documentation](./docs/PROJECT_DOCUMENTATION.md#api-documentation) for complete reference.

## 🚢 Deployment

### Recommended Platforms
- **Vercel** (Recommended) - Optimized for Next.js
- **Railway** - Full-stack deployment with built-in MongoDB
- **AWS** - EC2 + DocumentDB for enterprise scale

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Configure production MongoDB URI (MongoDB Atlas)
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure rate limiting
- [ ] Enable database backups
- [ ] Set up CDN for static assets

See [Deployment Guide](./docs/PROJECT_DOCUMENTATION.md#setup--deployment) for details.

## 🎯 Design Decisions

### Why Next.js?
- Server-side rendering for better SEO
- API routes for backend (no separate server)
- Automatic code splitting
- Built-in optimization
- Excellent TypeScript support

### Why React Query?
- Automatic caching and refetching
- Optimistic updates
- Better loading/error states
- Reduced boilerplate vs Redux
- DevTools for debugging

### Why MongoDB?
- Flexible schema for evolving features
- Better performance for read-heavy operations
- Horizontal scaling capabilities
- Native JSON support
- Suitable for social media use cases

### Why Embedded Reactions?
- Faster reads (single query)
- Atomic updates
- Simpler queries
- Good for limited reaction types
- Acceptable document size for typical usage

See [Architecture & Design Decisions](./docs/PROJECT_DOCUMENTATION.md#architecture--design-decisions) for detailed rationale.

## 🔮 Future Enhancements

### Planned Features
- [ ] Direct messaging
- [ ] Notifications system
- [ ] Email verification
- [ ] Password reset
- [ ] Edit/delete posts
- [ ] Share posts
- [ ] Search functionality
- [ ] Hashtags and mentions
- [ ] Video uploads
- [ ] Story/status updates
- [ ] Admin dashboard
- [ ] Mobile app (React Native)

See [Future Enhancements](./docs/PROJECT_DOCUMENTATION.md#future-enhancements) for complete roadmap.

## 📈 Scalability

The application is designed to handle millions of posts and users:

- **Database**: MongoDB sharding with read replicas
- **Caching**: React Query (client) + Redis (server, recommended)
- **CDN**: Cloudinary for images, Vercel for static assets
- **Load Balancing**: Horizontal scaling with multiple app instances
- **Background Jobs**: Queue system for heavy operations

See [Performance & Scalability](./docs/PROJECT_DOCUMENTATION.md#performance--scalability) for details.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Maruf Pulok**

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for the database
- Cloudinary for image storage
- All open-source contributors

---

**For detailed documentation, see [docs/PROJECT_DOCUMENTATION.md](./docs/PROJECT_DOCUMENTATION.md)**
