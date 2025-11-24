# Image Optimization & Static Assets Configuration

This document explains how image optimization and static asset serving are configured in this Next.js project.

## Image Optimization

Next.js automatically optimizes images using the built-in `next/image` component. The configuration in `next.config.ts` includes:

### Features

- **Automatic Format Conversion**: Images are served in modern formats (AVIF, WebP) when supported by the browser
- **Responsive Images**: Multiple sizes generated for different device breakpoints
- **Lazy Loading**: Images load only when they enter the viewport
- **Blur Placeholder**: Optional blur-up effect while images load

### Device Sizes

Pre-configured breakpoints for responsive images:
- Mobile: 640px, 750px, 828px
- Tablet: 1080px, 1200px
- Desktop: 1920px, 2048px
- Large: 3840px

### Image Sizes

Thumbnail and icon sizes:
- 16px, 32px, 48px, 64px, 96px, 128px, 256px, 384px

## Using Next.js Image Component

### For Images in `/public/assets/images/`

```tsx
import Image from "next/image";

// Optimized image from public folder
<Image
  src="/assets/images/profile.png"
  alt="Profile picture"
  width={200}
  height={200}
  priority // Load immediately (for above-the-fold images)
/>
```

### For External Images

1. Add the domain to `remotePatterns` in `next.config.ts`:

```typescript
remotePatterns: [
  {
    protocol: "https",
    hostname: "example.com",
    pathname: "/images/**",
  },
],
```

2. Use in component:

```tsx
<Image
  src="https://example.com/images/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
/>
```

### Image Optimization Options

```tsx
<Image
  src="/assets/images/avatar.png"
  alt="Avatar"
  width={100}
  height={100}
  // Optimization options
  quality={90} // 1-100, default 75
  priority={true} // Load immediately
  placeholder="blur" // Show blur while loading
  blurDataURL="data:image/..." // Base64 blur placeholder
  sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizing
  loading="lazy" // Default, loads when in viewport
/>
```

## Static Assets

### Asset Locations

- **Images**: `/public/assets/images/` → served at `/assets/images/`
- **Fonts**: `/public/assets/fonts/` → served at `/assets/fonts/`
- **CSS**: `/src/styles/` → imported in `globals.css` (not served as static)
- **JS**: `/public/assets/js/` → served at `/assets/js/`

### Caching Strategy

All static assets are configured with aggressive caching:

- **Cache-Control**: `public, max-age=31536000, immutable`
- **Duration**: 1 year (31536000 seconds)
- **Immutable**: Assets won't change, safe to cache forever

### Using Static Assets

#### Images (without optimization)

```tsx
// Regular img tag for non-optimized images
<img src="/assets/images/logo.svg" alt="Logo" />

// Or in CSS
background-image: url('/assets/images/background.png');
```

#### Fonts

```css
@font-face {
  font-family: "CustomFont";
  src: url("/assets/fonts/custom-font.woff2") format("woff2");
}
```

#### JavaScript

```tsx
import Script from "next/script";

<Script
  src="/assets/js/custom.js"
  strategy="afterInteractive"
/>
```

## Performance Best Practices

### 1. Use Next.js Image Component

**✅ Good:**
```tsx
import Image from "next/image";
<Image src="/assets/images/photo.jpg" width={800} height={600} alt="Photo" />
```

**❌ Avoid:**
```tsx
<img src="/assets/images/photo.jpg" alt="Photo" />
```

### 2. Specify Image Dimensions

Always provide `width` and `height` to prevent layout shift:

```tsx
<Image
  src="/assets/images/avatar.png"
  width={100}
  height={100}
  alt="Avatar"
/>
```

### 3. Use Priority for Above-the-Fold Images

```tsx
<Image
  src="/assets/images/hero.jpg"
  width={1920}
  height={1080}
  priority // Loads immediately
  alt="Hero image"
/>
```

### 4. Optimize Image Sizes

- Use appropriate image dimensions (don't use 2000px images for 200px displays)
- Compress images before uploading
- Use WebP/AVIF formats when possible

### 5. Lazy Load Below-the-Fold Images

```tsx
<Image
  src="/assets/images/content.jpg"
  width={800}
  height={600}
  loading="lazy" // Default, but explicit is good
  alt="Content image"
/>
```

## Configuration Reference

### Image Configuration (`next.config.ts`)

```typescript
images: {
  formats: ["image/avif", "image/webp"],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
  unoptimized: false,
}
```

### Static Asset Headers

All assets in `/public/assets/` automatically get:
- Long-term caching (1 year)
- Proper content types
- CORS headers for fonts

## Troubleshooting

### Images Not Loading

1. **Check path**: Ensure path starts with `/` for public folder
2. **Check file exists**: Verify file is in `/public/assets/images/`
3. **Check Next.js Image**: External images need `remotePatterns` config

### Images Not Optimized

1. **Use `next/image`**: Regular `<img>` tags aren't optimized
2. **Check format**: Ensure image format is supported (JPEG, PNG, WebP, AVIF, SVG)
3. **Check build**: Run `pnpm build` to see optimization in action

### Cache Issues

1. **Hard refresh**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. **Clear Next.js cache**: Delete `.next` folder and rebuild
3. **Check headers**: Verify Cache-Control headers in browser DevTools

## Migration from Regular Images

### Before (Regular img tag)
```tsx
<img src="/assets/images/avatar.png" alt="Avatar" />
```

### After (Optimized)
```tsx
import Image from "next/image";

<Image
  src="/assets/images/avatar.png"
  alt="Avatar"
  width={100}
  height={100}
/>
```

## File Size Limits

- **Default**: No explicit limit (handled by Next.js)
- **Recommended**: Keep images under 5MB for optimal performance
- **Large images**: Consider using external CDN or image optimization service

## SVG Images

SVGs are supported but have some considerations:

```tsx
// SVG as image (optimized)
<Image
  src="/assets/images/logo.svg"
  alt="Logo"
  width={200}
  height={50}
/>

// SVG inline (not optimized, but more control)
<svg width="200" height="50">
  {/* SVG content */}
</svg>
```

## Additional Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Static File Serving](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)
- [Web Vitals](https://web.dev/vitals/) - Monitor image performance

