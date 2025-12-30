// import type { NextConfig } from 'next'

// const nextConfig: NextConfig = {
//   allowedDevOrigins: [
//     'localhost:3002',
//     '127.0.0.1:3002',
//     '194.164.148.133:3002',
//     '10.108.231.167:3002', // 👈 remove http://
//     'https://admin.serwex.in',
//     'https://api.serwex.in',
//   ],
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: '194.164.148.133',
//         port: '8003',
//         pathname: '/static/uploads/**',
//       },
//     ],
//   },
// }

// export default nextConfig
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Security Headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        // API routes security
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'none'; object-src 'none';",
          },
        ],
      },
    ]
  },

  // Image optimization with security
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '194.164.148.133',
        port: '8003',
        pathname: '/static/uploads/**',
      },
    ],
    // Disable image optimization for external URLs to prevent SSRF
    unoptimized: true,
  },

  // Build optimization
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output configuration
  output: 'standalone',

  // Environment variables validation
  env: {
    // Only allow specific environment variables
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

export default nextConfig
