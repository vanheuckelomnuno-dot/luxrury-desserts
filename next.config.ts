import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'framer-motion',
  ],
}

export default nextConfig
