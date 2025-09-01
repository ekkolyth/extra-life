'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Navbar from 'src/components/navbar';
import { Header } from '@/components/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn && !hasRedirected) {
      setHasRedirected(true);
      const timer = setTimeout(() => {
        router.push('/sign-in');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, router, hasRedirected]);

  if (!isLoaded) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen app'>
      <Header />
      <Navbar />
      <main className='flex-1 container py-6'>{children}</main>
    </div>
  );
}
