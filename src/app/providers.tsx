'use client'

import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer position='bottom-right' />
      </QueryClientProvider>
    </>
  )
}
