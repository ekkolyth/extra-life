'use client';

import {
  ClerkLoaded,
  ClerkLoading,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import Navbar from 'src/components/navbar';
import { Header } from '@/components/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!hasClerk) {
    return (
      <div className='min-h-screen app'>
        <Header />
        <Navbar />
        <main className='flex-1 container py-6'>{children}</main>
      </div>
    );
  }

  return (
    <>
      <ClerkLoading>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-muted-foreground'>Loading authentication...</p>
          </div>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <div className='min-h-screen app'>
            <Header />
            <Navbar />
            <main className='flex-1 container py-6'>{children}</main>
          </div>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkLoaded>
    </>
  );
}
