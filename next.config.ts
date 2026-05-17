import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: ['@react-three/drei', '@react-three/fiber'],
  },
}

export default nextConfig
