'use client';

import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AblyProvider } from 'ably/react';

import { ably } from '@/lib/ably';

export const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {ably ? (
        <AblyProvider client={ably}>
          {children}
          <ToastContainer position='bottom-right' />
        </AblyProvider>
      ) : (
        <>
          {children}
          <ToastContainer position='bottom-right' />
        </>
      )}
    </QueryClientProvider>
  );
}
