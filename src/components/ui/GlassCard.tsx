'use client'

import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  delay?: number
}

export default function GlassCard({ children, className = '', hover = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={`
        glass rounded-2xl shadow-glass
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
