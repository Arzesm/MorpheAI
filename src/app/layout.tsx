import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import RegisterServiceWorker from './register-sw'

export const metadata: Metadata = {
  title: 'MorpheAI - Dream Journal & Meditation',
  description: 'Your personal AI-powered dream journal, meditation, and subconscious exploration companion',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MorpheAI',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover' as const,
  themeColor: '#0A1120',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-night-deep-blue text-mythic-ivory">
        <RegisterServiceWorker />
        <div className="min-h-screen pb-24">
          <main className="container mx-auto max-w-md px-5 pt-6">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}

