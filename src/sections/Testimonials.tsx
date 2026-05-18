'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    name: 'Fatima B.',
    role: 'Trouwe klant',
    rating: 5,
    text: 'De dadels van Sami Sweets zijn echt van een andere wereld. Zacht, zoet en perfect als cadeau. Ik bestel ze voor elke speciale gelegenheid!',
    avatar: '👩',
    accent: '#FFD6E0',
  },
  {
    name: 'Ahmed K.',
    role: 'Klant via Delhaize',
    rating: 5,
    text: 'Ik kocht ze toevallig bij Delhaize en was meteen verkocht. De chocolade dadels zijn geweldig en ik ben blij dat ze halal zijn. Aanrader!',
    avatar: '👨',
    accent: '#D4AF37',
  },
  {
    name: 'Nadia V.',
    role: 'Instagram volger',
    rating: 5,
    text: 'Zag ze via Instagram en meteen besteld voor een huwelijksfeest. Iedereen was onder de indruk van de kwaliteit en de prachtige verpakking.',
    avatar: '👸',
    accent: '#F6EEE3',
  },
  {
    name: 'Youssef M.',
    role: 'Klant via Jumbo',
    rating: 5,
    text: 'Eindelijk een merk dat ambachtelijke kwaliteit combineert met halal en alcoholvrij. De notenmix is heerlijk — ik koop ze elke week bij Jumbo.',
    avatar: '👨‍💼',
    accent: '#FFD6E0',
  },
  {
    name: 'Sara L.',
    role: 'Vaste besteller',
    rating: 5,
    text: 'De gevulde dadels met pistache zijn mijn absolute favoriet. Perfect voor de Ramadan en als dagelijks tussendoortje. Jullie zijn de beste!',
    avatar: '👩‍💻',
    accent: '#D4AF37',
  },
  {
    name: 'Mohamed A.',
    role: 'Cadeau koper',
    rating: 5,
    text: 'Heb een cadeaupakket besteld voor mijn moeder. De presentatie was prachtig en de kwaliteit onberispelijk. Ze was zo blij. Dank jullie wel!',
    avatar: '🧑',
    accent: '#F6EEE3',
  },
]

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative"
    >
      <div
        className="glass rounded-3xl p-6 h-full shadow-glass transition-shadow duration-300
                   group-hover:shadow-luxury"
        style={{ borderColor: testimonial.accent + '30' }}
      >
        {/* Quote mark */}
        <div
          className="font-playfair text-6xl leading-none mb-4 opacity-40"
          style={{ color: testimonial.accent }}
        >
          "
        </div>

        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + i * 0.06, duration: 0.3 }}
              className="text-gold text-sm"
            >
              ★
            </motion.span>
          ))}
        </div>

        {/* Text */}
        <p className="text-chocolate/70 text-sm leading-relaxed mb-6 italic">
          {testimonial.text}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mt-auto">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: testimonial.accent + '40' }}
          >
            {testimonial.avatar}
          </div>
          <div>
            <p className="font-playfair font-semibold text-chocolate text-sm">{testimonial.name}</p>
            <p className="text-chocolate/50 text-xs">{testimonial.role}</p>
          </div>
        </div>

        {/* Subtle glow on hover */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${testimonial.accent}20 0%, transparent 70%)`,
          }}
        />
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!titleRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.testimonials-label', {
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
      })
      gsap.from('.testimonials-heading', {
        scrollTrigger: { trigger: titleRef.current, start: 'top 77%' },
        opacity: 0, y: 40, duration: 1.0, ease: 'power3.out', delay: 0.1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-36 bg-beige relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 rounded-full bg-gold/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-blush/20 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <div className="testimonials-label flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
              Voices of Admiration
            </span>
            <div className="w-12 h-px bg-gold" />
          </div>
          <h2 className="testimonials-heading font-playfair text-5xl md:text-6xl font-bold text-chocolate leading-tight">
            Wat klanten{' '}
            <span className="text-gradient-gold italic">zeggen</span>
          </h2>
          <p className="mt-4 text-chocolate/55 max-w-md mx-auto text-lg">
            Echte ervaringen van mensen die genieten van onze ambachtelijke producten.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { label: '100% Halal gecertificeerd', icon: '✅' },
            { label: 'Alcoholvrij', icon: '🚫' },
            { label: 'Verkrijgbaar bij Delhaize', icon: '🛒' },
            { label: 'Verkrijgbaar bij Jumbo', icon: '🏪' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="glass px-5 py-3 rounded-full flex items-center gap-2 text-sm text-chocolate/70 font-medium"
            >
              <span>{badge.icon}</span>
              {badge.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
