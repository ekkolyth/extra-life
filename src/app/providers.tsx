'use client'

import { ToastContainer } from 'react-toastify'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from 'react-query'

export const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const providers = (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer position='bottom-right' />
      </QueryClientProvider>
    </SessionProvider>
  )

  return providers
}
