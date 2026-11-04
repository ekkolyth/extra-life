'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { BarChart3 } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function Header() {
    return (
        <header className='flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4'>
            <SidebarTrigger />
            <div className='flex items-center gap-x-4'>
                <ModeToggle />
                <SignedOut>
                    <SignInButton>
                        <Button variant='outline'>Login</Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Link
                                href='/dashboard'
                                label='Dashboard'
                                labelIcon={<BarChart3 className='size-4' />}
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                </SignedIn>
            </div>
        </header>
    )
}
