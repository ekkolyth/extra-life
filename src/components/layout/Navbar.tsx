import { CalendarIcon, ComputerDesktopIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { classNames } from '../../utils/style'
import logo from 'src/assets/logo/default-monochrome.svg'
import ControllerIcon from '../icons/Controller'
import DiceIcon from '../icons/Dice'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

const Navbar = () => {
  const { route } = useRouter()
  const { data: session } = useSession()
  const navigation = [
    { name: 'Dashboard', href: '/', icon: ControllerIcon, current: route === '/' },
    { name: 'Rewards', href: '/rewards', icon: DiceIcon, current: route === '/rewards' },
    { name: 'Overlays', href: '/overlays', icon: ComputerDesktopIcon, current: route === '/overlays' },
    { name: 'Schedule', href: '/schedule', icon: CalendarIcon, current: route === '/schedule' },
    { name: 'Settings', href: '/settings', icon: AdjustmentsHorizontalIcon, current: route === '/settings' }
  ]

  console.log(session)

  return (
    <div className='flex min-h-0 w-64 flex-col bg-el-dark-blue'>
      <div className='flex flex-1 flex-col overflow-y-auto pt-5 pb-4'>
        <div className='flex flex-shrink-0 items-center px-4'>
          <Image height={45} width={300} src={logo.src} alt='GnomeBoard' />
        </div>
        <nav className='mt-5 flex-1 space-y-1 px-2' aria-label='Sidebar'>
          {navigation.map(item => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current ? 'bg-sky-800 text-white' : 'text-sky-100 hover:bg-sky-600 hover:bg-opacity-75',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              )}>
              <item.icon className='mr-3 h-6 w-6 flex-shrink-0 text-white' aria-hidden='true' />
              {item.name}
            </a>
          ))}
        </nav>
      </div>
      <div className='flex flex-shrink-0 p-4'>
        <button onClick={() => signOut()} className='text-sm font-medium text-white w-full text-center'>
          Sign out {session?.user?.name}
        </button>
      </div>
    </div>
  )
}

export default Navbar
