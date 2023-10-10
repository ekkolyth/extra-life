'use client'

import { CalendarIcon } from '@heroicons/react/24/outline'
import { ControllerIcon } from 'src/components/icons/controller'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import Link from 'next/link'

const Navbar = () => {
  const route = usePathname()
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: ControllerIcon, current: route === '/admin' },
    // { name: 'Rewards', href: '/rewards', icon: DiceIcon, current: route === '/rewards' },
    // { name: 'Overlays', href: '/overlays', icon: ComputerDesktopIcon, current: route === '/overlays' },
    { name: 'Schedule', href: '/admin/schedule', icon: CalendarIcon, current: route === '/admin/schedule' }
    // { name: 'Settings', href: '/settings', icon: AdjustmentsHorizontalIcon, current: route === '/settings' }
  ]

  return (
    <header className='flex justify-between p-4 border-b'>
      <div className='flex items-center gap-8'>
        <h1 className='scroll-m-20 text-3xl font-semibold tracking-tight'>ExtraLife Dash</h1>
        <nav className='flex gap-2'>
          {navigation.map(item => (
            <Button key={item.name} variant={item.current ? 'default' : 'link'} asChild>
              <Link href={item.href} className='flex gap-3'>
                <item.icon className='h-6 w-6' aria-hidden='true' />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <Button>Sign out</Button>
    </header>
  )
}

export default Navbar
