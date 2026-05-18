'use client'

import { useEffect, useRef, useState } from 'react'
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

const occasions = [
  'Huwelijksfeest',
  'Verjaardag',
  'Ramadan / Eid',
  'Bedrijfsevent',
  'Cadeau',
  'Op maat',
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [selectedOccasion, setSelectedOccasion] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

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
      gsap.from('.contact-form', {
        scrollTrigger: { trigger: formRef.current, start: 'top 80%' },
        opacity: 0, y: 40, duration: 1.0, ease: 'power3.out', delay: 0.2,
      })
      gsap.from('.contact-info', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        opacity: 0, x: -30, duration: 0.9, ease: 'power3.out', delay: 0.15,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    setSubmitted(true)
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 md:py-36 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #FFFDF8 0%, #F6EEE3 40%, #FFD6E0 100%)',
      }}
    >
      {/* Background particles / glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-blush/30 blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gold/15 blur-[100px]" />
        {/* Floating particles */}
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

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="contact-label flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
              Neem contact op
            </span>
            <div className="w-12 h-px bg-gold" />
          </div>
          <h2 className="contact-heading font-playfair text-5xl md:text-6xl font-bold text-chocolate leading-tight">
            Stuur ons{' '}
            <span className="text-gradient-gold italic">een bericht</span>
          </h2>
          <p className="mt-4 text-chocolate/55 max-w-md mx-auto text-lg">
            Vraag? Bestelling? Samenwerking? We horen graag van je.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left — contact info */}
          <div className="contact-info lg:col-span-2 space-y-8">
            <div className="glass rounded-3xl p-8 shadow-glass space-y-6">
              <div>
                <p className="font-playfair text-2xl font-bold text-chocolate mb-2">Sami Sweets</p>
                <p className="text-chocolate/55 text-sm leading-relaxed">
                  Ambachtelijke desserts, dadels & noten<br />
                  Halal · Alcoholvrij · Op maat
                </p>
              </div>

              {[
                { icon: '📸', label: 'Instagram', value: '@sami.sweets.desserten' },
                { icon: '✉️', label: 'Email', value: 'info@samisweets.be' },
                { icon: '🛒', label: 'Winkels', value: 'Delhaize & Jumbo\nOok online te bestellen' },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 text-lg">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gold uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className="text-chocolate text-sm whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="glass rounded-2xl p-6 shadow-glass">
              <p className="text-xs text-gold uppercase tracking-widest mb-4 font-medium">Volg ons op Instagram</p>
              <motion.a
                href="https://www.instagram.com/sami.sweets.desserten"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -2 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-chocolate/5 hover:bg-chocolate hover:text-cream
                           transition-all duration-300 text-sm font-medium text-chocolate"
              >
                <span className="text-xl">📸</span>
                @sami.sweets.desserten
              </motion.a>
              <p className="text-chocolate/40 text-xs mt-2">514 volgers · 27 berichten</p>
            </div>
          </div>

          {/* Right — form */}
          <div className="contact-form lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-3xl p-12 text-center shadow-luxury"
              >
                <div className="text-6xl mb-6">🎂</div>
                <h3 className="font-playfair text-3xl font-bold text-chocolate mb-3">
                  Bedankt!
                </h3>
                <p className="text-chocolate/60 leading-relaxed">
                  Je bericht is ontvangen. We nemen zo snel mogelijk contact met je op,
                  normaal gezien binnen 24 uur.
                </p>
                <div className="mt-6 flex gap-0.5 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gold">★</span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="glass rounded-3xl p-8 shadow-luxury space-y-6"
              >
                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                  ].map((field) => (
                    <div key={field.id} className="relative">
                      <label
                        htmlFor={field.id}
                        className={`absolute left-4 text-sm font-medium transition-all duration-300 pointer-events-none
                          ${focusedField === field.id || formData[field.id as keyof typeof formData]
                            ? '-top-2.5 text-xs text-gold bg-cream px-1 rounded'
                            : 'top-3.5 text-chocolate/40'
                          }`}
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                        onFocus={() => setFocusedField(field.id)}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-4 py-3.5 rounded-xl bg-cream/80 border text-chocolate text-sm
                                    outline-none transition-all duration-300 placeholder-transparent
                                    ${focusedField === field.id
                                      ? 'border-gold shadow-[0_0_0_3px_rgba(212,175,55,0.15)]'
                                      : 'border-chocolate/15 hover:border-chocolate/30'
                                    }`}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                {/* Occasion */}
                <div>
                  <p className="text-xs text-gold uppercase tracking-widest mb-3 font-medium">Occasion</p>
                  <div className="flex flex-wrap gap-2">
                    {occasions.map((occasion) => (
                      <motion.button
                        key={occasion}
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedOccasion(occasion)}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200
                          ${selectedOccasion === occasion
                            ? 'bg-chocolate text-cream border-chocolate'
                            : 'bg-cream/60 text-chocolate/70 border-chocolate/15 hover:border-gold/50'
                          }`}
                      >
                        {occasion}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="relative">
                  <label
                    htmlFor="message"
                    className={`absolute left-4 text-sm font-medium transition-all duration-300 pointer-events-none
                      ${focusedField === 'message' || formData.message
                        ? '-top-2.5 text-xs text-gold bg-cream px-1 rounded'
                        : 'top-4 text-chocolate/40'
                      }`}
                  >
                    Your Vision
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    required
                    className={`w-full px-4 py-4 rounded-xl bg-cream/80 border text-chocolate text-sm
                                outline-none transition-all duration-300 resize-none placeholder-transparent
                                ${focusedField === 'message'
                                  ? 'border-gold shadow-[0_0_0_3px_rgba(212,175,55,0.15)]'
                                  : 'border-chocolate/15 hover:border-chocolate/30'
                                }`}
                    placeholder="Tell us your dream..."
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-chocolate text-cream font-medium text-base
                             hover:bg-gold transition-all duration-300 shadow-luxury
                             flex items-center justify-center gap-3"
                >
                  Stuur bericht
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>

                <p className="text-center text-xs text-chocolate/40">
                  We antwoorden persoonlijk binnen 24 uur. Jouw gegevens blijven vertrouwelijk.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
