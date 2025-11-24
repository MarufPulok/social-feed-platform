# Deployment Checklist & Guide

This document provides a comprehensive checklist and guide for deploying the social feed platform to production.

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] All linting errors resolved
- [ ] Code is well-commented
- [ ] Unused code removed
- [ ] Environment variables documented

### Security
- [ ] All secrets moved to environment variables
- [ ] No hardcoded credentials in code
- [ ] `.env.local` added to `.gitignore`
- [ ] Strong JWT secrets generated (32+ characters)
- [ ] CORS configured for production domain
- [ ] Rate limiting implemented (recommended)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (N/A for MongoDB, but check queries)
- [ ] XSS protection verified
- [ ] CSRF protection enabled (SameSite cookies)

### Database
- [ ] MongoDB Atlas account created
- [ ] Production database created
- [ ] Database user created with strong password
- [ ] IP whitelist configured (or 0.0.0.0/0 for cloud deployments)
- [ ] Indexes created on all collections
- [ ] Backup strategy configured
- [ ] Connection string tested

### External Services
- [ ] Cloudinary production folder configured
- [ ] Google OAuth production credentials created
- [ ] Production redirect URIs added to Google Console
- [ ] All API keys rotated for production

### Performance
- [ ] Images optimized
- [ ] Database queries optimized
- [ ] Indexes verified
- [ ] Caching strategy implemented
- [ ] Bundle size checked (`npm run build`)
- [ ] Lighthouse score checked (aim for 90+)

### Documentation
- [ ] README.md complete
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Deployment guide written
- [ ] Architecture documented

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Pros:**
- Optimized for Next.js
- Automatic deployments from Git
- Free SSL certificate
- Edge functions support
- Excellent performance
- Free tier available

**Cons:**
- Serverless architecture (cold starts)
- Function timeout limits (10s on free tier)

#### Steps:

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub/GitLab/Bitbucket

3. **Import Project**
   - Click "Add New Project"
   - Import your Git repository
   - Vercel auto-detects Next.js

4. **Configure Environment Variables**
   
   In Vercel dashboard, add these environment variables:
   
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-feed
   
   # JWT Secrets
   JWT_SECRET=your-production-jwt-secret-min-32-chars
   JWT_REFRESH_SECRET=your-production-refresh-secret-min-32-chars
   
   # Environment
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-production-client-secret
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your deployment URL

6. **Configure Custom Domain (Optional)**
   - Go to project settings → Domains
   - Add your custom domain
   - Update DNS records as instructed
   - SSL certificate auto-generated

7. **Update Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Add production redirect URI:
     ```
     https://your-domain.vercel.app/api/auth/google/callback
     ```

8. **Test Deployment**
   - Visit your production URL
   - Test all features
   - Check browser console for errors
   - Test on mobile devices

### Option 2: Railway

**Pros:**
- Full-stack deployment
- Built-in MongoDB option
- Simple configuration
- Free tier available
- No cold starts

**Cons:**
- Less optimized for Next.js than Vercel
- Smaller free tier

#### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Add MongoDB**
   - Click "New" → "Database" → "MongoDB"
   - Railway provisions a MongoDB instance
   - Copy connection string

4. **Configure Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add all environment variables (same as Vercel)
   - Use Railway's MongoDB connection string

5. **Deploy**
   - Railway auto-deploys on push
   - Monitor build logs
   - Visit generated URL

6. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add custom domain
   - Update DNS records

### Option 3: AWS (Advanced)

**Pros:**
- Full control
- Highly scalable
- Enterprise-grade
- Many services available

**Cons:**
- Complex setup
- Higher cost
- Requires DevOps knowledge

#### Architecture:
```
Route 53 (DNS)
    ↓
CloudFront (CDN)
    ↓
Application Load Balancer
    ↓
EC2 Instances (Auto Scaling)
    ↓
DocumentDB (MongoDB-compatible)
```

#### Steps:

1. **Set Up EC2 Instance**
   - Launch Ubuntu 22.04 LTS instance
   - Configure security groups (ports 80, 443, 22)
   - Install Node.js 18+
   - Install PM2 for process management

2. **Set Up DocumentDB**
   - Create DocumentDB cluster
   - Configure security groups
   - Get connection string

