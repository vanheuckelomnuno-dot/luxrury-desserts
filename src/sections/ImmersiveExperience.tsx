'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ImmersiveScene = dynamic(() => import('@/components/three/ImmersiveScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-beige to-blush/30 animate-pulse" />
  ),
})

export default function ImmersiveExperience() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isInView, setIsInView] = useState(false)
  const rafRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isInView || rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        setMousePos({ x, y })
      }
      rafRef.current = null
    })
  }, [isInView])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    if (!contentRef.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      // Fade in the text overlay as user enters
      gsap.from('.immersive-text > *', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          onEnter: () => setIsInView(true),
          onLeave: () => setIsInView(false),
          onEnterBack: () => setIsInView(true),
          onLeaveBack: () => setIsInView(false),
        },
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 1.0,
        ease: 'power3.out',
      })

      // Parallax on the canvas as you scroll through
      gsap.to('.immersive-canvas-wrap', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
        y: -60,
        ease: 'none',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="immersive"
      className="relative min-h-[100vh] overflow-hidden bg-gradient-to-b from-cream via-beige to-cream"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[700px] h-[700px] rounded-full bg-blush/25 blur-[160px]" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gold/12 blur-[100px]" />
      </div>

      {/* Three.js canvas */}
      <div className="immersive-canvas-wrap absolute inset-0 z-0">
        <ImmersiveScene mousePosition={mousePos} paused={!isInView} />
      </div>

      {/* Content overlay */}
      <div
        ref={contentRef}
        className="relative z-10 min-h-[100vh] flex flex-col items-center justify-center text-center px-6"
      >
        <div className="immersive-text space-y-6 max-w-3xl">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
              Sensory Journey
            </span>
            <div className="w-12 h-px bg-gold" />
          </div>

          <h2 className="font-playfair text-5xl md:text-7xl font-bold leading-tight text-chocolate">
            Enter the{' '}
            <span className="text-gradient-gold italic">World</span>
            <br />
            of Sweetness
          </h2>

          <p className="text-chocolate/60 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
            An immersive universe where every floating confection is an invitation to delight.
            Move your cursor to explore.
          </p>

          <div className="flex items-center justify-center gap-6 pt-4">
            <motion.a
              href="#desserts"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-full bg-chocolate/90 text-cream font-medium
                         backdrop-blur-sm shadow-luxury hover:bg-chocolate transition-all duration-300"
            >
              Discover Collection
            </motion.a>
            <motion.a
              href="#chef"
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 rounded-full glass border border-gold/20
                         text-chocolate font-medium hover:border-gold/50 transition-all duration-300"
            >
              Meet the Chef
            </motion.a>
          </div>
        </div>

        {/* Floating hint cards at edges */}
        <motion.div
          className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block"
          animate={{ x: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="glass rounded-2xl p-4 max-w-[160px] text-center shadow-glass">
            <div className="text-2xl mb-2">🍩</div>
            <p className="font-playfair text-sm font-semibold text-chocolate">12 Donuts</p>
            <p className="text-chocolate/50 text-xs">floating in space</p>
          </div>
        </motion.div>

        <motion.div
          className="absolute right-8 top-1/3 hidden xl:block"
          animate={{ x: [4, -4, 4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <div className="glass rounded-2xl p-4 max-w-[160px] text-center shadow-glass">
            <div className="text-2xl mb-2">✨</div>
            <p className="font-playfair text-sm font-semibold text-chocolate">1200+</p>
            <p className="text-chocolate/50 text-xs">gold particles</p>
          </div>
        </motion.div>
      </div>

      {/* Section separator */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent pointer-events-none z-20" />
    </section>
  )
}
