'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    function toggleTheme() {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <Button
            aria-label='Toggle theme'
            onClick={toggleTheme}
            size='icon'
            variant='outline'
        >
            <Sun className='h-4 w-4 rotate-0 scale-100 transition-all [html.dark_&]:-rotate-90 [html.dark_&]:scale-0' />
            <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all [html.dark_&]:rotate-0 [html.dark_&]:scale-100' />
            <span className='sr-only'>Toggle theme</span>
        </Button>
    )
}
