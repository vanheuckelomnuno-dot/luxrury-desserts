import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/providers/LenisProvider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Maison Dorée — Luxury Desserts & Pastry',
  description: 'Artisan luxury desserts and pastries crafted with exceptional ingredients. A cinematic experience for the finest confections.',
  keywords: 'luxury desserts, artisan pastry, premium bakery, macarons, cakes, French pastry',
  openGraph: {
    title: 'Maison Dorée — Luxury Desserts & Pastry',
    description: 'Where every dessert is a masterpiece.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-cream overflow-x-hidden">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
