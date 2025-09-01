'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangleIcon } from 'lucide-react';

export function EnvCheck() {
  const missingVars = [];

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    missingVars.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }

  if (!process.env.NEXT_PUBLIC_DONORDRIVE_ID) {
    missingVars.push('NEXT_PUBLIC_DONORDRIVE_ID');
  }

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    missingVars.push('NEXT_PUBLIC_CONVEX_URL');
  }

  if (missingVars.length === 0) {
    return null;
  }

  return (
    <Card className='border-destructive'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-destructive'>
          <AlertTriangleIcon className='h-5 w-5' />
          Missing Environment Variables
        </CardTitle>
        <CardDescription>
          The following environment variables are required but not set:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='list-disc list-inside space-y-1'>
          {missingVars.map((varName) => (
            <li key={varName} className='font-mono text-sm'>
              {varName}
            </li>
          ))}
        </ul>
        <p className='mt-4 text-sm text-muted-foreground'>
          Please create a <code className='bg-muted px-1 rounded'>.env.local</code> file in the root
          directory with these variables.
        </p>
      </CardContent>
    </Card>
  );
}
