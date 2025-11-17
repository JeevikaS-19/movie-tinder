import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MovieMingle - Find Your Next Favorite Film',
  description: 'Swipe through popular movies and discover your next favorite film with MovieMingle. Built with React and Next.js',
  keywords: ['movies', 'tinder', 'swipe', 'films'],
  authors: [{ name: 'MovieMingle' }],
  creator: 'MovieMingle',
  generator: 'Next.js 16',
  openGraph: {
    title: 'MovieMingle - Find Your Next Favorite Film',
    description: 'Swipe through popular movies and discover your next favorite film',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
