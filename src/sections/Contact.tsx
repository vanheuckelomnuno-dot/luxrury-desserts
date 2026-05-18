'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const particles = [
  { left: '15%', top: '12%', duration: 3.5, delay: 0 },
  { left: '35%', top: '45%', duration: 4.2, delay: 0.8 },
  { left: '55%', top: '25%', duration: 5.1, delay: 1.5 },
  { left: '75%', top: '60%', duration: 3.8, delay: 2.2 },
  { left: '20%', top: '75%', duration: 4.7, delay: 0.5 },
  { left: '45%', top: '15%', duration: 5.5, delay: 1.2 },
  { left: '65%', top: '80%', duration: 3.2, delay: 2.8 },
  { left: '85%', top: '35%', duration: 4.9, delay: 0.3 },
  { left: '10%', top: '55%', duration: 5.8, delay: 1.8 },
  { left: '50%', top: '90%', duration: 3.6, delay: 2.5 },
  { left: '80%', top: '70%', duration: 4.3, delay: 0.7 },
  { left: '30%', top: '30%', duration: 5.0, delay: 1.9 },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.contact-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
      })
      gsap.from('.contact-heading', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        opacity: 0, y: 40, duration: 1.0, ease: 'power3.out', delay: 0.1,
      })
      gsap.from('.contact-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        opacity: 0, y: 30, stagger: 0.12, duration: 0.8, ease: 'power3.out', delay: 0.2,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 md:py-36 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FFFDF8 0%, #F6EEE3 40%, #FFD6E0 100%)' }}
    >
      {/* Background particles / glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-blush/30 blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gold/15 blur-[100px]" />
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold/40"
            style={{ left: p.left, top: p.top }}
            animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="contact-label flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
              Neem contact op
            </span>
            <div className="w-12 h-px bg-gold" />
          </div>
          <h2 className="contact-heading font-playfair text-5xl md:text-6xl font-bold text-chocolate leading-tight">
            Interesse in{' '}
            <span className="text-gradient-gold italic">een bestelling?</span>
          </h2>
        </div>

        {/* Notice banner */}
        <motion.div
          className="contact-card mb-10 glass rounded-3xl p-6 shadow-glass text-center border border-gold/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-3xl mb-3">🚫</div>
          <p className="font-playfair text-xl font-bold text-chocolate mb-1">
            Momenteel geen online bestellingen
          </p>
          <p className="text-chocolate/60 text-sm leading-relaxed">
            Wil je bestellen? Neem dan rechtstreeks contact met ons op
            via Instagram of telefoon. We helpen je graag verder!
          </p>
        </motion.div>

        {/* Contact options */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Instagram */}
          <motion.a
            href="https://www.instagram.com/sami.sweets.desserten"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card glass rounded-3xl p-8 shadow-glass flex flex-col items-center text-center gap-4
                       hover:shadow-luxury transition-all duration-300 cursor-pointer group"
            whileHover={{ y: -6, scale: 1.02 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400
                            flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
              📸
            </div>
            <div>
              <p className="text-xs text-gold uppercase tracking-widest mb-1 font-medium">Instagram</p>
              <p className="font-playfair text-xl font-bold text-chocolate">@sami.sweets.desserten</p>
              <p className="text-chocolate/55 text-sm mt-1">Stuur een DM voor je bestelling</p>
            </div>
            <span className="mt-auto px-5 py-2 rounded-full bg-chocolate text-cream text-sm font-medium
                             group-hover:bg-gold transition-colors duration-300">
              Stuur een DM →
            </span>
          </motion.a>

          {/* Phone */}
          <motion.div
            className="contact-card glass rounded-3xl p-8 shadow-glass flex flex-col items-center text-center gap-4"
            whileHover={{ y: -6, scale: 1.02 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gold/15 flex items-center justify-center text-3xl shadow-lg">
              📞
            </div>
            <div>
              <p className="text-xs text-gold uppercase tracking-widest mb-1 font-medium">Telefoon</p>
              <p className="font-playfair text-xl font-bold text-chocolate">+32 XXX XX XX XX</p>
              <p className="text-chocolate/55 text-sm mt-1">Bel of app ons voor info & bestellingen</p>
            </div>
            <motion.a
              href="tel:+32XXXXXXXXX"
              className="mt-auto px-5 py-2 rounded-full bg-chocolate text-cream text-sm font-medium
                         hover:bg-gold transition-colors duration-300"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Bel ons →
            </motion.a>
          </motion.div>
        </div>

        {/* Info strip */}
        <motion.div
          className="contact-card mt-6 glass rounded-2xl p-5 shadow-glass flex flex-wrap items-center justify-center gap-6 text-sm text-chocolate/65"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
        >
          {[
            { icon: '✅', text: '100% Halal & Alcoholvrij' },
            { icon: '🎁', text: 'Cadeaupakketten beschikbaar' },
            { icon: '🛒', text: 'Te vinden bij Delhaize & Jumbo' },
            { icon: '⚡', text: 'Snelle reactie gegarandeerd' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
