'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Replace gradients with actual dessert photos in public/images/
// e.g., src="/images/gallery/macaron-tower.jpg"
const galleryItems = [
  { label: 'Rose Macaron Tower', category: 'Macarons', gradient: 'from-rose-100 via-pink-50 to-cream', emoji: '🌹', size: 'tall' },
  { label: 'Gold Leaf Éclair', category: 'Éclairs', gradient: 'from-amber-50 via-yellow-50 to-cream', emoji: '✨', size: 'normal' },
  { label: 'Mango Passion Tart', category: 'Tarts', gradient: 'from-orange-50 via-amber-50 to-cream', emoji: '🌺', size: 'normal' },
  { label: 'Champagne Mousse', category: 'Entremets', gradient: 'from-pink-50 via-blush/40 to-cream', emoji: '🥂', size: 'wide' },
  { label: 'Chocolate Sculpture', category: 'Showpiece', gradient: 'from-amber-900/10 via-amber-50 to-cream', emoji: '🍫', size: 'normal' },
  { label: 'Vanilla Opera Cake', category: 'Cakes', gradient: 'from-yellow-50 via-amber-50/40 to-cream', emoji: '🎂', size: 'tall' },
  { label: 'Raspberry Financiers', category: 'Petits Fours', gradient: 'from-red-50/50 via-pink-50 to-cream', emoji: '🍓', size: 'normal' },
  { label: 'Pistachio Entremet', category: 'Entremets', gradient: 'from-green-50/50 via-lime-50/30 to-cream', emoji: '🌿', size: 'normal' },
  { label: 'Caramel Tarte Tatin', category: 'Tarts', gradient: 'from-orange-100/50 via-amber-50 to-cream', emoji: '🍮', size: 'wide' },
]

function GalleryItem({ item, index }: { item: (typeof galleryItems)[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!glowRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    glowRef.current.style.left = `${x}px`
    glowRef.current.style.top = `${y}px`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={`
        group relative rounded-2xl overflow-hidden cursor-pointer shadow-luxury
        ${item.size === 'tall' ? 'row-span-2' : ''}
        ${item.size === 'wide' ? 'col-span-2 md:col-span-1' : ''}
      `}
    >
      {/* Image placeholder */}
      {/* Replace with <Image src={...} fill alt={...} className="object-cover transition-transform duration-700 group-hover:scale-110" /> */}
      <div
        className={`w-full bg-gradient-to-br ${item.gradient} flex items-center justify-center
          transition-transform duration-700 group-hover:scale-105
          ${item.size === 'tall' ? 'h-[420px]' : item.size === 'wide' ? 'h-[240px]' : 'h-[200px]'}
        `}
      >
        <motion.span
          className="text-6xl"
          animate={hovered ? { scale: 1.3, rotate: 10 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          {item.emoji}
        </motion.span>
      </div>

      {/* Mouse-follow glow */}
      <div
        ref={glowRef}
        className={`absolute w-32 h-32 rounded-full bg-gold/20 blur-xl pointer-events-none -translate-x-1/2 -translate-y-1/2
                    transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-chocolate/75 to-transparent"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Label */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4"
        animate={{ y: hovered ? 0 : 12, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      >
        <p className="text-xs text-gold uppercase tracking-widest mb-1">{item.category}</p>
        <p className="font-playfair font-bold text-cream text-lg">{item.label}</p>
      </motion.div>

      {/* Animated border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-gold/40 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!titleRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.gallery-label', {
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
      })
      gsap.from('.gallery-heading', {
        scrollTrigger: { trigger: titleRef.current, start: 'top 77%' },
        opacity: 0, y: 40, duration: 1.0, ease: 'power3.out', delay: 0.1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-24 md:py-36 bg-cream relative overflow-hidden"
    >
      {/* BG blobs */}
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-gold/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-72 h-72 rounded-full bg-blush/20 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-14">
          <div className="gallery-label flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
              The Gallery
            </span>
            <div className="w-12 h-px bg-gold" />
          </div>
          <h2 className="gallery-heading font-playfair text-5xl md:text-6xl font-bold text-chocolate leading-tight">
            Signature{' '}
            <span className="text-gradient-gold italic">Gallery</span>
          </h2>
          <p className="mt-4 text-chocolate/55 max-w-md mx-auto text-lg">
            A visual feast of artisan masterpieces, each frame a story of dedication.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-auto">
          {galleryItems.map((item, i) => (
            <GalleryItem key={item.label} item={item} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04 }}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full
                       bg-gradient-to-r from-chocolate to-chocolate/80
                       text-cream font-medium shadow-luxury hover:from-gold hover:to-gold/80
                       transition-all duration-500"
          >
            Commission a Creation
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
