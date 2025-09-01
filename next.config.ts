import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '10.108.231.167:3000', // 👈 remove http://
  ],
}

export default nextConfig
