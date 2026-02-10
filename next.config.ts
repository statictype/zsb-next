import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  images: {
    deviceSizes: [600, 960, 1200, 1600, 1700, 1920],
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
}

export default nextConfig
