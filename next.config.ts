import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image Optimization Configuration
  images: {
    // Enable image optimization
    formats: ["image/avif", "image/webp"],
    
    // Image sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Minimum quality for optimized images (1-100)
    minimumCacheTTL: 60,
    
    // Allow remote images if needed (add your domains here)
    remotePatterns: [
      // Example: Uncomment and add your image CDN domains
      // {
      //   protocol: "https",
      //   hostname: "example.com",
      //   pathname: "/images/**",
      // },
    ],
    
    // Disable static image imports warning (if using public folder images)
    unoptimized: false,
    
    // Content Security Policy for images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Static Asset Configuration
  // Assets in public folder are automatically served at root
  // No additional config needed, but we can optimize headers

  // Headers for static assets (caching, CORS, etc.)
  async headers() {
    return [
      {
        // Apply headers to all static assets
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Specific headers for images
        source: "/assets/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Headers for fonts
        source: "/assets/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        // Headers for CSS (if still served from public)
        source: "/assets/css/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Content-Type",
            value: "text/css; charset=utf-8",
          },
        ],
      },
      {
        // Headers for JS
        source: "/assets/js/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
        ],
      },
    ];
  },

  // Compression
  compress: true,

  // Production optimizations
  poweredByHeader: false,
  generateEtags: true,
};

export default nextConfig;
