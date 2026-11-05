'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Header } from '@/components/header'
import { AppSidebar } from '@/components/navbar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isLoaded, isSignedIn } = useAuth()
    const router = useRouter()
    const hasRedirected = useRef(false)

    // the short delay lets a sign-out finish its own navigation home before this guard kicks in
    useEffect(() => {
        if (!isLoaded || isSignedIn || hasRedirected.current) return
        const timer = setTimeout(() => {
            hasRedirected.current = true
            router.push('/auth/sign-in')
        }, 100)
        return () => clearTimeout(timer)
    }, [isLoaded, isSignedIn, router])

    if (!isLoaded) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-background'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full size-8 border-b-2 border-primary mx-auto mb-4'></div>
                    <p className='text-muted-foreground'>
                        Loading authentication...
                    </p>
                </div>
            </div>
        )
    }

    if (!isSignedIn) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-background'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
                    <p className='text-muted-foreground'>
                        Redirecting to sign in...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <SidebarProvider className='h-svh'>
            <AppSidebar />
            <SidebarInset className='min-w-0'>
                <Header withSidebarTrigger />
                <div className='flex-1 min-h-0 container p-4 overflow-auto [scrollbar-gutter:stable]'>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
