'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Replace image gradient backgrounds with real images in public/images/
// e.g., src="/images/macaron-rose.jpg"
const desserts = [
  {
    name: 'Rose Macaron Tower',
    category: 'Macarons',
    price: '€48',
    description: 'Delicate rose-infused French macarons, stacked into an art piece.',
    gradient: 'from-blush via-pink-100 to-rose-50',
    accent: '#FFD6E0',
    badge: 'Bestseller',
    emoji: '🌹',
    size: 'large',
  },
  {
    name: 'Grand Cru Chocolate Tart',
    category: 'Tarts',
    price: '€32',
    description: '72% single-origin Madagascan chocolate on a buttery shell.',
    gradient: 'from-amber-900/10 via-amber-50 to-cream',
    accent: '#5A3825',
    badge: 'Chef\'s Pick',
    emoji: '🍫',
    size: 'medium',
  },
  {
    name: 'Mille-Feuille Royale',
    category: 'Pastries',
    price: '€28',
    description: 'One thousand crispy layers, vanilla cream, gold leaf finish.',
    gradient: 'from-yellow-50 via-amber-50 to-cream',
    accent: '#D4AF37',
    badge: 'Classic',
    emoji: '✨',
    size: 'medium',
  },
  {
    name: 'Entremets Champagne',
    category: 'Entremets',
    price: '€95',
    description: 'Champagne mousse, lychee compote, rose petal glaze.',
    gradient: 'from-pink-50 via-blush/30 to-cream',
    accent: '#FFD6E0',
    badge: 'Limited',
    emoji: '🥂',
    size: 'large',
  },
  {
    name: 'Financier aux Pistaches',
    category: 'Petits Fours',
    price: '€18',
    description: 'Brown butter financiers with Sicilian pistachio cream.',
    gradient: 'from-green-50/40 via-lime-50/30 to-cream',
    accent: '#8B9E5A',
    badge: 'Seasonal',
    emoji: '🌿',
    size: 'small',
  },
  {
    name: 'Tarte aux Fruits Exotiques',
    category: 'Tarts',
    price: '€36',
    description: 'Passion fruit curd, mango gelée, tropical flowers.',
    gradient: 'from-orange-50/40 via-yellow-50/40 to-cream',
    accent: '#E8A427',
    badge: 'Summer',
    emoji: '🌺',
    size: 'small',
  },
]

function DessertCard({
  dessert,
  index,
}: {
  dessert: (typeof desserts)[0]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
        delay: index * 0.1,
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`group relative rounded-3xl overflow-hidden shadow-luxury cursor-pointer
        ${dessert.size === 'large' ? 'row-span-2' : ''}
      `}
    >
      {/* Gradient image placeholder */}
      {/* Replace this div with <Image src={...} fill alt={...} className="object-cover" /> */}
      <div
        className={`w-full bg-gradient-to-br ${dessert.gradient}
          ${dessert.size === 'large' ? 'h-[460px]' : 'h-[220px]'}
          transition-transform duration-700 group-hover:scale-105
          flex items-center justify-center text-7xl
        `}
      >
        {dessert.emoji}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Badge */}
      <div
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: dessert.accent + '33', color: dessert.accent, border: `1px solid ${dessert.accent}55` }}
      >
        {dessert.badge}
      </div>

      {/* Content card at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="text-xs text-chocolate/50 tracking-widest uppercase mb-1">{dessert.category}</p>
              <h3 className="font-playfair font-bold text-chocolate text-lg leading-tight">{dessert.name}</h3>
            </div>
            <span className="font-playfair text-xl font-bold text-gold whitespace-nowrap">{dessert.price}</span>
          </div>
          <p className="text-chocolate/60 text-sm leading-relaxed hidden group-hover:block transition-all">
            {dessert.description}
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-3 w-full py-2 rounded-xl bg-chocolate text-cream text-sm font-medium
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Order This Creation
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function FeaturedDesserts() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!titleRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.desserts-label', {
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power3.out',
      })
      gsap.from('.desserts-heading', {
        scrollTrigger: { trigger: titleRef.current, start: 'top 75%' },
        opacity: 0,
        y: 40,
        duration: 1.0,
        ease: 'power3.out',
        delay: 0.1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="desserts"
      className="py-24 md:py-36 bg-cream relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-blush/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-gold/8 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div ref={titleRef} className="text-center mb-16">
          <div className="desserts-label flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
              Our Collection
            </span>
            <div className="w-12 h-px bg-gold" />
          </div>
          <h2 className="desserts-heading font-playfair text-5xl md:text-6xl font-bold text-chocolate leading-tight">
            Featured{' '}
            <span className="text-gradient-gold italic">Créations</span>
          </h2>
          <p className="mt-4 text-chocolate/55 max-w-md mx-auto text-lg">
            Every piece is composed with the precision of a sculptor and the soul of a poet.
          </p>
        </div>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-auto">
          {desserts.map((dessert, i) => (
            <DessertCard key={dessert.name} dessert={dessert} index={i} />
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-14">
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full border border-chocolate/20
                       text-chocolate font-medium hover:bg-chocolate hover:text-cream transition-all duration-300 shadow-glass"
          >
            View Full Menu
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
