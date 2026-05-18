'use client'

import { motion } from 'framer-motion'

const footerLinks = {
  Collectie: ['Desserten', 'Dadels', 'Noten', 'Cadeaupakketten', 'Seizoensspecials'],
  Winkels: ['Delhaize', 'Jumbo', 'Online bestellen', 'Afhalen', 'Cadeauverpakking'],
  Info: ['Ons verhaal', 'Halal & Alcoholvrij', 'Instagram', 'Contact', 'Samenwerking'],
}

const socialLinks = [
  { name: 'Instagram', icon: '📸', href: 'https://www.instagram.com/sami.sweets.desserten' },
  { name: 'Facebook', icon: '💙', href: '#' },
  { name: 'TikTok', icon: '🎵', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-chocolate text-cream relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gold/5 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-blush/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Top separator with glow */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-16 mt-0" />

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-12 pb-16">
          {/* Brand column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-playfair font-bold">S</span>
              </div>
              <span className="font-playfair text-2xl font-bold text-cream">
                Sami <span className="shimmer-gold">Sweets</span>
              </span>
            </div>

            <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
              Ambachtelijke desserts, premium dadels & handgeselecteerde noten.
              100% Halal & alcoholvrij. Verkrijgbaar bij Delhaize & Jumbo.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-10 h-10 rounded-xl bg-cream/5 hover:bg-gold
                             flex items-center justify-center text-base
                             transition-all duration-300 border border-cream/10 hover:border-gold"
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-xs text-gold uppercase tracking-widest mb-3 font-medium">
                Blijf op de hoogte
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 rounded-l-xl bg-cream/8 border border-cream/15
                             text-cream text-sm outline-none placeholder-cream/35
                             focus:border-gold/50 transition-colors duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2.5 rounded-r-xl bg-gold text-chocolate text-sm font-medium
                             hover:bg-gold-light transition-colors duration-200"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="font-playfair font-semibold text-cream/90 text-sm uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 4 }}
                      className="text-cream/50 text-sm hover:text-gold transition-colors duration-200 inline-block"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cream/10 to-transparent" />

        {/* Bottom row */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/40">
          <div className="flex items-center gap-2">
            <span suppressHydrationWarning>© {new Date().getFullYear()} Sami Sweets.</span>
            <span>All rights reserved.</span>
          </div>

          {/* Gold divider ornament */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-px bg-gold/40" />
            <span className="text-gold font-playfair italic text-sm">
              Gemaakt met Passie
            </span>
            <div className="w-6 h-px bg-gold/40" />
          </div>

          <div className="flex gap-5">
            {['Privacy Policy', 'Terms', 'Cookies'].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-gold transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
