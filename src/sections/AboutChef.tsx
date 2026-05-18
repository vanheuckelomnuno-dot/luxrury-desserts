'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const achievements = [
  { icon: '✅', label: '100% Halal & Alcoholvrij', year: 'Altijd' },
  { icon: '🛒', label: 'Verkrijgbaar bij Delhaize', year: 'Nu' },
  { icon: '🏪', label: 'Verkrijgbaar bij Jumbo', year: 'Nu' },
  { icon: '🤝', label: 'Op maat te bestellen', year: 'Altijd' },
]

export default function AboutChef() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const bgY = useTransform(scrollYProgress, [0, 1], [20, -20])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Reveal text elements
      gsap.from('.chef-label', {
        scrollTrigger: { trigger: textRef.current, start: 'top 75%' },
        opacity: 0, x: -30, duration: 0.8, ease: 'power3.out',
      })
      gsap.from('.chef-heading', {
        scrollTrigger: { trigger: textRef.current, start: 'top 72%' },
        opacity: 0, x: -40, duration: 1.0, ease: 'power3.out', delay: 0.1,
      })
      gsap.from('.chef-bio', {
        scrollTrigger: { trigger: textRef.current, start: 'top 70%' },
        opacity: 0, y: 20, duration: 0.9, ease: 'power3.out', delay: 0.2,
      })
      gsap.from('.chef-achievement', {
        scrollTrigger: { trigger: textRef.current, start: 'top 65%' },
        opacity: 0, y: 20, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.3,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="chef"
      className="py-24 md:py-36 bg-beige relative overflow-hidden"
    >
      {/* Background texture blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blush/20 to-transparent" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/8 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div ref={textRef} className="order-2 lg:order-1 space-y-8">
            <div>
              <div className="chef-label flex items-center gap-3 mb-5">
                <div className="w-10 h-px bg-gold" />
                <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
                  Het verhaal
                </span>
              </div>

              <h2 className="chef-heading font-playfair text-5xl md:text-6xl font-bold text-chocolate leading-tight">
                Over{' '}
                <span className="text-gradient-gold italic block">Sami</span>
                <span className="text-3xl md:text-4xl font-light">Sweets</span>
              </h2>
            </div>

            <div className="chef-bio space-y-4 text-chocolate/65 text-lg leading-relaxed">
              <p>
                Sami Sweets ontstond vanuit een passie voor ambachtelijke zoetigheden die
                iedereen kan genieten — halal, alcoholvrij en gemaakt met de beste ingrediënten.
              </p>
              <p>
                Van premium Medjoul dadels tot handgeselecteerde noten en huisgemaakte desserts —
                elk product wordt met zorg en aandacht bereid.
              </p>
              <p>
                Onze producten zijn nu ook verkrijgbaar bij Delhaize en Jumbo,
                zodat je van onze ambachtelijke kwaliteit kan genieten wanneer jij wil.
              </p>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((item, i) => (
                <motion.div
                  key={i}
                  className="chef-achievement glass rounded-xl p-4 flex items-start gap-3"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-medium text-chocolate text-sm">{item.label}</p>
                    <p className="text-gold text-xs font-medium">{item.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-chocolate
                         text-cream text-sm font-medium shadow-luxury hover:bg-gold transition-all duration-300"
            >
              Neem contact op
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </div>

          {/* Right — Image / Visual */}
          <div className="order-1 lg:order-2 relative">
            <motion.div
              ref={imageRef}
              style={{ y: imageY }}
              className="relative"
            >
              {/* Main image placeholder */}
              {/* Replace with: <Image src="/images/chef-isabelle.jpg" fill alt="Chef Isabelle" className="object-cover" /> */}
              <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-luxury">
                <div className="w-full h-full bg-gradient-to-br from-blush/60 via-beige to-gold/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 rounded-full bg-chocolate/10 flex items-center justify-center mx-auto">
                      <span className="text-6xl">🍬</span>
                    </div>
                    <div>
                      <p className="font-playfair text-2xl font-bold text-chocolate">Sami Sweets</p>
                      <p className="text-gold text-sm">Ambachtelijke Zoetwaren</p>
                    </div>
                  </div>
                </div>

                {/* Inner glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/20 to-transparent" />
              </div>

              {/* Floating decoration shape — background blob */}
              <motion.div
                style={{ y: bgY }}
                className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-gold/15 blur-2xl -z-10"
              />
              <motion.div
                style={{ y: bgY }}
                className="absolute -bottom-8 -left-8 w-52 h-52 rounded-full bg-blush/30 blur-3xl -z-10"
              />

              {/* Quote card */}
              <motion.div
                className="absolute -left-6 bottom-16 glass rounded-2xl p-4 max-w-[220px] shadow-glass"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="font-playfair text-sm italic text-chocolate leading-relaxed">
                  "Gemaakt met liefde, voor iedereen te genieten."
                </p>
                <p className="text-gold text-xs mt-2 font-medium">— Sami Sweets</p>
              </motion.div>

              {/* Signature line */}
              <motion.div
                className="absolute -right-4 top-12 glass rounded-2xl p-3 shadow-glass"
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gold text-sm">★</span>
                  ))}
                </div>
                <p className="text-xs text-chocolate/60 mt-1">Klanten zijn blij!</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