3. **Deploy Application**
   ```bash
   # On EC2 instance
   git clone <your-repo>
   cd social-feed-platform
   npm install
   npm run build
   
   # Create .env.local with production variables
   
   # Start with PM2
   pm2 start npm --name "social-feed" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Set Up SSL**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

6. **Configure Auto-Scaling**
   - Create AMI from EC2 instance
   - Set up Auto Scaling Group
   - Configure Load Balancer

## 🔧 Post-Deployment Configuration

### 1. Google OAuth Production Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Add Authorized redirect URIs:
   ```
   https://your-production-domain.com/api/auth/google/callback
   ```
6. Save changes

### 2. Cloudinary Production Setup

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Create production folder structure:
   ```
   social-feed-production/
   ├── posts/
   ├── profiles/
   └── comments/
   ```
3. Update upload preset (if using)
4. Configure transformations

### 3. MongoDB Atlas Production Setup

1. **Create Production Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create new cluster (M0 free tier or higher)
   - Choose region closest to your users

2. **Configure Network Access**
   - Add IP whitelist:
     - For Vercel: `0.0.0.0/0` (Vercel uses dynamic IPs)
     - For Railway: `0.0.0.0/0`
     - For AWS: Your EC2 security group

3. **Create Database User**
   - Username: `social-feed-prod`
   - Password: Strong random password (use password generator)
   - Permissions: Read and write to any database

4. **Get Connection String**
   ```
   mongodb+srv://social-feed-prod:<password>@cluster.mongodb.net/social-feed?retryWrites=true&w=majority
   ```

5. **Create Indexes**
   
   Connect to your database and run:
   ```javascript
   // Users collection
   db.users.createIndex({ email: 1 }, { unique: true });
   db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true });
   db.users.createIndex({ "friendRequests.received": 1 });
   db.users.createIndex({ deletedAt: 1 });
   
   // Posts collection
   db.posts.createIndex({ author: 1, createdAt: -1 });
   db.posts.createIndex({ privacy: 1, createdAt: -1 });
   db.posts.createIndex({ isDeleted: 1, createdAt: -1 });
   
   // Comments collection
   db.comments.createIndex({ postId: 1, createdAt: -1 });
   db.comments.createIndex({ parentId: 1, createdAt: -1 });
   db.comments.createIndex({ author: 1, createdAt: -1 });
   db.comments.createIndex({ isDeleted: 1 });
   ```

6. **Enable Backups**
   - Go to cluster → Backup
   - Enable continuous backups
   - Configure retention policy

## 🔒 Security Hardening

### 1. Environment Variables

**Generate Strong Secrets:**
```bash
# Generate JWT secrets (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Rate Limiting (Recommended)

Install rate limiting package:
```bash
npm install express-rate-limit
```

Create `src/lib/rate-limit.ts`:
```typescript
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
});
```

### 3. Security Headers

Add to `next.config.ts`:
```typescript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 4. CORS Configuration

Update `middleware.ts` for production:
```typescript
const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL,
  'https://your-production-domain.com'
];

// Add CORS headers
response.headers.set('Access-Control-Allow-Origin', allowedOrigins[0]);
response.headers.set('Access-Control-Allow-Credentials', 'true');
```

## 📊 Monitoring & Analytics

### 1. Error Tracking (Sentry)

1. **Install Sentry**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Initialize**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Configure**
   - Add `SENTRY_DSN` to environment variables
   - Sentry auto-captures errors

### 2. Analytics (Vercel Analytics)

1. **Install**
   ```bash
   npm install @vercel/analytics
   ```

2. **Add to Layout**
   ```typescript
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

### 3. Performance Monitoring

**Google Lighthouse:**
```bash
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## 🧪 Testing Production

### 1. Smoke Tests

- [ ] Homepage loads
- [ ] Registration works
- [ ] Login works
- [ ] Google OAuth works
- [ ] Create post works
- [ ] Upload image works
- [ ] Reactions work
- [ ] Comments work
- [ ] Follow/unfollow works
- [ ] Logout works

### 2. Performance Tests

- [ ] Page load time < 3s
- [ ] Time to Interactive < 5s
- [ ] Images load quickly
- [ ] No layout shifts
- [ ] Smooth animations

### 3. Security Tests

- [ ] HTTPS enabled
- [ ] Security headers present
- [ ] No sensitive data in responses
- [ ] Authentication required for protected routes
- [ ] CORS configured correctly
- [ ] Rate limiting works (if implemented)

### 4. Mobile Tests

- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Images load on mobile
- [ ] Forms work on mobile
- [ ] Navigation works on mobile

## 📈 Scaling Considerations

### When to Scale

**Indicators:**
- Response time > 1s
- Database CPU > 70%
- Memory usage > 80%
- Error rate > 1%
- Concurrent users > 1000

### Scaling Strategies

1. **Vertical Scaling** (Easier)
   - Upgrade database tier (MongoDB Atlas)
   - Upgrade server instance (EC2)
   - Increase memory/CPU

2. **Horizontal Scaling** (Better)
   - Add more app instances
   - Use load balancer
   - Database read replicas
   - Redis caching layer

3. **Database Optimization**
   - Add indexes
   - Optimize queries
   - Use aggregation pipelines
   - Enable sharding

4. **Caching**
   - Redis for sessions
   - CDN for static assets
   - React Query client-side
   - API response caching

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 📝 Post-Deployment Checklist

- [ ] Application is live and accessible
- [ ] All features tested in production
- [ ] SSL certificate is active (HTTPS)
- [ ] Google OAuth works in production
- [ ] Image uploads work
- [ ] Database connection stable
- [ ] Error monitoring configured
- [ ] Analytics tracking active
- [ ] Performance metrics acceptable
- [ ] Mobile experience verified
- [ ] Custom domain configured (if applicable)
- [ ] DNS records propagated
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured
- [ ] Documentation updated with live URL
- [ ] Team notified of deployment

## 🆘 Troubleshooting

### Common Issues

**1. Build Fails**
- Check TypeScript errors: `npm run build`
- Check environment variables are set
- Check dependencies are installed

**2. Database Connection Fails**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Test connection string locally

**3. Google OAuth Not Working**
- Verify redirect URI in Google Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Ensure production URL is correct

**4. Images Not Uploading**
- Verify Cloudinary credentials
- Check file size limits
- Check CORS configuration

**5. Slow Performance**
- Check database indexes
- Enable caching
- Optimize images
- Check server resources

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

**Deployment completed! 🎉**

Remember to monitor your application regularly and keep dependencies updated.
