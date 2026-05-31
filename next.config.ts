import type { NextConfig } from 'next'
import { sanity } from 'next-sanity/live/cache-life'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: { default: sanity },
  reactCompiler: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  devIndicators: false,
}

export default nextConfig
