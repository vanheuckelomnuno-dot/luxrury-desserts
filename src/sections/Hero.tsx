'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import GlassCard from '@/components/ui/GlassCard'
import LuxuryButton from '@/components/ui/LuxuryButton'

const floatingStats = [
  { value: '100%', label: 'Halal & Alcoholvrij', icon: '✦' },
  { value: '3', label: 'Desserts · Dadels · Noten', icon: '◈' },
  { value: '514+', label: 'Instagram volgers', icon: '❋' },
]

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  // GSAP entrance animation
  useEffect(() => {
    if (!headingRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })

      tl.from('.hero-label', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
      })
        .from('.hero-heading', {
          opacity: 0,
          y: 50,
          duration: 1.0,
          ease: 'power3.out',
        }, '-=0.5')
        .from('.hero-subtitle', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.6')
        .from('.hero-cta', {
          opacity: 0,
          y: 20,
          scale: 0.95,
          duration: 0.7,
          ease: 'back.out(1.4)',
        }, '-=0.5')
        .from('.hero-stats', {
          opacity: 0,
          y: 30,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
        }, '-=0.4')
        .from('.hero-badge', {
          opacity: 0,
          x: 20,
          duration: 0.7,
          ease: 'power3.out',
        }, '-=0.6')
    }, headingRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-hero-gradient"
      id="hero"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blush/30 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gold/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-beige/40 blur-[150px]" />
      </div>

      {/* Content overlay */}
      <div ref={headingRef} className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — Text content */}
            <div className="space-y-8">
              {/* Label */}
              <div className="hero-label flex items-center gap-3">
                <div className="w-8 h-px bg-gold" />
                <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
                  Sami Sweets · Ambachtelijk · Halal
                </span>
                <div className="w-8 h-px bg-gold" />
              </div>

              {/* Heading */}
              <div className="hero-heading space-y-1">
                <h1 className="font-playfair font-bold leading-[0.95] text-chocolate">
                  <span className="block text-6xl md:text-7xl xl:text-8xl">Puur</span>
                  <span className="block text-6xl md:text-7xl xl:text-8xl text-gradient-gold">Ambacht</span>
                  <span className="block text-6xl md:text-7xl xl:text-8xl">Puur</span>
                  <span className="block text-5xl md:text-6xl xl:text-7xl font-light italic text-chocolate/70">
                    Smaak
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="hero-subtitle max-w-md text-chocolate/60 text-lg leading-relaxed">
                Ambachtelijke desserts, premium dadels & handgeselecteerde noten.
                100% Halal, alcoholvrij — te vinden bij Delhaize & Jumbo.
              </p>

              {/* CTA */}
              <div className="hero-cta flex items-center gap-4 flex-wrap">
                <LuxuryButton
                  href="#desserts"
                  size="lg"
                  variant="primary"
                >
                  Ontdek de collectie
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </LuxuryButton>
                <LuxuryButton href="#contact" size="lg" variant="ghost">
                  Bestel nu
                </LuxuryButton>
              </div>

              {/* Stats */}
              <div className="hero-stats flex gap-6 pt-4">
                {floatingStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-gold text-lg mb-0.5">{stat.icon}</div>
                    <div className="font-playfair text-2xl font-bold text-chocolate">{stat.value}</div>
                    <div className="text-xs text-chocolate/50 tracking-wide">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — floating info cards */}
            <div className="hidden lg:flex flex-col gap-4 items-end">
              {/* Seasonal badge */}
              <motion.div
                className="hero-badge"
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <GlassCard className="px-5 py-4 max-w-xs" hover={false}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-lg">
                      🥇
                    </div>
                    <div>
                      <p className="font-playfair font-semibold text-chocolate text-sm">100% Halal</p>
                      <p className="text-chocolate/60 text-xs">Alcoholvrij & ambachtelijk gemaakt</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <GlassCard className="px-5 py-4 max-w-xs" hover={false}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blush/40 flex items-center justify-center text-lg">
                      ⭐
                    </div>
                    <div>
                      <div className="flex gap-0.5 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-gold text-xs">★</span>
                        ))}
                      </div>
                      <p className="text-chocolate/60 text-xs">Beschikbaar bij Delhaize & Jumbo</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                animate={{ y: [-3, 5, -3] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <GlassCard className="px-5 py-4 max-w-xs" hover={false}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <span className="text-gold text-base font-bold">✦</span>
                    </div>
                    <div>
                      <p className="font-playfair font-semibold text-chocolate text-sm">Op Maat Bestellen</p>
                      <p className="text-chocolate/60 text-xs">Cadeaupakketten voor elk moment</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs tracking-[0.2em] text-chocolate/40 uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent z-10 pointer-events-none" />
    </section>
  )
}
