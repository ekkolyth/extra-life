import type { Metadata } from 'next'

import { Providers } from './providers'
import { ClerkProvider } from '@/components/clerk-provider'

import './globals.css'

export const metadata: Metadata = {
  title: 'Extra Life Dashboard'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className='dark'>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
