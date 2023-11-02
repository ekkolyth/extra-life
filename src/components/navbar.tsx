'use client'

import { CalendarIcon } from '@heroicons/react/24/outline'
import { ControllerIcon } from 'src/components/icons/controller'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { TrophyIcon } from '@heroicons/react/24/solid'
import { BugIcon, CogIcon, FerrisWheelIcon, HistoryIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Navbar = () => {
  const { data } = useSession()
  const route = usePathname()
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: ControllerIcon, current: route === '/admin' },
    { name: 'Schedule', href: '/admin/schedule', icon: CalendarIcon, current: route === '/admin/schedule' },
    { name: 'Goals', href: '/admin/goals', icon: TrophyIcon, current: route === '/admin/goals' },
    { name: 'Randomizer', href: '/admin/randomizer', icon: FerrisWheelIcon, current: route === '/admin/randomizer' },
    { name: 'Rotator', href: '/admin/rotator', icon: HistoryIcon, current: route === '/admin/rotator' }
    // { name: 'Config', href: '/admin/config', icon: CogIcon, current: route === '/admin/config' },
    // { name: 'Debug', href: '/admin/debug', icon: BugIcon, current: route === '/admin/debug' }
  ]

  return (
    <div className='border-b'>
      <header className='container space-y-2 py-2'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-8'>
            <h1 className='scroll-m-20 text-3xl font-semibold tracking-tight'>ExtraLife Dash</h1>
          </div>
          <div className='flex gap-4 -mb-8 mt-2'>
            <Avatar>
              <AvatarImage src={data?.user?.image ?? ''} />
              <AvatarFallback>{data?.user?.name?.slice(1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className='font-semibold'>{data?.user?.name}</p>
              <Button size='sm' variant='link' onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
        <nav className='flex gap-2 overflow-x-scroll no-scrollbars'>
          {navigation.map(item => (
            <Button key={item.name} variant={item.current ? 'outline' : 'link'} size='sm' asChild>
              <Link href={item.href} className='flex gap-3'>
                <item.icon className='h-6 w-6' aria-hidden='true' />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </header>
    </div>
  )
}

export default Navbar
