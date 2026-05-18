import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/providers/LenisProvider'
import ErrorBoundary from '@/components/providers/ErrorBoundary'

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
  title: 'Sami Sweets — Desserten · Dadels · Noten',
  description: 'Ambachtelijke desserts, dadels en noten. 100% Halal & alcoholvrij. Te vinden in Delhaize en Jumbo.',
  keywords: 'sami sweets, halal desserts, dadels, noten, ambachtelijk, alcoholvrij, delhaize, jumbo, belgische patisserie',
  openGraph: {
    title: 'Sami Sweets — Desserten · Dadels · Noten',
    description: 'Ambachtelijk. Halal. Alcoholvrij.',
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
        <ErrorBoundary>
          <LenisProvider>
            {children}
          </LenisProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
