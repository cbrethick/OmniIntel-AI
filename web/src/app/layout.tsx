import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'OmniBot AI — Intelligent Customer Intelligence Platform',
  description: 'Multi-agent AI system for Sales, Support, and Customer Care — FlowZint AI Hackathon 2026',
  keywords: ['AI', 'chatbot', 'customer care', 'sales bot', 'support bot', 'LangGraph'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-dark-900 text-white font-body antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1c1e32', color: '#fff', border: '1px solid rgba(92,111,255,0.2)' },
          }}
        />
      </body>
    </html>
  )
}
