'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { TrophyIcon } from '@heroicons/react/24/solid';
import { BugIcon, FerrisWheelIcon, HistoryIcon, CalendarIcon } from 'lucide-react';

import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ControllerIcon } from 'src/components/icons/controller';

function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  return (
    <div className='flex gap-4 -mb-8 mt-2'>
      <Avatar>
        <AvatarImage src={user?.imageUrl ?? ''} />
        <AvatarFallback>{user?.fullName?.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div>
        <p className='font-semibold'>{user?.fullName}</p>
        <Button size='sm' variant='link' onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    </div>
  );
}

const Navbar = () => {
  const route = usePathname();
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: ControllerIcon,
      current: route === '/dashboard',
    },
    {
      name: 'Schedule',
      href: '/dashboard/schedule',
      icon: CalendarIcon,
      current: route === '/dashboard/schedule',
    },
    {
      name: 'Goals',
      href: '/dashboard/goals',
      icon: TrophyIcon,
      current: route === '/dashboard/goals',
    },
    {
      name: 'Randomizer',
      href: '/dashboard/randomizer',
      icon: FerrisWheelIcon,
      current: route === '/dashboard/randomizer',
    },
    {
      name: 'Rotator',
      href: '/dashboard/rotator',
      icon: HistoryIcon,
      current: route === '/dashboard/rotator',
    },
    {
      name: 'Debug',
      href: '/dashboard/debug',
      icon: BugIcon,
      current: route === '/dashboard/debug',
    },
  ];

  return (
    <div className='border-b'>
      <header className='container space-y-2 py-2'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-8'>
            <h1 className='scroll-m-20 text-3xl font-semibold tracking-tight'>ExtraLife Dash</h1>
          </div>
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <UserMenu /> : null}
        </div>
        <nav className='flex gap-2 overflow-x-scroll no-scrollbars'>
          {navigation.map((item) => (
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
  );
};

export default Navbar;
