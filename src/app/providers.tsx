'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';
import { ClerkProvider as ClerkNextJSProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { useAuth } from '@clerk/nextjs';

// Convex client setup
if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file');
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Create Convex Query Client
new ConvexQueryClient(convex);

// Clerk Provider Component
type ClerkProviderProps = React.ComponentProps<typeof ClerkNextJSProvider>;

function ClerkProvider({ children, appearance, ...props }: ClerkProviderProps) {
  return (
    <ClerkNextJSProvider
      appearance={{
        theme: shadcn,
        ...appearance,
      }}
      signInUrl='/auth/sign-in'
      {...props}
    >
      {children}
    </ClerkNextJSProvider>
  );
}

// Theme Provider Component
function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Convex Client Provider Component
function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk
      client={convex}
      useAuth={useAuth}
    >
      {children}
    </ConvexProviderWithClerk>
  );
}

// Query Client Provider Component
function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Main Providers Component
export function Providers({ children }: { children: React.ReactNode }) {
  // Check for required Clerk environment variable
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    console.error('❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set');
    console.error(
      'Available env vars:',
      Object.keys(process.env).filter((key) => key.startsWith('NEXT_PUBLIC'))
    );
  } else {
    console.log('✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set');
  }

  return (
    <ClerkProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProviderWrapper>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </QueryClientProviderWrapper>
      </ThemeProvider>
    </ClerkProvider>
  );
}
