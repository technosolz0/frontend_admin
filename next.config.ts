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
  // Optional: if you use CORS manually, define your allowed origins separately in your code
}

export default nextConfig
