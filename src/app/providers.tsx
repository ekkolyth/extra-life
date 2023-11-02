'use client'

import * as Ably from 'ably'
import { AblyProvider } from 'ably/react'
import { ToastContainer } from 'react-toastify'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from 'react-query'

export const queryClient = new QueryClient()
const ablyClient = new Ably.Realtime.Promise({ key: process.env.NEXT_PUBLIC_ABLY_KEY, clientId: 'extralife-dash' })

export function Providers({ children }: { children: React.ReactNode }) {
  const providers = (
    <AblyProvider client={ablyClient}>
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
