'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { BarChart3 } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'

export function Header() {
    return (
        <header className='flex h-16 items-center justify-end gap-4 border-b border-border bg-background px-4'>
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
