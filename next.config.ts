import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['framer-motion'],
  serverExternalPackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'react-reconciler',
  ],
}

export default nextConfig
