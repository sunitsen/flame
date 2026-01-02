import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { ChatAssistant } from '@/components/ordering-assistant/chat-assistant'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Food Ordering App',
  description: 'Premium food ordering experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SmoothScrollProvider>
            <ToastProvider />
            {children}
            <ChatAssistant />
          </SmoothScrollProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
