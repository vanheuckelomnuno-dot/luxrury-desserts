'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stores = [
  {
    name: 'Delhaize',
    emoji: '🛒',
    description: 'Vind Sami Sweets in het dessert- en speciaalzaakrek bij jouw Delhaize.',
    accent: '#D4AF37',
  },
  {
    name: 'Jumbo',
    emoji: '🏪',
    description: 'Ook beschikbaar in de geselecteerde Jumbo filialen bij jou in de buurt.',
    accent: '#FFD6E0',
  },
]

export default function ImmersiveExperience() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.immersive-text > *', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 1.0,
        ease: 'power3.out',
      })
      gsap.from('.store-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="immersive"
      className="relative py-28 md:py-40 overflow-hidden bg-gradient-to-b from-cream via-beige to-cream"
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[700px] h-[700px] rounded-full bg-blush/25 blur-[160px]" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gold/12 blur-[100px]" />
      </div>

      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="immersive-text space-y-6">
          {/* Label */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
              Verkrijgbaar in de winkel
            </span>
            <div className="w-12 h-px bg-gold" />
          </div>

          {/* Heading */}
          <h2 className="font-playfair text-5xl md:text-6xl font-bold leading-tight text-chocolate">
            Nu ook bij{' '}
            <span className="text-gradient-gold italic">Delhaize</span>
            <br />
            & Jumbo
          </h2>

          <p className="text-chocolate/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Onze ambachtelijke desserts, premium dadels en handgeselecteerde noten zijn nu
            verkrijgbaar bij Delhaize en Jumbo. Halal, alcoholvrij en vol smaak —
            gewoon bij jou om de hoek.
          </p>
        </div>

        {/* Store cards */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {stores.map((store, i) => (
            <motion.div
              key={store.name}
              className="store-card glass rounded-3xl p-8 shadow-glass text-left"
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-5xl mb-4">{store.emoji}</div>
              <h3 className="font-playfair text-2xl font-bold text-chocolate mb-2">{store.name}</h3>
              <p className="text-chocolate/60 text-sm leading-relaxed">{store.description}</p>
              <div
                className="mt-4 inline-block px-4 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: store.accent + '22', color: store.accent, border: `1px solid ${store.accent}44` }}
              >
                Beschikbaar
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badge row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {[
            { icon: '✅', label: '100% Halal gecertificeerd' },
            { icon: '🚫', label: 'Alcoholvrij' },
            { icon: '🤝', label: 'Ambachtelijk bereid' },
            { icon: '📦', label: 'Ook op bestelling' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="glass px-5 py-2.5 rounded-full flex items-center gap-2 text-sm text-chocolate/70 font-medium"
            >
              <span>{badge.icon}</span>
              {badge.label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <motion.a
            href="#desserts"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-full bg-chocolate/90 text-cream font-medium
                       shadow-luxury hover:bg-chocolate transition-all duration-300"
          >
            Bekijk de collectie
          </motion.a>
          <motion.a
            href="https://www.instagram.com/sami.sweets.desserten"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="px-8 py-4 rounded-full glass border border-gold/20
                       text-chocolate font-medium hover:border-gold/50 transition-all duration-300"
          >
            📸 @sami.sweets.desserten
          </motion.a>
        </div>
      </div>

      {/* Section separator */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent pointer-events-none z-20" />
    </section>
  )
}
