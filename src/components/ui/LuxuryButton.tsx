'use client'

import { motion } from 'framer-motion'

interface LuxuryButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  className?: string
}

export default function LuxuryButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
}: LuxuryButtonProps) {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-sm',
    lg: 'px-10 py-4.5 text-base',
  }

  const variantClasses = {
    primary: 'bg-chocolate text-cream hover:bg-gold border border-transparent',
    outline: 'bg-transparent text-chocolate border border-chocolate hover:bg-chocolate hover:text-cream',
    ghost: 'bg-cream/50 text-chocolate border border-gold/30 hover:bg-gold hover:text-cream hover:border-gold',
  }

  const baseClasses = `
    relative inline-flex items-center gap-2 rounded-full font-medium
    transition-all duration-300 cursor-pointer
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `

  const content = (
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={baseClasses}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={baseClasses}
    >
      {content}
    </motion.button>
  )
}
