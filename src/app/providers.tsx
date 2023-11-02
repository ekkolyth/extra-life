'use client'

import { ToastContainer } from 'react-toastify'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from 'react-query'

import { ably } from '@/lib/ably'
import { AblyProvider } from 'ably/react'

export const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const providers = (
    <AblyProvider client={ably}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ToastContainer position='bottom-right' />
        </QueryClientProvider>
      </SessionProvider>
    </AblyProvider>
  )

  return providers
}
