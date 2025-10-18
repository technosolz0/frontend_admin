import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'localhost:3002',
    '127.0.0.1:3002',
    '194.164.148.133:3002',
    'https://api.serwex.in',
    '10.108.231.167:3002', // 👈 remove http://
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '194.164.148.133',
        port: '8003',
        pathname: '/static/uploads/**',
      },
    ],
  },
}

export default nextConfig
