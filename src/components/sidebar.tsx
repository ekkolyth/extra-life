'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Calendar,
  Target,
  ArrowLeftRight,
  RotateCcw,
  DollarSign,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    name: 'Schedule',
    href: '/schedule',
    icon: Calendar,
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: Target,
  },
  {
    name: 'Randomizer',
    href: '/randomizer',
    icon: ArrowLeftRight,
  },
  {
    name: 'Rotator',
    href: '/rotator',
    icon: RotateCcw,
  },
];

const tools = [
  {
    name: 'Donation Page',
    href: '/donations',
    icon: DollarSign,
    external: false,
  },
  {
    name: 'Stream Settings',
    href: '/config',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className='flex h-full w-64 flex-col bg-black text-white'>
      {/* Logo/Branding */}
      <div className='flex h-16 items-center gap-3 px-4'>
        <div className='flex size-8 items-center justify-center rounded-lg bg-black border border-gray-700'>
          <svg
            className='size-5 text-blue-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            strokeWidth={2}
          >
            <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
          </svg>
        </div>
        <span className='font-semibold text-white'>ExtraLife</span>
      </div>

      {/* Game Day Navigation */}
      <nav className='px-4 py-4'>
        <h3 className='mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400'>
          Game Day
        </h3>
        <ul className='space-y-2'>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className='size-5 text-white' />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tools */}
      <div className='px-4 py-6'>
        <h3 className='mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400'>Tools</h3>
        <ul className='space-y-2'>
          {tools.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className='flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white'
              >
                <div className='flex items-center gap-3'>
                  <item.icon className='size-5 text-white' />
                  {item.name}
                </div>
                {item.external && <ExternalLink className='size-4 text-gray-400' />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
