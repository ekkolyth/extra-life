"use client";

import { SignIn } from '@clerk/nextjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SignInPage() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Authentication not configured</CardTitle>
            <CardDescription>
              Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to enable sign in.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle>ExtraLife Dashboard</CardTitle>
          <CardDescription>
            Sign in to manage your ExtraLife campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignIn
            afterSignInUrl='/dashboard'
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'shadow-none border border-border',
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
