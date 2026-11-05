'use client'

import { ClerkProvider as ClerkNextJSProvider, useAuth } from '@clerk/nextjs'
import { shadcn } from '@clerk/themes'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { usePathname } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReactNode, useState } from 'react'

// Convex client setup
if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)
const overlayConvex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

// Clerk Provider Component
type ClerkProviderProps = React.ComponentProps<typeof ClerkNextJSProvider>

function ClerkProvider({ children, appearance, ...props }: ClerkProviderProps) {
    return (
        <ClerkNextJSProvider
            afterSignOutUrl='/'
            appearance={{
                theme: shadcn,
                ...appearance,
            }}
            signInForceRedirectUrl='/dashboard'
            signInUrl='/auth/sign-in'
            {...props}
        >
            {children}
        </ClerkNextJSProvider>
    )
}

// Theme Provider Component
function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Convex Client Provider Component
function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
        </ConvexProviderWithClerk>
    )
}

// Query Client Provider Component
function QueryClientProviderWrapper({
    children,
    client: convexClient = convex,
}: {
    children: ReactNode
    client?: ConvexReactClient
}) {
    const [queryClient] = useState(() => {
        const convexQueryClient = new ConvexQueryClient(convexClient)
        const client = new QueryClient({
            defaultOptions: {
                queries: {
                    queryKeyHashFn: convexQueryClient.hashFn(),
                    queryFn: convexQueryClient.queryFn(),
                    staleTime: 60 * 1000, // 1 minute
                    refetchOnWindowFocus: false,
                },
            },
        })
        convexQueryClient.connect(client)
        return client
    })

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

// Main Providers Component
export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    if (pathname === '/overlay') {
        return (
            <ConvexProvider client={overlayConvex}>
                <QueryClientProviderWrapper client={overlayConvex}>
                    {children}
                </QueryClientProviderWrapper>
            </ConvexProvider>
        )
    }

    // Check for required Clerk environment variable
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        console.error('❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set')
        console.error(
            'Available env vars:',
            Object.keys(process.env).filter((key) =>
                key.startsWith('NEXT_PUBLIC')
            )
        )
    } else {
        console.log('✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set')
    }

    return (
        <ClerkProvider>
            <ThemeProvider
                attribute='class'
                defaultTheme='system'
                disableTransitionOnChange
                enableSystem
                // the theme script only needs to run from the server html; a data-block
                // type on client renders stops React 19 erroring on a non-executing script
                scriptProps={{
                    type:
                        typeof window === 'undefined'
                            ? undefined
                            : 'application/json',
                }}
            >
                <QueryClientProviderWrapper>
                    <ConvexClientProvider>{children}</ConvexClientProvider>
                </QueryClientProviderWrapper>
            </ThemeProvider>
        </ClerkProvider>
    )
}
