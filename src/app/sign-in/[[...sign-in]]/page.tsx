"use client";

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold text-foreground mb-2'>ExtraLife Dashboard</h1>
          <p className='text-muted-foreground'>Sign in to manage your ExtraLife campaign</p>
        </div>
        <SignIn
          afterSignInUrl='/dashboard'
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-lg border border-border',
            },
          }}
        />
      </div>
    </div>
  );
}
