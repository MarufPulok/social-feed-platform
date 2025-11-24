# Video Walkthrough Guide

This guide outlines what to demonstrate in your video walkthrough for the social feed platform.

## 📹 Video Structure (Recommended: 10-15 minutes)

### 1. Introduction (1 minute)
- Brief project overview
- Tech stack mention (Next.js, React, TypeScript, MongoDB)
- Features overview

### 2. Authentication Demo (2-3 minutes)

#### Registration
- Show registration form
- Fill in: First Name, Last Name, Email, Password
- Submit and show successful registration
- Automatic redirect to feed

#### Login
- Logout from current session
- Show login form
- Demonstrate login with credentials
- Show successful login and redirect

#### Google OAuth (Optional)
- Click "Sign in with Google"
- Show Google consent screen
- Successful authentication
- Redirect to feed

#### Protected Routes
- Try accessing `/feed` without authentication
- Show redirect to login page
- Show that authenticated users can't access `/login` or `/register`

### 3. Post Creation (2-3 minutes)

#### Text-Only Post
- Click on "What's on your mind?" textarea
- Type some content
- Select privacy: Public
- Click "Post" button
- Show post appearing at top of feed

#### Post with Image
- Click on "What's on your mind?" textarea
- Type some content
- Click "Photo" button
- Select an image from computer
- Show image preview
- Select privacy: Public
- Click "Post" button
- Show post with image in feed

#### Private Post
- Create a new post
- Select privacy: Private
- Post the content
- Show private indicator on the post
- (Optional) Logout and show that private post is not visible to others

### 4. Reactions System (2-3 minutes)

#### Post Reactions
- Hover over the "Like" button on a post
- Show reaction picker appearing (like, love, haha, angry)
- Click "Love" reaction
- Show reaction count increment
- Show your reaction displayed
- Hover again and click "Like" to change reaction
- Click same reaction to remove it

#### View Who Reacted
- Click on reaction count
- Show reactions modal with list of users who reacted
- Show user avatars and names
- Close modal

#### Comment Reactions
- Scroll to a comment
- Hover over comment's like button
- Show reaction picker
- Add a reaction to comment
- Show it works the same as post reactions

### 5. Comments & Replies (2-3 minutes)

#### Add Comment
- Click "Comment" button on a post
- Type a comment
- Click "Post" button
- Show comment appearing below post
- Show comment count increment

#### Add Reply
- Click "Reply" button on a comment
- Type a reply
- Click "Post" button
- Show reply appearing nested under comment
- Show replies count on parent comment

#### Expand/Collapse Replies
- Click "View replies" to expand
- Show nested replies
- Click "Hide replies" to collapse

#### React to Comments/Replies
- Add reactions to comments
- Add reactions to replies
- Show reaction counts

### 6. Follow System (1-2 minutes)

#### Follow User
- Scroll to "You Might Like" section in sidebar
- Click "Follow" button on a suggested user
- Show button change to "Following"
- Show follower count increment (if visible)

#### Unfollow User
- Click "Following" button
- Show button change back to "Follow"
- Show follower count decrement

#### View Following List
- Navigate to profile or following section
- Show list of users you're following
- (Optional) Show followers list

### 7. Feed Features (1-2 minutes)

#### Feed Display
- Scroll through feed
- Show posts from different users
- Show posts are sorted newest first
- Show different post types:
  - Text only
  - With images
  - Public vs Private indicators

#### User Profiles in Feed
- Show user avatars
- Show user names
- Show post timestamps
- Show engagement metrics (likes, comments)

### 8. Responsive Design (1 minute)

#### Desktop View
- Show full layout with sidebar
- Show all features working

#### Mobile View (Optional)
- Resize browser window or use DevTools
- Show responsive layout
- Show mobile navigation
- Show features still work on mobile

### 9. Code Overview (2-3 minutes)

#### Project Structure
- Open VS Code or editor
- Show folder structure:
  ```
  src/
  ├── app/
  ├── components/
  ├── hooks/
  ├── lib/
  └── dtos/
  ```

#### Key Files
- Show `src/lib/models/` (database schemas)
- Show `src/app/api/` (API routes)
- Show `src/hooks/usePostsQuery.ts` (React Query)
- Show `src/components/feed/` (UI components)

#### Database Models
- Open `src/lib/models/User.ts`
- Briefly explain User schema
- Open `src/lib/models/Post.ts`
- Briefly explain Post schema with reactions
- Open `src/lib/models/Comment.ts`
- Briefly explain Comment schema

#### API Routes
- Show `src/app/api/auth/login/route.ts`
- Show `src/app/api/posts/route.ts`
- Show `src/app/api/reactions/route.ts`
- Explain JWT authentication middleware

#### React Query Hooks
- Show `src/hooks/usePostsQuery.ts`
- Explain caching and automatic refetching
- Show `src/hooks/useAuthQuery.ts`

### 10. Technical Highlights (1-2 minutes)

#### Security
- Mention JWT authentication
- httpOnly cookies
- Input validation (Zod)
- Privacy controls

#### Performance
- Database indexing
- Cached counts
- React Query caching
- Image optimization (Cloudinary)

#### Scalability
- MongoDB design for millions of posts
- Horizontal scaling capability
- Efficient queries with indexes
- Embedded reactions for performance

### 11. Conclusion (1 minute)
- Recap main features
- Mention documentation
- Thank viewers

## 🎬 Recording Tips

