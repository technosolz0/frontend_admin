import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '194.164.148.133:3000',
    '10.108.231.167:3000', // 👈 remove http://
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
