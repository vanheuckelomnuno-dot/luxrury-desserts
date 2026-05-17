import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDF8',
        beige: '#F6EEE3',
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8CC6A',
          dark: '#B8931E',
        },
        blush: '#FFD6E0',
        chocolate: '#5A3825',
        ivory: '#FAFAF5',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #FFFDF8 0%, #F6EEE3 50%, #FFD6E0 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #E8CC6A 50%, #D4AF37 100%)',
        'hero-gradient': 'radial-gradient(ellipse at 60% 50%, #FFD6E0 0%, #F6EEE3 40%, #FFFDF8 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(212, 175, 55, 0.15), 0 2px 8px rgba(90, 56, 37, 0.08)',
        'luxury': '0 20px 60px rgba(90, 56, 37, 0.15), 0 4px 16px rgba(212, 175, 55, 0.1)',
        'card-hover': '0 30px 80px rgba(90, 56, 37, 0.2), 0 8px 24px rgba(212, 175, 55, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