### Before Recording
- [ ] Clear browser cache and cookies
- [ ] Prepare test accounts (2-3 users)
- [ ] Prepare test images for posts
- [ ] Close unnecessary browser tabs
- [ ] Close unnecessary applications
- [ ] Set browser zoom to 100%
- [ ] Use incognito/private window for clean state

### During Recording
- [ ] Speak clearly and at moderate pace
- [ ] Explain what you're doing before doing it
- [ ] Show results of each action
- [ ] Highlight important UI elements
- [ ] Zoom in on small details if needed
- [ ] Pause briefly between sections

### Recording Tools
- **Screen Recording**: OBS Studio, QuickTime (Mac), Windows Game Bar
- **Video Editing**: DaVinci Resolve (free), iMovie, Adobe Premiere
- **Audio**: Use good microphone, minimize background noise

### Video Settings
- **Resolution**: 1920x1080 (1080p) minimum
- **Frame Rate**: 30fps or 60fps
- **Format**: MP4 (H.264)
- **Audio**: Clear narration, no background music (optional)

## 📝 Script Template

### Opening
> "Hello! In this video, I'll be demonstrating the social feed platform I built using Next.js, React, TypeScript, and MongoDB. This is a full-stack application with features like authentication, posts with images, reactions, comments, and a follow system. Let's dive in!"

### Feature Demonstrations
> "First, let me show you the authentication system. I'll register a new user... [demonstrate]. As you can see, the form validates the input and creates a new account. After registration, I'm automatically logged in and redirected to the feed."

> "Now, let me create a post. I'll type some content... [demonstrate]. I can also add an image by clicking the Photo button... [demonstrate]. Notice the image preview appears. I can choose to make this post public or private. Let me post it... and there it is at the top of the feed!"

> "One of the cool features is the reactions system. Instead of just a like button, users can react with different emotions. Let me hover over the like button... [demonstrate]. See the reaction picker? I can choose like, love, haha, or angry. Let me react with love... [demonstrate]. The reaction count updates instantly."

### Code Overview
> "Let me show you some of the code behind this. Here's the project structure... [show]. The application uses Next.js App Router with API routes for the backend. Here's the User model... [show]. Notice the schema includes fields for followers, reactions, and authentication. The Post model... [show] uses embedded reactions for better performance."

### Closing
> "That covers the main features of the application. All the code is available on GitHub, and I've included comprehensive documentation covering the architecture, database design, API reference, and deployment guide. Thank you for watching!"

## 🎯 Key Points to Emphasize

### Technical Excellence
- Modern tech stack (Next.js 16, React 19, TypeScript)
- Type-safe implementation with Zod validation
- React Query for state management
- Secure authentication (JWT, httpOnly cookies)

### Features
- Complete authentication system (email + Google OAuth)
- Rich post creation (text + images)
- Advanced reactions system (4 types)
- Nested comments and replies
- Follow/unfollow functionality

### Best Practices
- Input validation (client + server)
- Error handling and loading states
- Responsive design
- Accessibility (ARIA labels)
- Security (XSS, CSRF protection)

### Scalability
- Database design for millions of posts
- Efficient indexing strategy
- Cached counts for performance
- Horizontal scaling capability

### Code Quality
- Clean architecture
- Reusable components
- Custom hooks
- Comprehensive documentation

## 📤 Upload Instructions

### YouTube Upload
1. Go to [YouTube Studio](https://studio.youtube.com)
2. Click "Create" → "Upload videos"
3. Select your video file
4. Fill in details:
   - **Title**: "Social Feed Platform - Full Stack Next.js Application"
   - **Description**: Include GitHub link, tech stack, features
   - **Visibility**: Unlisted (or Private with link)
   - **Tags**: nextjs, react, typescript, mongodb, fullstack, social-media
5. Click "Publish"
6. Copy the video link

### Video Description Template
```
Social Feed Platform - Full Stack Application

A modern social media platform built with Next.js, React, TypeScript, and MongoDB.

🔗 GitHub Repository: [your-repo-link]
📚 Documentation: [link-to-docs]
🌐 Live Demo: [link-if-deployed]

⚡ Tech Stack:
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Next.js API Routes, MongoDB, Mongoose
- Auth: JWT, Google OAuth 2.0
- Storage: Cloudinary
- State: React Query

✨ Features:
- Secure authentication (email + Google OAuth)
- Create posts with text and images
- Reactions system (like, love, haha, angry)
- Comments and nested replies
- Follow/unfollow users
- Privacy controls (public/private posts)
- Responsive design

🎯 Highlights:
- Type-safe with TypeScript and Zod
- Optimized for performance and scalability
- Secure (JWT, input validation, privacy controls)
- Comprehensive documentation

Timestamps:
0:00 - Introduction
0:30 - Authentication Demo
3:00 - Post Creation
5:00 - Reactions System
7:00 - Comments & Replies
9:00 - Follow System
10:00 - Code Overview
12:00 - Technical Highlights
13:00 - Conclusion
```

## ✅ Final Checklist

Before submitting:
- [ ] Video is 10-15 minutes long
- [ ] All major features demonstrated
- [ ] Code overview included
- [ ] Audio is clear
- [ ] Video quality is 1080p minimum
- [ ] Uploaded to YouTube (unlisted/private)
- [ ] Video link copied
- [ ] GitHub repository is public
- [ ] README.md is complete
- [ ] Documentation is comprehensive
- [ ] .env.example file included (no secrets)
- [ ] Code is clean and commented
- [ ] All features working in video

---

**Good luck with your video walkthrough! 🎬**
