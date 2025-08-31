'use client'

import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AblyProvider } from 'ably/react'

import { ably } from '@/lib/ably'

export const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AblyProvider client={ably}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer position='bottom-right' />
      </QueryClientProvider>
    </AblyProvider>
  )
}
